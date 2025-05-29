'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllNews, createNews, updateNews, deleteNews } from '@/services/NewsService';
import { uploadNewsImages, deleteImage } from '@/services/MediaService';
import { NewsRequest, NewsType, NewsResponse } from '@/types/News';
import dynamic from 'next/dynamic';
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
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { MediaResponse } from '@/types';

// Dynamic import for the editor to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const defaultForm: NewsRequest = {
  title: '',
  content: '',
  type: NewsType.NEWS,
  categoryIds: null,
};

export default function AdminNewsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState<NewsRequest>(defaultForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<MediaResponse[]>([]);
  const [deletedNewsView, setDeletedNewsView] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsResponse | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [tempSize, setTempSize] = useState<string>('10');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch news with pagination
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['news', page, size, deletedNewsView],
    queryFn: async () => {
      const res = deletedNewsView ? 
        await getAllNews(page, size) : 
        await getAllNews(page, size);
      return res.result;
    },
  });

  // Combined mutation for create/update news with images
  const createMutation = useMutation({
    mutationFn: async (data: {form: NewsRequest, files: File[]}) => {
        // First create the news
        const newsResponse = await createNews(data.form);
        
        // Then upload images if any
        if (data.files.length > 0) {
            await uploadNewsImages(newsResponse.result.id, data.files);
        }
        
        return newsResponse;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['news'] });
        handleCloseDialog();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, form, files }: { id: number, form: NewsRequest, files: File[] }) => {
        // First update the news
        const newsResponse = await updateNews(id, form);
        
        // Then upload new images if any
        if (files.length > 0) {
            await uploadNewsImages(id, files);
        }
        
        return newsResponse;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['news'] });
        handleCloseDialog();
    }
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: (mediaId: number) => deleteImage(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    }
  });

  // Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create preview MediaResponse objects
    const newPreviews: MediaResponse[] = files.map(file => ({
      id: 0,
      fileName: file.name,
      url: URL.createObjectURL(file),
      fileType: file.type,
      size: file.size
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNews) {
        updateMutation.mutate({
            id: editingNews.id,
            form,
            files: selectedFiles
        });
    } else {
        createMutation.mutate({
            form,
            files: selectedFiles
        });
    }
  };

  const handleOpenDialog = () => {
    setForm(defaultForm);
    setSelectedFiles([]);
    setPreviews([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm(defaultForm);
    setSelectedFiles([]);
    setPreviews([]);
    setEditingNews(null);
  };

  // Update form for edit mode
  const handleOpenEdit = (news: NewsResponse) => {
    setEditingNews(news);
    setForm({
      title: news.title,
      content: news.content,
      type: news.type,
      categoryIds: null,
    });
    setPreviews(news.images || []);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteImageMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleSizeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newSize = Math.max(1, parseInt(tempSize) || 10);
      setSize(newSize);
      setPage(0);
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý tin tức
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Danh sách tin tức</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Thêm tin tức
          </Button>
        </Box>

        {/* News Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Lượt xem</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Người tạo</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData?.content.map((news) => (
              <TableRow key={news.id}>
                <TableCell>{news.title}</TableCell>
                <TableCell>{news.type}</TableCell>
                <TableCell>{news.views}</TableCell>
                <TableCell>{new Date(news.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{news.createdBy}</TableCell>
                <TableCell>
                  {news.images?.[0] && (
                    <Image 
                      src={`${apiUrl}${news.images[0].url}`}
                      alt={news.images[0].fileName}
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEdit(news)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(news.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Add Pagination Controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
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
            <Typography component="span">Số tin/trang:</Typography>
            <TextField
              size="small"
              type="number"
              value={tempSize}
              onChange={e => setTempSize(e.target.value)}
              onKeyPress={handleSizeKeyPress}
              onBlur={() => setTempSize(size.toString())} // Reset to current size if focus is lost
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

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingNews ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Tiêu đề"
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              margin="normal"
            />
            
            <TextField
              label="Nội dung"
              value={form.content}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />

            <TextField
              select
              label="Loại tin"
              value={form.type}
              onChange={e => setForm(prev => ({ ...prev, type: e.target.value as NewsType }))}
              fullWidth
              margin="normal"
            >
              <MenuItem value={NewsType.NEWS}>Tin tức</MenuItem>
              <MenuItem value={NewsType.TIPS}>Mẹo hay</MenuItem>
              <MenuItem value={NewsType.ANNOUNCEMENT}>Thông báo</MenuItem>
            </TextField>

            {/* Image Upload */}
            <Box sx={{ mt: 2 }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
              >
                Thêm ảnh
              </Button>
            </Box>

            {/* Image Preview */}
            <ImageList cols={3} sx={{ mt: 2 }}>
              {previews.map((preview, index) => (
                <ImageListItem key={index}>
                  <Image
                    src={preview.url.startsWith('blob:') ? preview.url : `${apiUrl}${preview.url}`}
                    alt={preview.fileName || ''}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <ImageListItemBar
                    title={preview.fileName}
                    actionIcon={
                      <IconButton
                        sx={{ color: 'white' }}
                        onClick={() => {
                          if (preview.url.startsWith('blob:')) {
                            handleRemoveFile(index);
                          } else if (preview.id) {
                            deleteImageMutation.mutate(preview.id);
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              disabled={createMutation.isPending}
            >
              {editingNews ? 'Lưu' : 'Thêm'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            Bạn có chắc chắn muốn xóa tin tức này?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Hủy</Button>
            <Button 
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
