// src/app/admin/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/services';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  ShoppingCart as OrderIcon,
  Inventory as ProductIcon,
  Mail as ContactIcon,
  Article as NewsIcon,
  Visibility as ViewsIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import ChartBarIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import ArticleIcon from '@mui/icons-material/Article';

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * (target - start) + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };
    requestAnimationFrame(step);
    // Reset on target change
    return () => setValue(0);
  }, [target, duration]);
  return value;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
  bg,
  shadow,
}: {
  icon: any;
  title: string;
  value: number;
  color: string;
  bg: string;
  shadow: string;
}) => {
  const count = useCountUp(value, 1200);
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer ${bg} ${shadow} relative overflow-hidden`}
    >
      <div className="z-10 flex flex-col items-center">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full mb-2" // increased from w-10 h-10 to w-16 h-16
          style={{
            background: `linear-gradient(135deg, ${color}33 0%, ${color}99 100%)`,
          }}
        >
          <Icon style={{ fontSize: 28, color }} />
        </div>
        <div className="text-lg font-semibold text-gray-800 mb-1 drop-shadow">{title}</div>
        <div
          className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow"
          style={{ color }}
        >
          {count.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Helper function to ensure all weeks are included
  const normalizeWeeklyData = (data: Record<string, number> = {}) => {
    // Get all weeks
    const allWeeks = Object.keys(data).sort();
    if (allWeeks.length === 0) return [];

    // Create array with all weeks, including zeros
    return allWeeks.map(week => ({
      date: week,
      value: data[week] || 0
    }));
  };

  // Convert object data to array format for charts, ensuring all weeks are included
  const orderData = normalizeWeeklyData(dashboard?.ordersByWeek).map(item => ({
    date: item.date,
    'Đơn hàng': item.value,
  }));

  const contactData = normalizeWeeklyData(dashboard?.contactsByWeek).map(item => ({
    date: item.date,
    'Liên hệ': item.value,
  }));

  const newsData = normalizeWeeklyData(dashboard?.newsByWeek).map(item => ({
    date: item.date,
    'Bài viết': item.value,
  }));

  // Format week label to be more readable
  const formatWeekLabel = (week: string) => {
    const [year, weekNum] = week.split('-W');
    return `Tuần ${weekNum}`;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Tổng quan
      </Typography>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          icon={OrderIcon}
          title="Đơn hàng"
          value={dashboard?.totalOrders || 0}
          color="#1976d2"
          bg="bg-gradient-to-br from-blue-100 to-blue-50"
          shadow="shadow-blue-200"
        />
        <StatCard
          icon={ProductIcon}
          title="Sản phẩm"
          value={dashboard?.totalProducts || 0}
          color="#2e7d32"
          bg="bg-gradient-to-br from-green-100 to-green-50"
          shadow="shadow-green-200"
        />
        <StatCard
          icon={ContactIcon}
          title="Liên hệ"
          value={dashboard?.totalContacts || 0}
          color="#ed6c02"
          bg="bg-gradient-to-br from-orange-100 to-orange-50"
          shadow="shadow-orange-200"
        />
        <StatCard
          icon={NewsIcon}
          title="Bài viết"
          value={dashboard?.totalNews || 0}
          color="#9c27b0"
          bg="bg-gradient-to-br from-purple-100 to-purple-50"
          shadow="shadow-purple-200"
        />
        <StatCard
          icon={ViewsIcon}
          title="Lượt xem"
          value={dashboard?.totalViews || 0}
          color="#d32f2f"
          bg="bg-gradient-to-br from-pink-100 to-pink-50"
          shadow="shadow-pink-200"
        />
      </div>

      {/* Charts with side icon/image */}
      <div className="space-y-8">
        {/* Orders Chart */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <Paper sx={{ p: 3, flex: 1, minWidth: 0 }}>
            <Typography variant="h6" gutterBottom>
              Đơn hàng theo tuần
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatWeekLabel}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(label) => `Tuần ${label.split('-W')[1]}`}
                  formatter={(value) => [value, 'Đơn hàng']}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Đơn hàng"
                  fill="#1976d2"
                  stroke="#1976d2"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
          <div className="flex flex-col items-center justify-center min-w-[200px] max-w-[260px] flex-shrink-0 bg-blue-50 rounded-2xl shadow-inner">
            <ChartBarIcon sx={{ fontSize: 60, color: '#1976d2' }} />
            <span className="mt-2 text-blue-700 font-semibold">Đơn hàng</span>
            <img
              src="/images/order-chart.png"
              alt="Đơn hàng"
              className="w-24 h-24 object-contain mt-2"
              style={{ display: 'none' /* Replace with your image if needed */ }}
            />
          </div>
        </div>

        {/* Contacts Chart */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <Paper sx={{ p: 3, flex: 1, minWidth: 0 }}>
            <Typography variant="h6" gutterBottom>
              Liên hệ theo tuần
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={contactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatWeekLabel}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(label) => `Tuần ${label.split('-W')[1]}`}
                  formatter={(value) => [value, 'Liên hệ']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Liên hệ"
                  stroke="#ed6c02"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
          <div className="flex flex-col items-center justify-center min-w-[200px] max-w-[260px] flex-shrink-0 bg-orange-50 rounded-2xl shadow-inner">
            <TimelineIcon sx={{ fontSize: 60, color: '#ed6c02' }} />
            <span className="mt-2 text-orange-700 font-semibold">Liên hệ</span>
            <img
              src="/images/contact-chart.png"
              alt="Liên hệ"
              className="w-24 h-24 object-contain mt-2"
              style={{ display: 'none' /* Replace with your image if needed */ }}
            />
          </div>
        </div>

        {/* News Chart */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <Paper sx={{ p: 3, flex: 1, minWidth: 0 }}>
            <Typography variant="h6" gutterBottom>
              Bài viết theo tuần
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={newsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatWeekLabel}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(label) => `Tuần ${label.split('-W')[1]}`}
                  formatter={(value) => [value, 'Bài viết']}
                />
                <Legend />
                <Bar dataKey="Bài viết" fill="#9c27b0" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
          <div className="flex flex-col items-center justify-center min-w-[200px] max-w-[260px] flex-shrink-0 bg-purple-50 rounded-2xl shadow-inner">
            <ArticleIcon sx={{ fontSize: 60, color: '#9c27b0' }} />
            <span className="mt-2 text-purple-700 font-semibold">Bài viết</span>
            <img
              src="/images/news-chart.png"
              alt="Bài viết"
              className="w-24 h-24 object-contain mt-2"
              style={{ display: 'none' /* Replace with your image if needed */ }}
            />
          </div>
        </div>
      </div>
    </Box>
  );
}