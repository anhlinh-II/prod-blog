// src/app/admin/layout.tsx
'use client'; // Vẫn giữ 'use client' nếu bạn dùng state, hooks của React bên trong

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Box, IconButton, Typography, CssBaseline } from '@mui/material';
// Nếu bạn dùng ThemeProvider của MUI cho admin và muốn có theme riêng, hãy import
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
     Menu as MenuIconLib, // Đổi tên để tránh trùng với component Menu của react-pro-sidebar
     Dashboard as DashboardIcon,
     Category as CategoryIcon,
     ShoppingCart as SalesIcon,
     People as CustomersIcon,
     Article as ContentIcon,
     Inventory as ProductIcon,
     Description as ProductDetailIcon,
     Settings as SpecsIcon,
     Image as BannerIcon,
     PostAdd as PostIcon,
     Person as AuthorIcon,
     Receipt as OrderIcon
} from '@mui/icons-material';

// Ví dụ theme MUI riêng cho admin (tùy chọn)
// const adminTheme = createTheme({
//   palette: {
//     primary: { main: '#007bff' }, // Ví dụ màu primary khác
//   },
//   // ... các tùy chỉnh theme khác
// });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const [toggled, setToggled] = useState(false); // State cho responsive toggle

    // In ra console để debug xem AdminLayout có được render không khi F5
    console.log('AdminLayout rendered, pathname:', pathname);

    const menuItems = [
        {
            title: 'Tổng quan',
            icon: <DashboardIcon />,
            path: '/admin/dashboard',
        },
        {
            title: 'Danh mục',
            icon: <CategoryIcon />,
            subMenu: [
                { title: 'Danh mục sản phẩm', path: '/admin/categories/products', icon: <ProductIcon /> },
                { title: 'Sản phẩm chi tiết', path: '/admin/categories/product-details', icon: <ProductDetailIcon /> },
                { title: 'Thông số kỹ thuật', path: '/admin/categories/specs', icon: <SpecsIcon /> },
            ],
        },
        {
            title: 'Bán hàng',
            icon: <SalesIcon />,
            subMenu: [
                { title: 'Quản lý đơn hàng', path: '/admin/sales/orders', icon: <OrderIcon /> },
            ],
        },
        {
            title: 'Khách hàng',
            icon: <CustomersIcon />,
            path: '/admin/customers',
        },
        {
            title: 'Quản lý nội dung',
            icon: <ContentIcon />,
            subMenu: [
                { title: 'Quản lý banner', path: '/admin/content/banners', icon: <BannerIcon /> },
                { title: 'Quản lý bài viết', path: '/admin/content/posts', icon: <PostIcon /> },
                { title: 'Quản lý tác giả', path: '/admin/content/authors', icon: <AuthorIcon /> },
            ],
        },
    ];

    return (
        <html lang="vi" suppressHydrationWarning>
            <head>
                <title>Trang Quản Trị</title>
                {/* Các thẻ meta, link CSS riêng cho admin nếu cần */}
                {/* Ví dụ: <link rel="stylesheet" href="/admin-styles.css" /> */}
                <meta name="robots" content="noindex, nofollow" /> {/* Ngăn search engine index trang admin */}
            </head>
            <body suppressHydrationWarning style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}> {/* Reset margin/padding trình duyệt */}
                {/* <ThemeProvider theme={adminTheme}> // Nếu dùng theme MUI riêng */}
                <CssBaseline /> {/* Rất quan trọng khi dùng Material UI */}
                <Box sx={{ display: 'flex', height: '100vh', minHeight: '100vh', width: '100vw' }}>
                    <Sidebar
                        collapsed={collapsed}
                        toggled={toggled}
                        onBackdropClick={() => setToggled(false)} // Đóng sidebar khi click ra ngoài trên mobile
                        onBreakPoint={(broken) => {
                            // console.log('Sidebar breakpoint change:', broken);
                            // Nếu muốn tự động collapse/expand dựa trên breakpoint, bạn có thể xử lý ở đây
                            // hoặc để người dùng tự toggle
                        }}
                        breakPoint="md" // Điểm gãy cho responsive
                        backgroundColor="#ffffff"
                        width={collapsed ? "80px" : "270px"} // Độ rộng của sidebar
                        style={{ height: '100vh', position: 'relative', borderRight: '1px solid #e0e0e0' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', p: '16px', height: '64px', borderBottom: '1px solid #e0e0e0' }}>
                            {!collapsed && <Typography variant="h6" fontWeight="bold" noWrap>Admin Panel</Typography>}
                            <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ display: { xs: 'none', md: 'inline-flex' }}}>
                                <MenuIconLib />
                            </IconButton>
                        </Box>
                        <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
                            <Menu
                                menuItemStyles={{
                                    button: ({ level, active }) => ({
                                        color: active ? '#f50057' : '#333', // Màu chữ cho item active và bình thường
                                        backgroundColor: active ? '#fce4ec' : 'transparent', // Nền cho item active
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0', // Nền khi hover
                                            color: '#d32f2f', // Màu chữ khi hover
                                        },
                                        paddingLeft: collapsed && level === 0 ? '22px': undefined, // Căn giữa icon khi collapsed
                                    }),
                                    icon: ({ level }) => ({ // Canh giữa icon khi collapsed
                                        marginLeft: collapsed && level === 0 ? '0': undefined,
                                    }),
                                }}
                            >
                                {menuItems.map((item) => (
                                    item.subMenu ? (
                                        <SubMenu
                                            key={item.path || item.title}
                                            label={item.title}
                                            icon={item.icon}
                                            // defaultOpen={pathname.startsWith(item.path || '') || item.subMenu.some(sub => pathname.startsWith(sub.path))}
                                            // Bỏ defaultOpen nếu bạn không muốn nó tự mở dựa trên path, hoặc điều chỉnh logic cho phù hợp
                                        >
                                            {item.subMenu.map((subItem) => (
                                                <MenuItem
                                                    key={subItem.path}
                                                    icon={subItem.icon}
                                                    active={pathname === subItem.path}
                                                    component={<Link href={subItem.path} />}
                                                >
                                                    {subItem.title}
                                                </MenuItem>
                                            ))}
                                        </SubMenu>
                                    ) : (
                                        <MenuItem
                                            key={item.path}
                                            icon={item.icon}
                                            active={pathname === item.path}
                                            component={<Link href={item.path} />}
                                        >
                                            {item.title}
                                        </MenuItem>
                                    )
                                ))}
                            </Menu>
                        </Box>
                    </Sidebar>
                    <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, overflow: 'auto', backgroundColor: '#f4f6f8', position: 'relative' }}>
                        <IconButton
                            onClick={() => setToggled(!toggled)} // Nút này để toggle sidebar trên mobile
                            sx={{
                                display: { xs: 'inline-flex', md: 'none' }, // Chỉ hiện trên mobile
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                zIndex: 1300, // Đảm bảo nổi trên các element khác
                                backgroundColor: 'white',
                                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
                            }}
                        >
                            <MenuIconLib />
                        </IconButton>
                        <Box sx={{ mt: { xs: 6, md: 0 } }}> {/* Đẩy content xuống nếu nút toggle hiện */}
                            {children}
                        </Box>
                    </Box>
                </Box>
                {/* </ThemeProvider> */}
            </body>
        </html>
    );
}