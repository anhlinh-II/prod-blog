// src/app/admin/page.tsx
import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  redirect('/admin/dashboard');
  // Bạn không cần return gì ở đây sau khi gọi redirect
}