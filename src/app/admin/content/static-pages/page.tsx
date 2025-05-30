'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllStaticPages, createStaticPage, updateStaticPage, deleteStaticPage } from '@/services/StaticPageService';
import { StaticPageRequest, StaticPageResponse, StaticPageType } from '@/types/News';
import {
     Box,
     Typography,
     Paper,
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
     CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { uploadPageContentImages, deleteImage } from '@/services/MediaService';
import 'react-quill/dist/quill.snow.css';
import { Global } from '@emotion/react';
import { v4 as uuidv4 } from 'uuid';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const defaultForm: StaticPageRequest = {
     title: '',
     content: '',
     type: StaticPageType.ABOUT,
     userId: 1, // Set this to actual logged in user ID
     isActive: true,
};

// Định nghĩa custom modules và formats cho Quill
const quillFormats = [
     'header',
     'bold', 'italic', 'underline', 'strike',
     'list', 'bullet', 'indent',
     'align',
     'link', 'image',
];

export default function StaticPagesPage() {
     const queryClient = useQueryClient();
     const [page, setPage] = useState(0);
     const [tempSize, setTempSize] = useState<string>('10');
     const [size, setSize] = useState(10);
     const [openDialog, setOpenDialog] = useState(false);
     const [editingId, setEditingId] = useState<number | null>(null);
     const [form, setForm] = useState<StaticPageRequest>(defaultForm);
     const [deleteId, setDeleteId] = useState<number | null>(null);
     const [previewOpen, setPreviewOpen] = useState(false);
     const [pendingImages, setPendingImages] = useState<{ tempId: string, file: File }[]>([]);
     const [editingPageImages, setEditingPageImages] = useState<string[]>([]); // lưu url ảnh cũ khi edit
     const imagesUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

     // Fetch static pages
     const { data: pageData, isLoading } = useQuery({
          queryKey: ['static-pages', page, size],
          queryFn: async () => {
               const res = await getAllStaticPages(page, size);
               return res.result;
          },
     });

     // Mutations
     const createMutation = useMutation<StaticPageResponse, unknown, StaticPageRequest>({
          mutationFn: async (request: StaticPageRequest) => {
               const res = await createStaticPage(request);
               return res.result;
          },
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['static-pages'] });
               handleCloseDialog();
          },
     });

     const updateMutation = useMutation({
          mutationFn: ({ id, data }: { id: number; data: StaticPageRequest }) =>
               updateStaticPage(id, data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['static-pages'] });
               handleCloseDialog();
          },
     });

     const deleteMutation = useMutation({
          mutationFn: deleteStaticPage,
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['static-pages'] });
               setDeleteId(null);
          },
     });

     // Handlers
     const handleSizeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
               const newSize = Math.max(1, parseInt(tempSize) || 10);
               setSize(newSize);
               setPage(0);
          }
     };

     const handleOpenCreate = () => {
          setForm(defaultForm);
          setEditingId(null);
          setOpenDialog(true);
     };

     const handleOpenEdit = (page: StaticPageResponse) => {
          setForm({
               title: page.title,
               content: page.content,
               type: page.type,
               userId: 1, // Set to actual user ID
               isActive: page.isActive,
          });
          setEditingId(page.id);
          setOpenDialog(true);
          // Lưu lại danh sách url ảnh cũ
          setEditingPageImages(page.images?.map(img => img.url ? img.url : '') ?? []);
     };

     const handleCloseDialog = () => {
          setOpenDialog(false);
          setForm(defaultForm);
          setEditingId(null);
     };

     // Custom image handler for Quill
     const imageHandler = React.useCallback(function imageHandler(this: any) {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = () => {
               if (!input.files?.length) return;
               const file = input.files[0];
               const tempId = uuidv4();
               setPendingImages(prev => [...prev, { tempId, file }]);
               // Get editor instance
               const quillObj = this.quill || (document.querySelector('.quill') as any)?.getEditor?.();
               if (!quillObj) return;
               const range = quillObj.getSelection(true);

               // Preview image using FileReader
               const reader = new FileReader();
               reader.onload = (e) => {
                    const previewUrl = e.target?.result as string;
                    // Insert preview image with tempId in data-tempid attribute
                    quillObj.insertEmbed(range.index, 'image', previewUrl, 'user');
                    // Mark the image for later replacement (add data-tempid attribute)
                    setTimeout(() => {
                         // Find the image just inserted and set data-tempid
                         const editor = document.querySelector('.ql-editor');
                         if (editor) {
                              const imgs = editor.querySelectorAll('img');
                              imgs.forEach(img => {
                                   if (img.getAttribute('src') === previewUrl) {
                                        img.setAttribute('data-tempid', tempId);
                                   }
                              });
                         }
                    }, 10);
                    quillObj.setSelection(range.index + 1);
               };
               reader.readAsDataURL(file);
          };
     }, []);

     // Then define quillModules using the imageHandler
     const quillModules = React.useMemo(() => ({
          toolbar: {
               container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
               ],
               handlers: {
                    image: imageHandler
               }
          }
     }), [imageHandler]); // Add imageHandler to dependencies

     // Create memoized content change handler
     const handleEditorChange = React.useCallback((value: string) => {
          setForm(prev => ({ ...prev, content: value }));
     }, []);

     // Helper to replace all preview images (data-tempid) with real urls
     const replaceImagePlaceholders = (content: string, replacements: { tempId: string, url: string }[]) => {
          let newContent = content;
          for (const { tempId, url } of replacements) {
               // Replace <img ... data-tempid="tempId" ... src="data:..."> with src="url"
               // Use regex to match img tag with data-tempid
               newContent = newContent.replace(
                    new RegExp(`<img([^>]+)data-tempid="${tempId}"([^>]*)src="[^"]+"([^>]*)>`, 'g'),
                    `<img$1data-tempid="${tempId}"$2src="${url}"$3>`
               );
          }
          return newContent;
     };

     // Helper: lấy tất cả url ảnh trong content
     const extractImageUrls = (html: string): string[] => {
          const urls: string[] = [];
          const imgRegex = /<img[^>]+src="([^">]+)"/g;
          let match;
          while ((match = imgRegex.exec(html)) !== null) {
               urls.push(match[1]);
          }
          return urls;
     };

     // Submit handler
     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          const requestData = { ...form };

          if (editingId) {
               // Edit mode: upload new images if any, then update
               let updatedContent = form.content;
               if (pendingImages.length > 0) {
                    const res = await uploadPageContentImages(editingId, pendingImages.map(i => i.file));
                    const replacements = pendingImages.map((img, idx) => ({
                         tempId: img.tempId,
                         url: `${imagesUrl}${res.result[idx].url}`
                    }));
                    updatedContent = replaceImagePlaceholders(form.content, replacements);
               }
               // Lấy danh sách url ảnh cũ và mới
               const oldUrls = editingPageImages;
               const newUrls = extractImageUrls(updatedContent);
               // Tìm các url ảnh cũ không còn trong content mới
               const unusedUrls = oldUrls.filter(url => !newUrls.includes(url));
               // Gọi API xóa các ảnh không còn dùng
               for (const url of unusedUrls) {
                    // Tìm mediaId từ url (nếu backend trả về mediaId trong images thì nên lưu lại id thay vì url)
                    // Ở đây giả sử url có dạng /api/medias/images/page/{pageId}/{mediaId}_{filename}
                    const match = url.match(/\/(\d+)_/);
                    if (match) {
                         const mediaId = Number(match[1]);
                         if (!isNaN(mediaId)) {
                              try {
                                   await deleteImage(mediaId);
                              } catch (e) {
                                   // ignore error
                              }
                         }
                    }
               }
               updateMutation.mutate({ id: editingId, data: { ...requestData, content: updatedContent } });
               setPendingImages([]);
          } else {
               // Create mode: create page first, then upload images, then update content
               const createRes = await createStaticPage(requestData);
               const newId = createRes.result.id;
               let updatedContent = form.content;
               if (pendingImages.length > 0) {
                    const res = await uploadPageContentImages(newId, pendingImages.map(i => i.file));
                    const replacements = pendingImages.map((img, idx) => ({
                         tempId: img.tempId,
                         url: `${imagesUrl}${res.result[idx].url}`
                    }));
                    updatedContent = replaceImagePlaceholders(form.content, replacements);
                    // Update page with new content
                    await updateStaticPage(newId, { ...requestData, content: updatedContent });
               }
               queryClient.invalidateQueries({ queryKey: ['static-pages'] });
               handleCloseDialog();
               setPendingImages([]);
          }
     };

     // Preview component
     const PagePreview = () => (
          <Dialog
               open={previewOpen}
               onClose={() => setPreviewOpen(false)}
               maxWidth="lg"
               fullWidth
               sx={{
                    '& .MuiDialog-paper': {
                         minHeight: '80vh',
                         maxHeight: '90vh',
                         overflow: 'auto'
                    },
                    zIndex: 1500
               }}
          >
               <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                         <Typography variant="h6">Xem trước: {form.title}</Typography>
                         <Button onClick={() => setPreviewOpen(false)}>Đóng</Button>
                    </Box>
               </DialogTitle>
               <DialogContent>
                    <Box sx={{ p: 3 }}>
                         <Typography variant="h4" gutterBottom>{form.title}</Typography>
                         <div
                              className="ql-editor static-page-content"
                              style={{ fontSize: 16, lineHeight: 1.7 }}
                              dangerouslySetInnerHTML={{ __html: form.content }}
                         />
                    </Box>
               </DialogContent>
          </Dialog>
     );

     return (
          <Box>
               <Global styles={{
                    '.ql-editor': {
                         fontSize: '16px',
                         lineHeight: 1.7,
                    }
               }} />
               <Typography variant="h5" fontWeight="bold" mb={2}>
                    Quản lý trang tĩnh
               </Typography>

               <Paper sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                         <Typography variant="h6">Danh sách trang</Typography>
                         <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={handleOpenCreate}
                         >
                              Thêm trang
                         </Button>
                    </Box>

                    <Table>
                         <TableHead>
                              <TableRow>
                                   <TableCell>Tiêu đề</TableCell>
                                   <TableCell>Loại</TableCell>
                                   <TableCell>Trạng thái</TableCell>
                                   <TableCell>Ngày tạo</TableCell>
                                   <TableCell>Hành động</TableCell>
                              </TableRow>
                         </TableHead>
                         <TableBody>
                              {pageData?.content.map((staticPage) => (
                                   <TableRow key={staticPage.id}>
                                        <TableCell>{staticPage.title}</TableCell>
                                        <TableCell>{staticPage.type}</TableCell>
                                        <TableCell>{staticPage.isActive ? 'Hoạt động' : 'Không hoạt động'}</TableCell>
                                        <TableCell>{new Date(staticPage.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                             <IconButton onClick={() => handleOpenEdit(staticPage)}>
                                                  <EditIcon />
                                             </IconButton>
                                             <IconButton color="error" onClick={() => setDeleteId(staticPage.id)}>
                                                  <DeleteIcon />
                                             </IconButton>
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>

                    {/* Pagination controls */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                         <Box>
                              <Button
                                   variant="outlined"
                                   size="small"
                                   disabled={page === 0}
                                   onClick={() => setPage(0)}
                              >
                                   Trang đầu
                              </Button>
                              <Button
                                   variant="outlined"
                                   size="small"
                                   disabled={page === 0}
                                   onClick={() => setPage(p => Math.max(0, p - 1))}
                              >
                                   Trước
                              </Button>
                              <Typography component="span" sx={{ mx: 2 }}>
                                   Trang {page + 1} / {pageData?.page.totalPages || 1}
                              </Typography>
                              <Button
                                   variant="outlined"
                                   size="small"
                                   disabled={page >= (pageData?.page.totalPages || 1) - 1}
                                   onClick={() => setPage(p => p + 1)}
                              >
                                   Sau
                              </Button>
                              <Button
                                   variant="outlined"
                                   size="small"
                                   disabled={page >= (pageData?.page.totalPages || 1) - 1}
                                   onClick={() => setPage((pageData?.page.totalPages || 1) - 1)}
                              >
                                   Trang cuối
                              </Button>
                         </Box>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>Số trang/lần hiển thị:</Typography>
                              <TextField
                                   size="small"
                                   type="number"
                                   value={tempSize}
                                   onChange={e => setTempSize(e.target.value)}
                                   onKeyPress={handleSizeKeyPress}
                                   onBlur={() => setTempSize(size.toString())}
                                   inputProps={{ min: 1, style: { width: 60 } }}
                              />
                         </Box>
                    </Box>

                    {/* Add/Edit Dialog */}
                    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                         <DialogTitle>
                              {editingId ? 'Chỉnh sửa trang' : 'Thêm trang mới'}
                         </DialogTitle>
                         <DialogContent>
                              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                   <TextField
                                        label="Tiêu đề"
                                        value={form.title}
                                        onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                        fullWidth
                                        required
                                        margin="normal"
                                   />

                                   <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" mb={1}>Nội dung</Typography>
                                        <ReactQuill
                                             theme="snow"
                                             value={form.content}
                                             onChange={handleEditorChange}
                                             modules={quillModules}
                                             formats={quillFormats}
                                             className="quill"
                                             style={{ height: '400px', marginBottom: '50px', fontSize: 16, lineHeight: 1.7 }}
                                        />
                                   </Box>

                                   <TextField
                                        select
                                        label="Loại trang"
                                        value={form.type}
                                        onChange={e => setForm(prev => ({ 
                                             ...prev, 
                                             type: e.target.value as StaticPageType 
                                        }))}
                                        fullWidth
                                        margin="normal"
                                   >
                                        <MenuItem value={StaticPageType.ABOUT}>Về chúng tôi</MenuItem>
                                        <MenuItem value={StaticPageType.POLICY}>Chính sách</MenuItem>
                                        <MenuItem value={StaticPageType.GUIDE}>Hướng dẫn</MenuItem>
                                   </TextField>

                                   <TextField
                                        select
                                        label="Trạng thái"
                                        value={form.isActive}
                                        onChange={e => setForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                                        fullWidth
                                        margin="normal"
                                   >
                                        <MenuItem value="true">Hoạt động</MenuItem>
                                        <MenuItem value="false">Không hoạt động</MenuItem>
                                   </TextField>
                              </Box>
                         </DialogContent>
                         <DialogActions>
                              <Button onClick={() => setPreviewOpen(true)} color="info">
                                   Xem trước
                              </Button>
                              <Button onClick={handleCloseDialog}>Hủy</Button>
                              <Button
                                   onClick={handleSubmit}
                                   variant="contained"
                                   disabled={createMutation.isPending || updateMutation.isPending}
                              >
                                   {editingId ? 'Lưu' : 'Thêm'}
                              </Button>
                         </DialogActions>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
                         <DialogTitle>Xác nhận xóa</DialogTitle>
                         <DialogContent>
                              <Typography>Bạn có chắc chắn muốn xóa trang này?</Typography>
                         </DialogContent>
                         <DialogActions>
                              <Button onClick={() => setDeleteId(null)}>Hủy</Button>
                              <Button
                                   onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                                   color="error"
                                   variant="contained"
                                   disabled={deleteMutation.isPending}
                              >
                                   Xóa
                              </Button>
                         </DialogActions>
                    </Dialog>

                    <PagePreview />
               </Paper>
          </Box>
     );
}
