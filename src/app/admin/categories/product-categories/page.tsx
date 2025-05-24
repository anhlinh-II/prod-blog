'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
     getAllCategories,
     getCategoryById,
     createCategory,
     updateCategory,
     deleteCategory,
} from '@/services/CategoryService';
import { CategoryRequest, CategoryResponse, CategoryType } from '@/types';
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
     MenuItem,
     Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useState } from 'react';

type FormMode = 'add' | 'edit' | 'view';

const defaultForm: CategoryRequest = {
     name: '',
     description: '',
     type: CategoryType.PRODUCT,
     parentId: undefined,
};

export default function AdminProductCategoriesPage() {
     const queryClient = useQueryClient();

     // State for modal
     const [openDialog, setOpenDialog] = useState(false);
     const [formMode, setFormMode] = useState<FormMode>('add');
     const [form, setForm] = useState<CategoryRequest>(defaultForm);
     const [selectedId, setSelectedId] = useState<number | null>(null);
     const [viewDetail, setViewDetail] = useState<CategoryResponse | null>(null);

     // Fetch all categories
     const { data, isLoading, error } = useQuery({
          queryKey: ['categories-flat'],
          queryFn: async () => (await getAllCategories()).result,
     });

     // Fetch category by id for view/edit
     const { refetch: refetchDetail, data: detailData } = useQuery({
          queryKey: ['category-detail', selectedId],
          queryFn: async () => selectedId ? (await getCategoryById(selectedId)).result : null,
          enabled: false,
     });

     // Handle side effects when detailData changes
     React.useEffect(() => {
          if (!detailData) return;
          // Bỏ điều kiện formMode === 'view'
          if (formMode === 'edit') setForm({
               name: detailData.name,
               description: detailData.description,
               type: CategoryType.PRODUCT,
               parentId: detailData.parentId,
          });
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [detailData, formMode]);

     // Mutations
     const addMutation = useMutation({
          mutationFn: (payload: CategoryRequest) => createCategory(payload),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['categories-flat'] });
               setOpenDialog(false);
               setForm(defaultForm);
          },
     });

     const editMutation = useMutation({
          mutationFn: ({ id, payload }: { id: number; payload: CategoryRequest }) => updateCategory(id, payload),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['categories-flat'] });
               setOpenDialog(false);
               setForm(defaultForm);
          },
     });

     const deleteMutation = useMutation({
          mutationFn: (id: number) => deleteCategory(id),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['categories-flat'] });
          },
     });

     // Handlers
     const handleOpenAdd = () => {
          setForm(defaultForm);
          setFormMode('add');
          setOpenDialog(true);
     };

     // Always call refetchDetail when opening edit modal
     const handleOpenEdit = (id: number) => {
          setSelectedId(id);
          setFormMode('edit');
          setOpenDialog(true);
          setForm(defaultForm); // reset form trước khi fetch
          setTimeout(() => {
               refetchDetail();
          }, 0);
     };

     const handleCloseDialog = () => {
          setOpenDialog(false);
          setForm(defaultForm);
          setViewDetail(null);
          setSelectedId(null);
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (formMode === 'add') {
               addMutation.mutate(form);
          } else if (formMode === 'edit' && selectedId) {
               editMutation.mutate({ id: selectedId, payload: form });
          }
     };

     return (
          <Box>
               <Typography variant="h5" fontWeight="bold" mb={2}>
                    Danh mục sản phẩm
               </Typography>
               <Paper sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                         <Typography variant="h6">Danh sách danh mục</Typography>
                         <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                              Thêm danh mục
                         </Button>
                    </Box>
                    {isLoading && <CircularProgress />}
                    {error && (
                         <Typography color="error">Lỗi tải danh mục sản phẩm</Typography>
                    )}
                    {!isLoading && !error && (
                         <Box sx={{ overflowX: 'auto' }}>
                              <Table sx={{ minWidth: 700, borderCollapse: 'separate', borderSpacing: 0 }}>
                                   <TableHead>
                                        <TableRow>
                                             <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>ID</TableCell>
                                             <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Tên</TableCell>
                                             <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Mô tả</TableCell>
                                             <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Danh mục cha</TableCell>
                                             <TableCell>Hành động</TableCell>
                                        </TableRow>
                                   </TableHead>
                                   <TableBody>
                                        {data?.map((cat: CategoryResponse) => (
                                             <TableRow key={cat.id}>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{cat.id}</TableCell>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{cat.name}</TableCell>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{cat.description}</TableCell>
                                                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{(cat.parentId != null && cat.parentCategoryName != null) ? `${cat.parentId} - ${cat.parentCategoryName}` : '-'}</TableCell>
                                                  <TableCell>
                                                       {/* Bỏ action View */}
                                                       {/* <Tooltip title="Xem chi tiết">
                                                            <IconButton color="primary" onClick={() => handleOpenView(cat.id)}>
                                                                 <VisibilityIcon />
                                                            </IconButton>
                                                       </Tooltip> */}
                                                       <Tooltip title="Sửa">
                                                            <IconButton color="info" onClick={() => handleOpenEdit(cat.id)}>
                                                                 <EditIcon />
                                                            </IconButton>
                                                       </Tooltip>
                                                       <Tooltip title="Xóa">
                                                            <IconButton color="error" onClick={() => deleteMutation.mutate(cat.id)}>
                                                                 <DeleteIcon />
                                                            </IconButton>
                                                       </Tooltip>
                                                  </TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         </Box>
                    )}
               </Paper>

               {/* Dialog for Add/Edit (bỏ View) */}
               <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                         {formMode === 'add' && 'Thêm danh mục'}
                         {formMode === 'edit' && 'Sửa danh mục'}
                         {/* {formMode === 'view' && 'Chi tiết danh mục'} */}
                    </DialogTitle>
                    <DialogContent>
                         {(formMode === 'add' || formMode === 'edit') && (
                              formMode === 'edit' && (!detailData || selectedId !== detailData.id) ? (
                                   <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                                        <CircularProgress />
                                   </Box>
                              ) : (
                                   <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                        <TextField
                                             label="Tên danh mục"
                                             value={form.name}
                                             onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                             fullWidth
                                             required
                                             margin="normal"
                                        />
                                        <TextField
                                             label="Mô tả"
                                             value={form.description}
                                             onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                             fullWidth
                                             margin="normal"
                                        />
                                        <TextField
                                             label="Loại"
                                             value={form.type}
                                             select
                                             fullWidth
                                             margin="normal"
                                             disabled
                                        >
                                             <MenuItem value={CategoryType.PRODUCT}>PRODUCT</MenuItem>
                                        </TextField>
                                        <TextField
                                        label="ID danh mục cha"
                                        value={form.parentId ?? ''}
                                        onChange={e => setForm(f => ({ ...f, parentId: e.target.value ? Number(e.target.value) : undefined }))}
                                        fullWidth
                                        margin="normal"
                                        select
                                        SelectProps={{
                                             MenuProps: { PaperProps: { style: { maxHeight: 300 } } }
                                        }}
                                   >
                                        <MenuItem value="">
                                             Không có
                                        </MenuItem>
                                        {data
                                             ?.filter((cat: CategoryResponse) =>
                                                  // Loại bỏ chính nó khỏi danh sách danh mục cha khi đang sửa
                                                  formMode !== 'edit' || cat.id !== selectedId
                                             )
                                             .map((cat: CategoryResponse) => (
                                                  <MenuItem key={cat.id} value={cat.id}>
                                                       {cat.id} - {cat.name}
                                                  </MenuItem>
                                             ))}
                                   </TextField>
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
          </Box>
     );
}