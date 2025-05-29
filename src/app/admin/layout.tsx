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
    Receipt as OrderIcon,
    Policy
} from '@mui/icons-material';
import { ContactIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { callFetchAccount, callLogout } from '@/services/AuthService';
import Avatar from '@mui/material/Avatar';
import MenuMui from '@mui/material/Menu';
import MenuItemMui from '@mui/material/MenuItem';

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
                { title: 'Danh mục sản phẩm', path: '/admin/categories/product-categories', icon: <ProductIcon /> },
                { title: 'Sản phẩm chi tiết', path: '/admin/categories/products-details', icon: <ProductDetailIcon /> },
            ],
        },
        {
            title: 'Bán hàng',
            icon: <SalesIcon />,
            subMenu: [
                { title: 'Quản lý đơn hàng', path: '/admin/sales/orders', icon: <OrderIcon /> },
                {
                    title: 'Khách hàng',
                    icon: <CustomersIcon />,
                    path: '/admin/sales/customers',
                },
            ],
        },
        {
            title: 'Quản lý nội dung',
            icon: <ContentIcon />,
            subMenu: [
                { title: 'Quản lý banner', path: '/admin/content/banners', icon: <BannerIcon /> },
                { title: 'Quản lý bài viết', path: '/admin/content/news', icon: <PostIcon /> },
                { title: 'Quản lý tác giả', path: '/admin/content/authors', icon: <AuthorIcon /> },
                { title: 'Quản lý liên lạc', path: '/admin/content/contact', icon: <ContactIcon /> },
                { title: 'Quản lý trang tĩnh', path: '/admin/content/static-pages', icon: <Policy /> },

            ],
        },
    ];

    // Fetch account info
    const { data: accountData } = useQuery({
        queryKey: ['account'],
        queryFn: callFetchAccount,
        staleTime: 5 * 60 * 1000,
    });

    const user = accountData?.data.result.user;
    const userName = user ? user.username : 'Người dùng';
    const avatarUrl = user?.avatarUrl || '/avatar-default.png';

    // Avatar menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        await callLogout();
        window.location.href = '/auth/login';
    };

    return (
        <div style={{ margin: 0, padding: 0, boxSizing: 'border-box', height: '100%', width: '100%', overflow: 'hidden' }}>
            <CssBaseline />
            <Box sx={{
                display: 'flex',
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                flexDirection: { xs: 'column', md: 'row' }
            }}>
                <Sidebar
                    collapsed={collapsed}
                    toggled={toggled}
                    onBackdropClick={() => setToggled(false)}
                    breakPoint="md"
                    backgroundColor="#ffffff"
                    width={collapsed ? "80px" : "270px"}
                    style={{
                        zIndex: 1400,
                        borderRight: '1px solid #e0e0e0',
                        height: '100%',
                        display: typeof window !== 'undefined' && window.innerWidth < 900 ? (toggled ? 'block' : 'none') : 'block',
                        left: 0,
                        top: 0,
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        p: '16px',
                        height: '64px',
                        borderBottom: '1px solid #e0e0e0',
                        flexShrink: 0
                    }}>
                        {!collapsed && (
                            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="h6" fontWeight="bold" noWrap>
                                    VShare
                                </Typography>
                            </Link>
                        )}
                        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                            <MenuIconLib />
                        </IconButton>
                    </Box>
                    <Box sx={{ overflowY: 'auto', height: 'calc(100% - 64px)' }}>
                        <Menu
                            menuItemStyles={{
                                button: ({ level, active }) => ({
                                    color: active ? '#f50057' : '#333',
                                    backgroundColor: active ? '#fce4ec' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                        color: '#d32f2f',
                                    },
                                    paddingLeft: collapsed && level === 0 ? '22px' : undefined,
                                }),
                                icon: ({ level }) => ({
                                    marginLeft: collapsed && level === 0 ? '0' : undefined,
                                }),
                            }}
                        >
                            {menuItems.map((item) =>
                                item.subMenu ? (
                                    <SubMenu key={item.title} label={item.title} icon={item.icon}>
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
                            )}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* User info at bottom */}
                    <Box sx={{
                        p: 2,
                        borderTop: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        minHeight: 64,
                    }}
                        onClick={handleAvatarClick}
                    >
                        <Avatar src={avatarUrl} alt={userName} sx={{ width: 36, height: 36 }} />
                        {!collapsed && (
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ ml: 1 }}>
                                {userName}
                            </Typography>
                        )}
                    </Box>
                    <MenuMui
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <MenuItemMui onClick={handleLogout}>Đăng xuất</MenuItemMui>
                    </MenuMui>
                </Sidebar>

                <Box component="main" sx={{
                    flexGrow: 1,
                    p: { xs: 1, md: 3 },
                    backgroundColor: '#f4f6f8',
                    position: 'relative',
                    height: '100%',
                    overflowY: 'auto'
                }}>
                    <IconButton
                        onClick={() => setToggled(!toggled)}
                        sx={{
                            display: { xs: 'inline-flex', md: 'none' },
                            position: 'fixed',
                            top: 16,
                            left: 16,
                            zIndex: 1500,
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
        </div>
    );
}