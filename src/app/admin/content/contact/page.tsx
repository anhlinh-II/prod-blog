'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompanyCOntact, updateCompanyContact } from '@/services/CompanyContactService';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState } from 'react';

export default function CompanyContactPage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    facebook: '',
    messenger: '',
    zalo: '',
    phone: '',
  });

  // Fetch contact info
  const { data, isLoading, error } = useQuery({
    queryKey: ['company-contact'],
    queryFn: async () => {
      const response = await getCompanyCOntact();
      // Get first contact from page result
      const contact = response.result;
      if (contact) {
        setForm({
          facebook: contact.facebook || '',
          messenger: contact.messenger || '',
          zalo: contact.zalo || '',
          phone: contact.phone || '',
        });
      }
      return contact;
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateCompanyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-contact'] });
      setIsEditing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Lỗi tải thông tin liên hệ</Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Thông tin liên hệ công ty
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Facebook"
            value={form.facebook}
            onChange={e => setForm(prev => ({ ...prev, facebook: e.target.value }))}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Messenger"
            value={form.messenger}
            onChange={e => setForm(prev => ({ ...prev, messenger: e.target.value }))}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Zalo"
            value={form.zalo}
            onChange={e => setForm(prev => ({ ...prev, zalo: e.target.value }))}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Số điện thoại"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {!isEditing ? (
              <Button 
                variant="contained"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form to original data
                    if (data) {
                      setForm({
                        facebook: data.facebook || '',
                        messenger: data.messenger || '',
                        zalo: data.zalo || '',
                        phone: data.phone || '',
                      });
                    }
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? <CircularProgress size={24} /> : 'Lưu'}
                </Button>
              </>
            )}
          </Box>
        </form>

        {updateMutation.isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Cập nhật thông tin liên hệ thành công
          </Alert>
        )}
        
        {updateMutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Lỗi cập nhật thông tin liên hệ
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
