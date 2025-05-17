// src/app/admin/layout.tsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Box, IconButton, Typography, CssBaseline } from '@mui/material';
import {
     Menu as MenuIconLib,
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const [toggled, setToggled] = useState(false);

    console.log('AdminLayout rendered, pathname:', pathname);

    const menuItems = [
        // ... (menuItems của bạn)
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
        <html lang="vi" suppressHydrationWarning style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <head>
                <title>Trang Quản Trị</title>
                <meta name="robots" content="noindex, nofollow" />
            </head>
            {/* Quan trọng: Ngăn cuộn ở body, set height/width 100% */}
            <body suppressHydrationWarning style={{ margin: 0, padding: 0, boxSizing: 'border-box', height: '100%', width: '100%', overflow: 'hidden' }}>
                <CssBaseline />
                {/* Box này cũng cần height/width 100% và overflow hidden */}
                <Box sx={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
                    <Sidebar
                        collapsed={collapsed}
                        toggled={toggled}
                        onBackdropClick={() => setToggled(false)}
                        onBreakPoint={(broken) => {
                            // Logic cho breakpoint
                        }}
                        breakPoint="md"
                        backgroundColor="#ffffff"
                        width={collapsed ? "80px" : "270px"}
                        // Sidebar sẽ co giãn theo chiều cao của Box cha (100vh)
                        // Không cần set height ở đây nếu cha đã là 100%
                        style={{ position: 'relative', borderRight: '1px solid #e0e0e0', height: '100%' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', p: '16px', height: '64px', borderBottom: '1px solid #e0e0e0', flexShrink: 0 /* Ngăn co lại */ }}>
                            {!collapsed && <Typography variant="h6" fontWeight="bold" noWrap>Admin Panel</Typography>}
                            <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ display: { xs: 'none', md: 'inline-flex' }}}>
                                <MenuIconLib />
                            </IconButton>
                        </Box>
                        {/* Box chứa Menu sẽ có cuộn nội bộ */}
                        <Box sx={{ overflowY: 'auto', height: 'calc(100% - 64px)' /* Chiều cao còn lại sau header của sidebar */ }}>
                            <Menu
                                menuItemStyles={{
                                    button: ({ level, active }) => ({
                                        color: active ? '#f50057' : '#333',
                                        backgroundColor: active ? '#fce4ec' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                            color: '#d32f2f',
                                        },
                                        paddingLeft: collapsed && level === 0 ? '22px': undefined,
                                    }),
                                    icon: ({ level }) => ({
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
                    {/* Box Main Content cũng sẽ có cuộn nội bộ */}
                    <Box component="main" sx={{
                        flexGrow: 1,
                        p: { xs: 2, md: 3 },
                        backgroundColor: '#f4f6f8',
                        position: 'relative',
                        height: '100%', // Chiếm 100% chiều cao của cha
                        overflowY: 'auto' // Cho phép cuộn nội bộ
                    }}>
                        <IconButton
                            onClick={() => setToggled(!toggled)}
                            sx={{
                                display: { xs: 'inline-flex', md: 'none' },
                                position: 'absolute', // Hoặc 'fixed' nếu muốn nó cố định khi cuộn nội dung bên trong main
                                top: 16,
                                left: 16,
                                zIndex: 1300,
                                backgroundColor: 'white',
                                boxShadow: 3
                            }}
                        >
                            <MenuIconLib />
                        </IconButton>
                        <Box sx={{ mt: { xs: 6, md: 0 } }}>
                            {children}
                        </Box>
                    </Box>
                </Box>
            </body>
        </html>
    );
}