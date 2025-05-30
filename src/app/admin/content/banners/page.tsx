'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, 
  Typography,
  Paper,
  CircularProgress,
  Button,
  ImageList,
  ImageListItem,
  IconButton
} from '@mui/material';
import Image from 'next/image';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import { getBannerImages, uploadBannerImages } from '@/services/MediaService';
import { MediaResponse } from '@/types';

export default function AdminBannersPage() {
  const imagesUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  // Fetch banners
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const res = await getBannerImages();
      return res.result;
    }
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      setUploading(true);
      try {
        return await uploadBannerImages(files);
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    }
  });

  // Handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    uploadMutation.mutate(files);
  };

  const handleDeleteBanner = (bannerId: number) => {
    // TODO: Implement delete banner API
    console.log('Delete banner:', bannerId);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý Banner
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Danh sách banner ({banners.length})
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<AddIcon />}
            disabled={uploading}
          >
            Thêm banner
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>
        </Box>

        {uploading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        <ImageList cols={3} gap={16}>
          {banners.map((banner: MediaResponse) => (
            <ImageListItem 
              key={banner.id} 
              sx={{ 
                border: '1px solid #eee',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Image
                src={banner.url.startsWith('http') ? banner.url : `${imagesUrl}${banner.url}`}
                alt={banner.fileName}
                width={400}
                height={200}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  }
                }}
                onClick={() => handleDeleteBanner(banner.id)}
              >
                <DeleteIcon color="error" />
              </IconButton>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  p: 1,
                  fontSize: '0.875rem'
                }}
              >
                <Typography noWrap variant="caption">
                  {banner.fileName}
                </Typography>
              </Box>
            </ImageListItem>
          ))}
        </ImageList>

        {banners.length === 0 && !uploading && (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height={200}
            bgcolor="#f5f5f5"
            borderRadius={1}
          >
            <Typography color="text.secondary">
              Chưa có banner nào
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
