// src/app/admin/dashboard/page.tsx
import { Typography } from '@mui/material';

export default function DashboardPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome to Admin Dashboard
      </Typography>
      <Typography paragraph>
        Đây là nội dung chính của trang Dashboard.
      </Typography>
      {/* Thêm các components và nội dung khác cho Dashboard ở đây */}
    </>
  );
}