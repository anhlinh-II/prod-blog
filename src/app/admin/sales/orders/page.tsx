'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOrders, getOrderById, deleteOrder } from '@/services/OrderService';
import { OrderResponse, OrderStatus } from '@/types/Order';
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
  CircularProgress,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useState } from 'react';

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [tempSize, setTempSize] = useState<string>('10');
  const [size, setSize] = useState(10);
  const [viewOrder, setViewOrder] = useState<OrderResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch orders
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['orders', page, size],
    queryFn: async () => {
      const res = await getAllOrders(page, size);
      return res.result;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
  });

  // Handlers
  const handleViewOrder = async (id: number) => {
    const res = await getOrderById(id);
    setViewOrder(res.result);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleSizeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newSize = Math.max(1, parseInt(tempSize) || 10);
      setSize(newSize);
      setPage(0);
    }
  };

  // Get status color
  const getStatusChipColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW: return 'info';
      case OrderStatus.PROCESSING: return 'warning';
      case OrderStatus.COMPLETED: return 'success';
      case OrderStatus.CANCELLED: return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý đơn hàng
      </Typography>

      <Paper sx={{ p: 2 }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn</TableCell>
                  <TableCell>Ngày đặt</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Số sản phẩm</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageData?.content.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        color={getStatusChipColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.total.toLocaleString()}đ</TableCell>
                    <TableCell>{order.orderItems.length}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewOrder(order.id)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteClick(order.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
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
                <Typography>Số đơn/trang:</Typography>
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
          </>
        )}
      </Paper>

      {/* View Order Dialog */}
      <Dialog 
        open={Boolean(viewOrder)} 
        onClose={() => setViewOrder(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết đơn hàng #{viewOrder?.id}</DialogTitle>
        <DialogContent dividers>
          {viewOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>Thông tin khách hàng</Typography>
              <Typography>Họ tên: {viewOrder.customerInfo.firstName} {viewOrder.customerInfo.lastName}</Typography>
              <Typography>SĐT: {viewOrder.customerInfo.phone}</Typography>
              <Typography>Email: {viewOrder.customerInfo.email}</Typography>
              <Typography>Địa chỉ: {viewOrder.customerInfo.address}</Typography>
              <Typography>Ghi chú: {viewOrder.customerInfo.note}</Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Sản phẩm</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên SP</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewOrder.orderItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unitPrice.toLocaleString()}đ</TableCell>
                      <TableCell align="right">{item.subtotal.toLocaleString()}đ</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right"><strong>Phí vận chuyển:</strong></TableCell>
                    <TableCell align="right">{viewOrder.shippingCost.toLocaleString()}đ</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right"><strong>Thuế:</strong></TableCell>
                    <TableCell align="right">{viewOrder.tax.toLocaleString()}đ</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right"><strong>Tổng cộng:</strong></TableCell>
                    <TableCell align="right"><strong>{viewOrder.total.toLocaleString()}đ</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOrder(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa đơn hàng #{deleteId}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button 
            color="error" 
            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={24} /> : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
