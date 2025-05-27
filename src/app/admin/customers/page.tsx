'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { ContactResponse } from '@/types';
import { Page as PageType } from '@/types';
import { getAllContacts, deleteContact } from '@/services/ContactService';
import { useState } from 'react';

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactResponse | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null);

  // Fetch contacts with pagination
  const { data: pageData, isLoading, error } = useQuery<PageType<ContactResponse>>({
    queryKey: ['contacts', page, size],
    queryFn: async () => {
      const res = await getAllContacts(page, size);
      return res.result;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setOpenDeleteDialog(false);
      setDeleteContactId(null);
    },
  });

  // Handlers
  const handleViewDetails = (contact: ContactResponse) => {
    setSelectedContact(contact);
    setOpenDetailDialog(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteContactId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteContactId) {
      deleteMutation.mutate(deleteContactId);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Danh sách liên hệ
      </Typography>
      <Paper sx={{ p: 2 }}>
        {isLoading && <CircularProgress />}
        {error && <Typography color="error">Lỗi tải dữ liệu</Typography>}
        {!isLoading && !error && (
          <>
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pageData?.content.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>{contact.id}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Tooltip title="Xem chi tiết">
                          <IconButton color="primary" onClick={() => handleViewDetails(contact)}>
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton color="error" onClick={() => handleDeleteClick(contact.id)}>
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
                <Typography component="span">Số liên hệ/trang:</Typography>
                <TextField
                  size="small"
                  type="number"
                  value={size}
                  onChange={e => {
                    const val = Math.max(1, Number(e.target.value));
                    setSize(val);
                    setPage(0);
                  }}
                  inputProps={{ min: 1, style: { width: 60 } }}
                />
                <Typography component="span">
                  Tổng: {pageData?.page.totalElements ?? 0}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Paper>

      {/* Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết liên hệ</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box sx={{ p: 2 }}>
              <Typography><b>ID:</b> {selectedContact.id}</Typography>
              <Typography><b>Tên:</b> {selectedContact.name}</Typography>
              <Typography><b>Email:</b> {selectedContact.email}</Typography>
              <Typography><b>Số điện thoại:</b> {selectedContact.phone}</Typography>
              <Typography><b>Tin nhắn:</b> {selectedContact.message}</Typography>
              <Typography><b>Ngày tạo:</b> {new Date(selectedContact.createdAt).toLocaleString()}</Typography>
              <Typography><b>Ngày cập nhật:</b> {new Date(selectedContact.updatedAt).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa liên hệ</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa liên hệ này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
