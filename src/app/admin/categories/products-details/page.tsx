'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
     getAllProducts,
     getProductById,
     createProduct,
     updateProduct,
     deleteProduct,
} from '@/services/ProductService';
import { uploadProductImages } from '@/services/MediaService';
import { ProductRequest, ProductResponse, ProductAttribute } from '@/types/Product';
import { MediaResponse } from '@/types'; // Thêm import này
import { Page as PageType } from '@/types';
import {
     Box,
     Typography,
     Paper,
     CircularProgress,
     Table,
     TableHead,
     TableRow,
     TableCell,
     TableBody,
     IconButton,
     Button,
     Dialog,
     DialogTitle,
     DialogContent,
     DialogActions,
     TextField,
     Tooltip,
     MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EditAttributesIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery as useQueryCategories } from '@tanstack/react-query';
import { getProductCategoryTree } from '@/services/CategoryService';

type FormMode = 'add' | 'edit';

const defaultForm: ProductRequest = {
     name: '',
     description: '',
     image: '',
     price: 0,
     discountPercent: 0,
     specialPrice: undefined,
     stockQuantity: 0,
     isEnabled: true,
     isActive: true,
     brandId: undefined,
     categoryIds: null,
     attributes: null,
};

export default function AdminProductDetailsPage() {
  // Add new state for temporary page size
  const [tempSize, setTempSize] = useState<string>('10');

     const queryClient = useQueryClient();

     // State
     const [openDialog, setOpenDialog] = useState(false);
     const [formMode, setFormMode] = useState<FormMode>('add');
     const [form, setForm] = useState<ProductRequest>(defaultForm);
     const [selectedId, setSelectedId] = useState<number | null>(null);
     const [openAttrDialog, setOpenAttrDialog] = useState(false);
     const [attrList, setAttrList] = useState<ProductAttribute[]>([]);
     const [editingAttr, setEditingAttr] = useState(false);
     const [attrEditList, setAttrEditList] = useState<ProductAttribute[]>([]);
     const [attrEditProductId, setAttrEditProductId] = useState<number | null>(null);
     const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
     const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
     const [openImageDialog, setOpenImageDialog] = useState(false);
     const [imageList, setImageList] = useState<string[]>([]);
     const [imageProductId, setImageProductId] = useState<number | null>(null);
     const [uploading, setUploading] = useState(false);
     const [openDetailDialog, setOpenDetailDialog] = useState(false);
     const [detailProduct, setDetailProduct] = useState<ProductResponse | null>(null);
     const [page, setPage] = useState(0);
     const [size, setSize] = useState(10);

     // Fetch all products with paging
     const { data: pageData, isLoading, error, refetch } = useQuery<PageType<ProductResponse>>({
          queryKey: ['products-flat', page, size],
          queryFn: async () => {
               // Gọi getAllProducts với page, size, ép kiểu cho đúng Page<ProductResponse>
               const res = await getAllProducts(page, size);
               // Nếu res.result.content là ProductShortResponse[] thì cần map sang ProductResponse[] nếu cần
               // Chuyển đổi từng phần tử nếu thiếu field
               const pageResult = res.result as any;
               if (pageResult && Array.isArray(pageResult.content)) {
                    pageResult.content = pageResult.content.map((item: any) => ({
                         // Copy all existing fields
                         ...item,
                         // Add missing fields with default values if not present
                         stockQuantity: item.stockQuantity ?? 0,
                         quantitySold: item.quantitySold ?? 0,
                         updatedAt: item.updatedAt ?? '',
                         brandSlug: item.brandSlug ?? '',
                         images: item.images ?? [],
                         attributes: item.attributes ?? [],
                         createdAt: item.createdAt ?? '',
                         isActive: item.isActive ?? true,
                         isEnabled: item.isEnabled ?? true,
                         price: item.price ?? 0,
                         discountPercent: item.discountPercent ?? 0,
                         specialPrice: item.specialPrice ?? undefined,
                         description: item.description ?? '',
                         name: item.name ?? '',
                         slug: item.slug ?? '',
                         id: item.id,
                         categorySlugs: item.categorySlugs ?? [],
                    }));
               }
               return pageResult as PageType<ProductResponse>;
          },
     });

     // Fetch product by id for edit/view attributes
     const { refetch: refetchDetail, data: detailData } = useQuery({
          queryKey: ['product-detail', selectedId],
          queryFn: async () => selectedId ? (await getProductById(selectedId)).result : null,
          enabled: false,
     });

     // Lấy danh sách category (ngành hàng) đã cache
     const { data: allCategories } = useQueryCategories({
          queryKey: ['categories-flat'],
          queryFn: async () => (await import('@/services/CategoryService')).getAllCategories().then(res => res.result),
     });

     // Lấy tree ngành hàng (category tree)
     const { data: categoryTree } = useQueryCategories({
          queryKey: ['product-category-tree'],
          queryFn: async () => (await getProductCategoryTree()).result,
     });

     // Helper: flatten tree to get all descendant ids
     const getAllDescendantIds = (node: any): number[] => {
          let ids: number[] = [node.id];
          if (node.children && node.children.length > 0) {
               node.children.forEach((child: any) => {
                    ids = ids.concat(getAllDescendantIds(child));
               });
          }
          return ids;
     };

     // Helper: lấy tất cả category con (bao gồm cả cha) dựa vào id cha từ allCategories
     const getAllDescendantIdsFromFlat = (parentId: number, allCats: any[]): number[] => {
          const result: number[] = [parentId];
          const stack = [parentId];
          while (stack.length > 0) {
               const currentId = stack.pop();
               const children = allCats.filter(cat => cat.parentId === currentId);
               for (const child of children) {
                    result.push(child.id);
                    stack.push(child.id);
               }
          }
          return result;
     };

     // Helper: lấy tất cả ngành cha (bao gồm chính nó) dựa vào id category từ allCategories
     const getAllParentIds = (catId: number, allCats: any[]): number[] => {
          const result: number[] = [];
          let current = allCats.find(cat => cat.id === catId);
          while (current) {
               result.unshift(current.id); // Đảm bảo thứ tự từ gốc đến lá
               if (current.parentId == null) break;
               current = allCats.find(cat => cat.id === current.parentId);
          }
          return result;
     };

     // Handler: chọn một ngành (add cả ngành cha và con)
     const handleSelectCategoryTree = (cat: any) => {
          const ids = getAllDescendantIds(cat);
          setForm(f => ({
               ...f,
               categoryIds: Array.from(new Set([...(f.categoryIds || []), ...ids]))
          }));
     };

     // Handler: chọn một ngành (add cả ngành cha và con từ allCategories)
     const handleSelectCategoryFlat = (cat: any) => {
          if (!allCategories) return;
          const ids = getAllDescendantIdsFromFlat(cat.id, allCategories);
          setForm(f => ({
               ...f,
               categoryIds: Array.from(new Set([...(f.categoryIds || []), ...ids]))
          }));
     };

     // Handler: chọn một ngành (add ngành cha lên đến gốc)
     const handleSelectCategoryWithParents = (cat: any) => {
          if (!allCategories) return;
          const ids = getAllParentIds(cat.id, allCategories);
          setForm(f => ({
               ...f,
               categoryIds: Array.from(new Set([...(f.categoryIds || []), ...ids]))
          }));
     };

     // Handler: xóa một ngành đã chọn (loại bỏ cả ngành cha và con)
     const handleRemoveCategoryTree = (cat: any) => {
          const ids = getAllDescendantIds(cat);
          setForm(f => ({
               ...f,
               categoryIds: (f.categoryIds || []).filter(id => !ids.includes(id))
          }));
     };

     // Handler: xóa một ngành đã chọn (loại bỏ cả ngành cha và con từ allCategories)
     const handleRemoveCategoryFlat = (cat: any) => {
          if (!allCategories) return;
          const ids = getAllDescendantIdsFromFlat(cat.id, allCategories);
          setForm(f => ({
               ...f,
               categoryIds: (f.categoryIds || []).filter(id => !ids.includes(id))
          }));
     };

     // Handler: xóa một ngành đã chọn (loại bỏ ngành đó và các ngành cha nếu không còn ngành con nào thuộc cha đó)
     const handleRemoveCategoryWithParents = (cat: any) => {
          if (!allCategories) return;
          // Xóa ngành này khỏi danh sách
          setForm(f => {
               let newIds = (f.categoryIds || []).filter(id => id !== cat.id);
               // Xóa các ngành cha nếu không còn ngành con nào thuộc cha đó
               let current = allCategories.find(c => c.id === cat.id);
               while (current && current.parentId != null) {
                    const siblings = current && current.parentId !== undefined
                         ? allCategories.filter(c => current && c.parentId === current.parentId && c.id !== current.id)
                         : [];
                    const hasSiblingSelected = siblings.some(sib => newIds.includes(sib.id));
                    if (!hasSiblingSelected && current && current.parentId !== undefined) {
                         if (current && typeof current.parentId !== 'undefined') {
                              newIds = newIds.filter(id => id !== current?.parentId);
                         }
                    }
                    current = (current && current.parentId !== undefined && current.parentId !== null)
                         ? allCategories.find(c => c.id === current?.parentId)
                         : undefined;
               }
               return { ...f, categoryIds: newIds };
          });
     };

     // Helper: lấy danh sách ngành đã chọn (chỉ ngành cha, không lặp ngành con đã thuộc cha)
     const selectedCategoryNodes = (categoryTree || []).filter((cat: any) =>
          form.categoryIds?.includes(cat.id)
     );

     // Helper: render tree dropdown
     const renderCategoryTreeOptions = (nodes: any[], level = 0): React.ReactNode[] => {
          return [
               ...nodes.map(node => (
                    <MenuItem
                         key={node.id}
                         value={node.id}
                         sx={{ pl: 2 + level * 2 }}
                         onClick={() => handleSelectCategoryTree(node)}
                         disabled={form.categoryIds?.includes(node.id)}
                    >
                         {node.name}
                    </MenuItem>
               )),
               ...nodes.flatMap(node =>
                    node.children && node.children.length > 0
                         ? renderCategoryTreeOptions(node.children, level + 1)
                         : []
               )
          ];
     };

     // Handle detailData for edit
     React.useEffect(() => {
          if (!detailData) return;
          if (formMode === 'edit') setForm({
               id: detailData.id,
               name: detailData.name,
               description: detailData.description,
               price: detailData.price,
               discountPercent: detailData.discountPercent,
               specialPrice: detailData.specialPrice,
               stockQuantity: detailData.stockQuantity,
               isEnabled: detailData.isEnabled,
               isActive: detailData.isActive,
               brandId: undefined, // map if needed
               categoryIds: [], // map if needed
               attributes: detailData.attributes,
          });
     }, [detailData, formMode]);

     // Mutations
     const addMutation = useMutation({
          mutationFn: (payload: ProductRequest) => createProduct(payload),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['products-flat'] });
               setOpenDialog(false);
               setForm(defaultForm);
          },
     });

     const editMutation = useMutation({
          mutationFn: (payload: ProductRequest) => updateProduct(payload),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['products-flat'] });
               setOpenDialog(false);
               setForm(defaultForm);
          },
     });

     const deleteMutation = useMutation({
          mutationFn: (id: number) => deleteProduct(id),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['products-flat'] });
          },
     });

     // Handlers
     const handleOpenAdd = () => {
          setForm(defaultForm);
          setFormMode('add');
          setOpenDialog(true);
     };

     const handleOpenEdit = (id: number) => {
          setSelectedId(id);
          setFormMode('edit');
          setOpenDialog(true);
          setForm(defaultForm);
          setTimeout(() => {
               refetchDetail();
          }, 0);
     };

     const handleCloseDialog = () => {
          setOpenDialog(false);
          setForm(defaultForm);
          setSelectedId(null);
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (formMode === 'add') {
               addMutation.mutate(form);
          } else if (formMode === 'edit' && form.id) {
               editMutation.mutate(form);
          }
     };

     // Attribute view & edit
     const handleViewAttributes = async (id: number) => {
          const res = await getProductById(id);
          setAttrList(res.result.attributes || []);
          setAttrEditList(res.result.attributes ? [...res.result.attributes] : []);
          setAttrEditProductId(id);
          setEditingAttr(false);
          setOpenAttrDialog(true);
     };

     const handleAttrEditChange = (idx: number, key: keyof ProductAttribute, value: string) => {
          setAttrEditList(list =>
               list.map((attr, i) =>
                    i === idx ? { ...attr, [key]: value } : attr
               )
          );
     };

     const handleAttrAdd = () => {
          setAttrEditList(list => [...list, { specKey: '', value: '' }]);
     };

     const handleAttrDelete = (idx: number) => {
          setAttrEditList(list => list.filter((_, i) => i !== idx));
     };

     const handleAttrSave = async () => {
          if (!attrEditProductId) return;
          // Find the current product data to fill required fields
          const currentProduct = pageData?.content.find(p => p.id === attrEditProductId);
          if (!currentProduct) return;
          await updateProduct({
               id: attrEditProductId,
               name: currentProduct.name,
               description: currentProduct.description,
               price: currentProduct.price,
               discountPercent: currentProduct.discountPercent,
               specialPrice: currentProduct.specialPrice,
               stockQuantity: currentProduct.stockQuantity,
               isEnabled: currentProduct.isEnabled,
               isActive: currentProduct.isActive,
               brandId: undefined, // or currentProduct.brandId if available
               // Sửa categoryIds thành mảng thay vì Set để backend nhận đúng kiểu List/Set<Long>
               categoryIds: currentProduct.categorySlugs ? Array.from(currentProduct.categorySlugs as any) : [],
               attributes: attrEditList,
          });
          // reload attributes after save
          const res = await getProductById(attrEditProductId);
          setAttrList(res.result.attributes || []);
          setAttrEditList(res.result.attributes ? [...res.result.attributes] : []);
          setEditingAttr(false);
          queryClient.invalidateQueries({ queryKey: ['products-flat'] });
     };

     const handleDeleteClick = (id: number) => {
          setDeleteProductId(id);
          setOpenDeleteDialog(true);
     };

     const handleConfirmDelete = () => {
          if (deleteProductId) {
               deleteMutation.mutate(deleteProductId);
          }
          setOpenDeleteDialog(false);
          setDeleteProductId(null);
     };

     const handleCancelDelete = () => {
          setOpenDeleteDialog(false);
          setDeleteProductId(null);
     };

     // Xem và chỉnh sửa ảnh sản phẩm
     const handleViewImages = async (id: number) => {
          const res = await getProductById(id);
          // Nếu image là mảng MediaResponse hoặc url, chuẩn hóa về mảng url
          let images: string[] = [];
          if (Array.isArray(res.result.images)) {
               images = res.result.images.map(img =>
                    img
                         ? (img.startsWith('http') ? img : `http://localhost:8080${img}`)
                         : ''
               );
          }
          // else if (typeof res.result.image === 'string') {
          //      images = res.result.image
          //           ? res.result.image.split(',').map(url =>
          //                url.startsWith('http') ? url : `http://localhost:8080${url}`
          //           )
          //           : [];
          // }
          setImageList(images.filter(Boolean));
          setImageProductId(id);
          setOpenImageDialog(true);
     };

     const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!imageProductId || !e.target.files) return;
          setUploading(true);
          try {
               const files = Array.from(e.target.files);
               const res = await uploadProductImages(imageProductId, files);
               // Chuẩn hóa lấy url từ MediaResponse
               const newUrls = (res.result || []).map((img: MediaResponse) =>
                    img.url
                         ? (img.url.startsWith('http') ? img.url : `http://localhost:8080${img.url}`)
                         : ''
               );
               setImageList(list => [...list, ...newUrls.filter(Boolean)]);
          } finally {
               setUploading(false);
          }
     };

     const handleDeleteImage = (url: string) => {
          setImageList(list => list.filter(img => img !== url));
          // TODO: Gọi API xóa ảnh nếu backend hỗ trợ, nếu không chỉ cập nhật lại image cho product
     };

     const handleSaveImages = async () => {
          if (!imageProductId) return;
          // Cập nhật lại image cho product (giả sử image là chuỗi url, phân tách bởi dấu phẩy)
          const currentProduct = pageData?.content.find(p => p.id === imageProductId);
          if (!currentProduct) return;
          await updateProduct({
               id: imageProductId,
               name: currentProduct.name,
               description: currentProduct.description,
               image: imageList.join(','), // image là chuỗi url phân tách bởi dấu phẩy
               price: currentProduct.price,
               discountPercent: currentProduct.discountPercent,
               specialPrice: currentProduct.specialPrice,
               stockQuantity: currentProduct.stockQuantity,
               isEnabled: currentProduct.isEnabled,
               isActive: currentProduct.isActive,
               brandId: undefined,
               categoryIds: currentProduct.categorySlugs ? Array.from(currentProduct.categorySlugs as any) : [],
               attributes: currentProduct.attributes,
          });
          setOpenImageDialog(false);
          setImageProductId(null);
          setImageList([]);
          queryClient.invalidateQueries({ queryKey: ['products-flat'] });
     };

     // View product details
     const handleViewDetails = async (id: number) => {
          const res = await getProductById(id);
          setDetailProduct(res.result);
          setOpenDetailDialog(true);
     };

     // Helper: lấy danh sách category đã chọn (id) từ form.categoryIds
     const selectedCategories = allCategories?.filter(
          (cat: any) => form.categoryIds?.includes(cat.id)
     ) || [];

     // Handler: chọn/bỏ chọn category
     const handleToggleCategory = (catId: number) => {
          setForm(f => {
               const ids = f.categoryIds ? [...f.categoryIds] : [];
               if (ids.includes(catId)) {
                    return { ...f, categoryIds: ids.filter(id => id !== catId) };
               } else {
                    return { ...f, categoryIds: [...ids, catId] };
               }
          });
     };

     // Handler: xóa category đã chọn từ input
     const handleRemoveCategory = (catId: number) => {
          setForm(f => ({
               ...f,
               categoryIds: f.categoryIds?.filter(id => id !== catId) || []
          }));
     };

     // Add handler for Enter key
     const handleSizeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
               const newSize = Math.max(1, parseInt(tempSize) || 10);
               setSize(newSize);
               setPage(0);
          }
     };

     return (
          <Box>
               <Typography variant="h5" fontWeight="bold" mb={2}>
                    Danh sách sản phẩm
               </Typography>
               <Paper sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                         <Typography variant="h6">Danh sách sản phẩm</Typography>
                         <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                              Thêm sản phẩm
                         </Button>
                    </Box>
                    {isLoading && <CircularProgress />}
                    {error && (
                         <Typography color="error">Lỗi tải sản phẩm</Typography>
                    )}
                    {!isLoading && !error && (
                         <>
                              <Box sx={{ overflowX: 'auto' }}>
                                   <Table sx={{ minWidth: 900 }}>
                                        <TableHead>
                                             <TableRow>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>ID</TableCell>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Tên</TableCell>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Giá</TableCell>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Trạng thái</TableCell>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Ảnh</TableCell>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Thuộc tính</TableCell>
                                                  <TableCell>Hành động</TableCell>
                                             </TableRow>
                                        </TableHead>
                                        <TableBody>
                                             {pageData?.content.map((prod: ProductResponse) => (
                                                  <TableRow key={prod.id}>
                                                       <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{prod.id}</TableCell>
                                                       <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{prod.name}</TableCell>
                                                       <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{prod.price}</TableCell>
                                                       <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{prod.isEnabled ? 'Bật' : 'Tắt'}</TableCell>
                                                       <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                                                            <Tooltip title="Xem/Chỉnh sửa ảnh">
                                                                 <IconButton color="primary" onClick={() => handleViewImages(prod.id)}>
                                                                      <PhotoLibraryIcon />
                                                                 </IconButton>
                                                            </Tooltip>
                                                       </TableCell>
                                                       <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                                                            <Tooltip title="Xem thuộc tính">
                                                                 <IconButton color="primary" onClick={() => handleViewAttributes(prod.id)}>
                                                                      <VisibilityIcon />
                                                                 </IconButton>
                                                            </Tooltip>
                                                       </TableCell>
                                                       <TableCell>
                                                            <Tooltip title="Xem chi tiết">
                                                                 <IconButton color="primary" onClick={() => handleViewDetails(prod.id)}>
                                                                      <InfoIcon />
                                                                 </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Sửa">
                                                                 <IconButton color="info" onClick={() => handleOpenEdit(prod.id)}>
                                                                      <EditIcon />
                                                                 </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Xóa">
                                                                 <IconButton color="error" onClick={() => handleDeleteClick(prod.id)}>
                                                                      <DeleteIcon />
                                                                 </IconButton>
                                                            </Tooltip>
                                                       </TableCell>
                                                  </TableRow>
                                             ))}
                                        </TableBody>
                                   </Table>
                              </Box>
                              {/* Pagination controls */}
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, flexWrap: 'wrap', gap: 2 }}>
                                   <Box>
                                        <Button
                                             variant="outlined"
                                             size="small"
                                             disabled={page === 0}
                                             onClick={() => setPage(0)}
                                             sx={{ mr: 1 }}
                                        >
                                             Trang đầu
                                        </Button>
                                        <Button
                                             variant="outlined"
                                             size="small"
                                             disabled={page === 0}
                                             onClick={() => setPage(p => Math.max(0, p - 1))}
                                             sx={{ mr: 1 }}
                                        >
                                             &lt;
                                        </Button>
                                        <Typography component="span" sx={{ mx: 1 }}>
                                             Trang {(pageData?.page?.number ?? 0) + 1} / {pageData?.page?.totalPages ?? 1}
                                        </Typography>
                                        <Button
                                             variant="outlined"
                                             size="small"
                                             disabled={pageData ? page >= pageData.page.totalPages - 1 : true}
                                             onClick={() => setPage(p => pageData ? Math.min(pageData.page.totalPages - 1, p + 1) : p)}
                                             sx={{ ml: 1 }}
                                        >
                                             &gt;
                                        </Button>
                                        <Button
                                             variant="outlined"
                                             size="small"
                                             disabled={pageData ? page >= pageData.page.totalPages - 1 : true}
                                             onClick={() => setPage(pageData ? pageData.page.totalPages - 1 : 0)}
                                             sx={{ ml: 1 }}
                                        >
                                             Trang cuối
                                        </Button>
                                   </Box>
                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography component="span">Số sản phẩm/trang:</Typography>
                                        <TextField
                                             size="small"
                                             type="number"
                                             value={tempSize}
                                             onChange={e => setTempSize(e.target.value)}
                                             onKeyPress={handleSizeKeyPress}
                                             onBlur={() => setTempSize(size.toString())}
                                             inputProps={{ 
                                                  min: 1,
                                                  style: { width: 60 },
                                                  'aria-label': 'page size'
                                             }}
                                        />
                                        <Typography component="span">
                                             Tổng: {pageData?.page.totalElements ?? 0}
                                        </Typography>
                                   </Box>
                              </Box>
                         </>
                    )}
               </Paper>

               {/* Dialog for Add/Edit */}
               <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                         {formMode === 'add' ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}
                    </DialogTitle>
                    <DialogContent>
                         {(formMode === 'add' || formMode === 'edit') && (
                              formMode === 'edit' && (!detailData || selectedId !== detailData.id) ? (
                                   <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                                        <CircularProgress />
                                   </Box>
                              ) : (
                                   <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                        {/* Dropdown ngành hàng dạng tree */}
                                        <Box sx={{ mb: 2 }}>
                                             <Typography fontWeight="bold" mb={1}>Ngành hàng</Typography>
                                             <TextField
                                                  select
                                                  label="Chọn ngành hàng"
                                                  value=""
                                                  fullWidth
                                                  SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 400 } } } }}
                                             >
                                                  {allCategories && allCategories.map((cat: any) => (
                                                       <MenuItem
                                                            key={cat.id}
                                                            value={cat.id}
                                                            sx={{ pl: 2 + (cat.parentId ? 2 : 0) }}
                                                            onClick={() => handleSelectCategoryWithParents(cat)}
                                                            disabled={form.categoryIds?.includes(cat.id)}
                                                       >
                                                            {cat.name}
                                                       </MenuItem>
                                                  ))}
                                             </TextField>
                                             {/* Hiển thị các ngành đã chọn */}
                                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                  {allCategories && allCategories
                                                       .filter(cat => form.categoryIds?.includes(cat.id))
                                                       .map(cat => (
                                                            <Box
                                                                 key={cat.id}
                                                                 sx={{
                                                                      display: 'flex',
                                                                      alignItems: 'center',
                                                                      background: '#f0f0f0',
                                                                      borderRadius: 2,
                                                                      px: 1,
                                                                      py: 0.5,
                                                                      mr: 1,
                                                                 }}
                                                            >
                                                                 <Typography variant="body2" sx={{ mr: 0.5 }}>{cat.name}</Typography>
                                                                 <IconButton
                                                                      size="small"
                                                                      onClick={() => handleRemoveCategoryWithParents(cat)}
                                                                      sx={{ p: 0.2 }}
                                                                 >
                                                                      <DeleteIcon fontSize="small" />
                                                                 </IconButton>
                                                            </Box>
                                                       ))
                                                  }
                                             </Box>
                                        </Box>
                                        {/* Các trường còn lại của sản phẩm */}
                                        <TextField
                                             label="Tên sản phẩm"
                                             value={form.name}
                                             onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                             fullWidth
                                             required
                                             margin="normal"
                                        />
                                        <TextField
                                             label="Mô tả"
                                             value={form.description || ''}
                                             onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                             fullWidth
                                             margin="normal"
                                        />
                                        <TextField
                                             label="Giá"
                                             value={form.price}
                                             onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))
                                             }
                                             fullWidth
                                             required
                                             margin="normal"
                                             type="number"
                                        />
                                        <TextField
                                             label="Phần trăm giảm giá"
                                             value={form.discountPercent || 0}
                                             onChange={e => setForm(f => ({ ...f, discountPercent: Number(e.target.value) }))
                                             }
                                             fullWidth
                                             margin="normal"
                                             type="number"
                                        />
                                        <TextField
                                             label="Giá đặc biệt"
                                             value={form.specialPrice || ''}
                                             onChange={e => setForm(f => ({ ...f, specialPrice: e.target.value ? Number(e.target.value) : undefined }))
                                             }
                                             fullWidth
                                             margin="normal"
                                             type="number"
                                        />
                                        <TextField
                                             label="Số lượng kho"
                                             value={form.stockQuantity || 0}
                                             onChange={e => setForm(f => ({ ...f, stockQuantity: Number(e.target.value) }))
                                             }
                                             fullWidth
                                             margin="normal"
                                             type="number"
                                        />
                                        <TextField
                                             label="Trạng thái"
                                             select
                                             value={form.isEnabled ? 'enabled' : 'disabled'}
                                             onChange={e => setForm(f => ({ ...f, isEnabled: e.target.value === 'enabled' }))
                                             }
                                             fullWidth
                                             margin="normal"
                                        >
                                             <MenuItem value="enabled">Bật</MenuItem>
                                             <MenuItem value="disabled">Tắt</MenuItem>
                                        </TextField>
                                        <TextField
                                             label="Kích hoạt"
                                             select
                                             value={form.isActive ? 'active' : 'inactive'}
                                             onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'active' }))
                                             }
                                             fullWidth
                                             margin="normal"
                                        >
                                             <MenuItem value="active">Có</MenuItem>
                                             <MenuItem value="inactive">Không</MenuItem>
                                        </TextField>
                                        {/* Có thể bổ sung trường brandId, image, attributes... nếu cần */}
                                   </Box>
                              )
                         )}
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={handleCloseDialog}>Đóng</Button>
                         {(formMode === 'add' || formMode === 'edit') && (
                              <Button
                                   onClick={handleSubmit}
                                   variant="contained"
                                   disabled={addMutation.isPending || editMutation.isPending}
                                   type="submit"
                              >
                                   {formMode === 'add' ? 'Thêm' : 'Lưu'}
                              </Button>
                         )}
                    </DialogActions>
               </Dialog>

               {/* Dialog thuộc tính sản phẩm */}
               <Dialog open={openAttrDialog} onClose={() => setOpenAttrDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                         Thuộc tính sản phẩm
                         {!editingAttr && (
                              <IconButton
                                   size="small"
                                   sx={{ ml: 1 }}
                                   onClick={() => setEditingAttr(true)}
                              >
                                   <EditAttributesIcon fontSize="small" />
                              </IconButton>
                         )}
                    </DialogTitle>
                    <DialogContent>
                         {!editingAttr ? (
                              attrList.length === 0 ? (
                                   <Typography>Không có thuộc tính</Typography>
                              ) : (
                                   <Box sx={{ overflowX: 'auto' }}>
                                        <Table sx={{ minWidth: 500 }}>
                                             <TableHead>
                                                  <TableRow>
                                                       <TableCell>STT</TableCell>
                                                       <TableCell>Thuộc tính</TableCell>
                                                       <TableCell>Giá trị</TableCell>
                                                  </TableRow>
                                             </TableHead>
                                             <TableBody>
                                                  {attrList.map((attr, idx) => (
                                                       <TableRow key={idx}>
                                                            <TableCell>{idx + 1}</TableCell>
                                                            <TableCell>{attr.specKey}</TableCell>
                                                            <TableCell>{attr.value}</TableCell>
                                                       </TableRow>
                                                  ))}
                                             </TableBody>
                                        </Table>
                                   </Box>
                              )
                         ) : (
                              <Box>
                                   <Button onClick={handleAttrAdd} variant="outlined" sx={{ mb: 1 }}>
                                        Thêm thuộc tính
                                   </Button>
                                   <Box sx={{ overflowX: 'auto' }}>
                                        <Table sx={{ minWidth: 500 }}>
                                             <TableHead>
                                                  <TableRow>
                                                       <TableCell>STT</TableCell>
                                                       <TableCell>Thuộc tính</TableCell>
                                                       <TableCell>Giá trị</TableCell>
                                                       <TableCell>Xóa</TableCell>
                                                  </TableRow>
                                             </TableHead>
                                             <TableBody>
                                                  {attrEditList.map((attr, idx) => (
                                                       <TableRow key={idx}>
                                                            <TableCell>{idx + 1}</TableCell>
                                                            <TableCell>
                                                                 <TextField
                                                                      value={attr.specKey}
                                                                      onChange={e => handleAttrEditChange(idx, 'specKey', e.target.value)}
                                                                      size="small"
                                                                 />
                                                            </TableCell>
                                                            <TableCell>
                                                                 <TextField
                                                                      value={attr.value}
                                                                      onChange={e => handleAttrEditChange(idx, 'value', e.target.value)}
                                                                      size="small"
                                                                 />
                                                            </TableCell>
                                                            <TableCell>
                                                                 <IconButton color="error" onClick={() => handleAttrDelete(idx)}>
                                                                      <DeleteIcon />
                                                                 </IconButton>
                                                            </TableCell>
                                                       </TableRow>
                                                  ))}
                                             </TableBody>
                                        </Table>
                                   </Box>
                              </Box>
                         )}
                    </DialogContent>
                    <DialogActions>
                         {editingAttr ? (
                              <>
                                   <Button onClick={() => {
                                        setEditingAttr(false);
                                        setAttrEditList([...attrList]);
                                   }}>
                                        Hủy
                                   </Button>
                                   <Button
                                        onClick={handleAttrSave}
                                        variant="contained"
                                        disabled={!attrEditProductId}
                                   >
                                        Lưu
                                   </Button>
                              </>
                         ) : (
                              <Button onClick={() => setOpenAttrDialog(false)}>Đóng</Button>
                         )}
                    </DialogActions>
               </Dialog>

               {/* Dialog xem/chỉnh sửa ảnh sản phẩm */}
               <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Ảnh sản phẩm</DialogTitle>
                    <DialogContent>
                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                              {imageList.length === 0 && <Typography>Không có ảnh</Typography>}
                              {imageList.map((url, idx) => (
                                   <Box key={idx} sx={{ position: 'relative', width: 100, height: 100 }}>
                                        <Image
                                             src={url}
                                             alt={``}
                                             fill
                                             className="object-contain"
                                             sizes="(max-width: 768px) 450px 450px"
                                        />
                                        <IconButton
                                             size="small"
                                             color="error"
                                             sx={{ position: 'absolute', top: 2, right: 2, background: 'rgba(255,255,255,0.7)' }}
                                             onClick={() => handleDeleteImage(url)}
                                        >
                                             <DeleteIcon fontSize="small" />
                                        </IconButton>
                                   </Box>
                              ))}
                         </Box>
                         <Button variant="outlined" component="label" disabled={uploading}>
                              Thêm ảnh
                              <input type="file" hidden multiple accept="image/*" onChange={handleAddImages} />
                         </Button>
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={() => setOpenImageDialog(false)}>Đóng</Button>
                         <Button onClick={handleSaveImages} variant="contained" disabled={uploading}>Lưu</Button>
                    </DialogActions>
               </Dialog>

               {/* Dialog xem chi tiết sản phẩm */}
               <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Chi tiết sản phẩm</DialogTitle>
                    <DialogContent>
                         {detailProduct ? (
                              <Box sx={{ p: 2 }}>
                                   <Typography><b>ID:</b> {detailProduct.id}</Typography>
                                   <Typography><b>Tên:</b> {detailProduct.name}</Typography>
                                   <Typography><b>Slug:</b> {detailProduct.slug}</Typography>
                                   <Typography><b>Mô tả:</b> {detailProduct.description}</Typography>
                                   <Typography><b>Ảnh:</b> {detailProduct.images[0]}</Typography>
                                   <Typography><b>Giá:</b> {detailProduct.price}</Typography>
                                   <Typography><b>Phần trăm giảm giá:</b> {detailProduct.discountPercent}</Typography>
                                   <Typography><b>Giá đặc biệt:</b> {detailProduct.specialPrice}</Typography>
                                   <Typography><b>Số lượng kho:</b> {detailProduct.stockQuantity}</Typography>
                                   <Typography><b>Số lượng đã bán:</b> {detailProduct.quantitySold}</Typography>
                                   <Typography><b>Lượt xem:</b> {detailProduct.views}</Typography>
                                   <Typography><b>Trạng thái:</b> {detailProduct.isEnabled ? 'Bật' : 'Tắt'}</Typography>
                                   <Typography><b>Kích hoạt:</b> {detailProduct.isActive ? 'Có' : 'Không'}</Typography>
                                   <Typography><b>Ngày tạo:</b> {detailProduct.createdAt}</Typography>
                                   <Typography><b>Ngày cập nhật:</b> {detailProduct.updatedAt}</Typography>
                                   <Typography><b>Brand:</b> {detailProduct.brandSlug}</Typography>
                                   <Typography><b>Category Slugs:</b> {Array.isArray(detailProduct.categorySlugs) ? detailProduct.categorySlugs.join(', ') : ''}</Typography>
                                   <Typography><b>Thuộc tính:</b></Typography>
                                   <Box sx={{ ml: 2 }}>
                                        {detailProduct.attributes && detailProduct.attributes.length > 0 ? (
                                             <ul>
                                                  {detailProduct.attributes.map((attr, idx) => (
                                                       <li key={idx}>
                                                            <b>{attr.specKey}:</b> {attr.value}
                                                       </li>
                                                  ))}
                                             </ul>
                                        ) : (
                                             <Typography variant="body2">Không có thuộc tính</Typography>
                                        )}
                                   </Box>
                              </Box>
                         ) : (
                              <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                                   <CircularProgress />
                              </Box>
                         )}
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
                    </DialogActions>
               </Dialog>

               {/* Modal xác nhận xóa sản phẩm */}
               <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
                    <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                    <DialogContent>
                         <Typography>Bạn có chắc chắn muốn xóa sản phẩm này?</Typography>
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={handleCancelDelete}>Hủy</Button>
                         <Button onClick={handleConfirmDelete} color="error" variant="contained">Xóa</Button>
                    </DialogActions>
               </Dialog>
          </Box>
     );
}
