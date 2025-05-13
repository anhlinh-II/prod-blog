'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grow,
  Popper,
  List,
  ListItemButton,
  Collapse,
  Drawer,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { ApiResponse, CategoryResponse } from '@/types';
import { fetchCategories } from '@/services';





const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElSubMobile, setAnchorElSubMobile] = useState<{ [key: string]: HTMLElement | null }>({});
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchCategories();
      console.log('Fetched categories:', response);
      if (response) {
        setCategories(response);
        console.log("categories", response);
      }
    };
    fetchData();
  }, []);

  const navItems = [
    {
      label: 'Hàng Mới',
      key: 'new-arrivals',
      subItems: [],
    },
    {
      label: 'Bán Chạy',
      key: 'best-sellers',
      subItems: [],
    },
    {
      label: 'Danh mục sản phẩm',
      key: 'clothing',
      subItems: categories
    },
    // {
    //   label: 'Sức Khỏe & Làm Đẹp',
    //   key: 'health-beauty',
    //   subItems: [
    //     { title: 'CHĂM SÓC DA', items: ['Kem Dưỡng', 'Sữa Rửa Mặt', 'Toner', 'Tinh Chất'] },
    //     { title: 'MỸ PHẨM', items: ['Son Môi', 'Phấn Nền', 'Kem Che Khuyết Điểm', 'Mascara'] },
    //     { title: 'CHĂM SÓC TÓC', items: ['Dầu Gội', 'Dầu Xả', 'Mặt Nạ Tóc'] },
    //     { title: 'ƯU ĐÃI ĐẶC BIỆT', items: ['Hàng Mới', 'Bán Chạy'] },
    //   ],
    // },
    // {
    //   label: 'Gia Dụng',
    //   key: 'home-goods',
    //   subItems: [
    //     { title: 'ĐỒ BẾP', items: ['Nồi', 'Chảo', 'Dụng Cụ Nấu Ăn', 'Hộp Đựng Thực Phẩm'] },
    //     { title: 'ĐỒ GIA DỤNG', items: ['Quạt', 'Bàn Ủi', 'Máy Hút Bụi', 'Đèn Bàn'] },
    //     { title: 'ĐỒ TRANG TRÍ', items: ['Khung Ảnh', 'Nến Thơm', 'Bình Hoa'] },
    //     { title: 'ƯU ĐÃI ĐẶC BIỆT', items: ['Hàng Mới', 'Bán Chạy'] },
    //   ],
    // },
    // {
    //   label: 'Thực Phẩm',
    //   key: 'food',
    //   subItems: [
    //     { title: 'ĐỒ ĂN NHẸ', items: ['Bánh', 'Snack', 'Hạt', 'Kẹo'] },
    //     { title: 'ĐỒ UỐNG', items: ['Nước Ngọt', 'Trà', 'Cà Phê', 'Sữa'] },
    //     { title: 'THỰC PHẨM ĐÓNG GÓI', items: ['Mì Gói', 'Đồ Hộp', 'Gia Vị'] },
    //     { title: 'ƯU ĐÃI ĐẶC BIỆT', items: ['Hàng Mới', 'Bán Chạy'] },
    //   ],
    // },
  ];

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openMobileSubmenuKey, setOpenMobileSubmenuKey] = useState<string | null>(null);

  const desktopNavContainerRef = useRef<HTMLDivElement | null>(null); // Ref cho vùng chứa các mục nav cha
  const [desktopSubmenuAnchor, setDesktopSubmenuAnchor] = useState<null | HTMLElement>(null);
  const [isDesktopSubmenuOpen, setIsDesktopSubmenuOpen] = useState(false);
  const [currentDesktopSubmenuData, setCurrentDesktopSubmenuData] = useState<CategoryResponse[]>([]);
  const [activeDesktopNavKey, setActiveDesktopNavKey] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0); // Để trigger animation khi nội dung thay đổi
  const [slideAnimation, setSlideAnimation] = useState<string>('');

  const popperHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  // Mobile Nav Menu Handlers (giữ nguyên logic hiện tại của bạn)
  const handleOpenNavMenuMobile = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenuMobile = () => {
    setAnchorElNav(null);
    setAnchorElSubMobile({}); // Đóng tất cả submenu con của mobile
  };

  const handleOpenSubMenuMobile = (event: React.MouseEvent<HTMLElement>, key: string) => {
    setAnchorElSubMobile((prev) => ({ ...prev, [key]: event.currentTarget }));
  };

  const handleCloseSubMenuMobile = (key: string) => {
    setAnchorElSubMobile((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const toggleMobileDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setMobileDrawerOpen(open);
    if (!open) { // Khi đóng Drawer, reset luôn submenu đang mở bên trong
      setOpenMobileSubmenuKey(null);
    }
  };

  const handleMobileNavItemClick = (itemKey: string) => {
    const navItem = navItems.find(it => it.key === itemKey);
    if (navItem && navItem.subItems && navItem.subItems.length > 0) {
      // Nếu mục có submenu, toggle mở/đóng submenu đó
      setOpenMobileSubmenuKey(prevKey => (prevKey === itemKey ? null : itemKey));
    } else {
      // Nếu là mục không có con (link lá), đóng Drawer và thực hiện hành động (ví dụ: điều hướng)
      setMobileDrawerOpen(false);
      setOpenMobileSubmenuKey(null); // Reset submenu
      console.log('Mobile Navigating to:', itemKey);
    }
  };

  const handleMobileSubItemLeafClick = (mainItemKey: string, subCategoryTitle: string, subItemText: string) => {
    // Khi click vào một mục con cuối cùng trong Drawer
    console.log('Mobile Clicked Sub Item Leaf:', { mainItemKey, subCategoryTitle, subItemText });
    setMobileDrawerOpen(false);
    setOpenMobileSubmenuKey(null);
    // Thêm logic điều hướng ở đây nếu cần
  };


  // Desktop Nav Menu Handlers
  const handleDesktopNavItemMouseEnter = (event: React.MouseEvent<HTMLElement>, item: (typeof navItems)[0]) => {
    if (popperHideTimeoutRef.current) {
      clearTimeout(popperHideTimeoutRef.current);
    }

    if (item.subItems && item.subItems.length > 0) {
      // Đặt anchor cho Popper là vùng chứa các mục nav
      if (desktopNavContainerRef.current && !desktopSubmenuAnchor) {
        setDesktopSubmenuAnchor(desktopNavContainerRef.current);
      }

      // Xác định hướng animation
      if (activeDesktopNavKey && item.key !== activeDesktopNavKey) {
        const currentIndex = navItems.findIndex(nav => nav.key === item.key);
        const prevIndex = navItems.findIndex(nav => nav.key === activeDesktopNavKey);
        if (currentIndex > prevIndex) {
          setSlideAnimation('slideInFromRightMUI');
        } else {
          setSlideAnimation('slideInFromLeftMUI');
        }
      } else if (!activeDesktopNavKey) { // Mở lần đầu
        setSlideAnimation('slideInFromRightMUI'); // Mặc định trượt từ phải
      } else {
        setSlideAnimation(''); // Cùng một mục, không có animation trượt
      }

      // setPreviousDesktopNavKey(activeDesktopNavKey);
      setActiveDesktopNavKey(item.key);
      setCurrentDesktopSubmenuData(item.subItems);
      setIsDesktopSubmenuOpen(true);
      setAnimationKey(prev => prev + 1); // Thay đổi key để trigger animation nếu nội dung thay đổi
    } else {
      // Nếu mục không có submenu, có thể chọn đóng submenu đang mở hoặc không làm gì
      // Để giữ submenu mở khi di chuột qua mục không có con, không gọi setIsDesktopSubmenuOpen(false) ở đây
      if (isDesktopSubmenuOpen && activeDesktopNavKey !== null) {
        // Vẫn giữ submenu mở, nhưng không có nội dung mới
      }
    }
  };

  const startHideDesktopSubmenuTimer = () => {
    if (popperHideTimeoutRef.current) clearTimeout(popperHideTimeoutRef.current);
    popperHideTimeoutRef.current = setTimeout(() => {
      setIsDesktopSubmenuOpen(false);
    }, 200);
  };

  const clearHideDesktopSubmenuTimer = () => {
    if (popperHideTimeoutRef.current) clearTimeout(popperHideTimeoutRef.current);
  };

  const mobileDrawerList = (
    <Box
      sx={{ width: 280 }} // Đặt chiều rộng cho Drawer
      role="presentation"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          Danh Mục
        </Typography>
        <IconButton onClick={toggleMobileDrawer(false)} aria-label="close drawer">
          <IoMdCloseCircleOutline />
        </IconButton>
      </Box>
      <List component="nav" sx={{ p: 0 }}>
        {navItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isParentSubmenuOpen = openMobileSubmenuKey === item.key;

          return (
            <React.Fragment key={`mobile-drawer-${item.key}`}>
              <ListItemButton
                onClick={() => handleMobileNavItemClick(item.key)}
                sx={{ py: 1.2, px: 2 }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isParentSubmenuOpen ? '700' : '500', // In đậm khi mở
                    fontSize: '0.95rem',
                  }}
                />
                {hasSubItems && (
                  <ExpandMoreIcon
                    sx={{
                      transform: isParentSubmenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: (theme) => theme.transitions.create('transform', {
                        duration: theme.transitions.duration.short,
                      }),
                    }}
                  />
                )}
              </ListItemButton>
              {hasSubItems && (
                <Collapse in={isParentSubmenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                    {item.subItems.map((subCategory, subIndex) => (
                      <Box key={`mobile-subcat-${item.key}-${subIndex}`} sx={{ pt: 1, pb: 0.5 }}>
                        <Typography
                          variant="caption"
                          fontWeight="600"
                          sx={{
                            display: 'block',
                            color: 'text.secondary', // Màu nhạt hơn
                            px: 3.5, // Thụt lề cho tiêu đề nhóm
                            py: 0.5,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem'
                          }}
                        >
                          {subCategory.name}
                        </Typography>
                        <List component="div" disablePadding>
                          {subCategory.children?.map((child: CategoryResponse, textIndex: number) => (
                            <ListItemButton
                              key={`mobile-subitem-${item.key}-${subIndex}-${textIndex}`}
                              sx={{ pl: 3.5, py: 0.8 }} // Thụt lề sâu hơn cho mục con
                              onClick={() => handleMobileSubItemLeafClick(item.key, subCategory.name, child.name)}
                            >
                              <ListItemText
                                primary={child.name}
                                primaryTypographyProps={{ fontSize: '0.875rem', color: 'text.primary' }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Box>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" className="bg-sky-600" sx={{ zIndex: 1201 }}> {/* AppBar cần zIndex cao hơn Popper */}
      <Toolbar>
        {/* Mobile: Nút mở Drawer (Hamburger Icon) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleMobileDrawer(true)}
          sx={{ mr: 2, display: { md: 'none' } }} // Chỉ hiển thị trên màn hình < md
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h6"
          component="div" // Thêm component="div" để tránh warning khi có con là span
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mr: { xs: 1, md: 4 },
            flexGrow: { xs: 1, md: 0 }, // Logo chiếm không gian trên mobile
          }}
        >
          <span>MUJI</span>
          <span style={{ fontSize: '0.75rem', lineHeight: '1' }}>無印良品</span>
        </Typography>

        {/* Navigation Menu (desktop) */}
        <Box
          ref={desktopNavContainerRef}
          sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}
          onMouseLeave={startHideDesktopSubmenuTimer} // Bắt đầu timer khi rời vùng nav cha
        >
          {navItems.map((item) => (
            <Box
              key={item.key}
              sx={{ position: 'relative', mx: 0.5 }} // Giảm mx một chút
              onMouseEnter={(e) => handleDesktopNavItemMouseEnter(e, item)}
            // onMouseLeave không cần ở đây nữa vì được quản lý bởi container và Popper
            >
              <Button
                color="inherit"
                // endIcon={item.subItems && item.subItems.length > 0 ? <ExpandMoreIcon /> : null} // Bỏ icon ở đây để giống yêu cầu hơn
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  py: 2.2, // Tăng padding cho dễ hover
                  px: 1.5,
                  '&::after': { // Gạch chân khi hover
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: '10px', // Điều chỉnh vị trí gạch chân
                    left: '50%',
                    backgroundColor: 'white',
                    transition: 'width 0.3s ease, left 0.3s ease',
                  },
                  '&:hover::after': {
                    width: 'calc(100% - 16px)', // Gạch chân không sát mép
                    left: '8px',
                  },
                }}
              >
                {item.label}
              </Button>
            </Box>
          ))}
        </Box>

        {/* Search Bar and Cart */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}> {/* Thêm ml để không quá sát nav */}
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <IconButton color="inherit" size="small"> {/* Giảm size icon */}
              <SearchIcon />
            </IconButton>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm..." // Ngắn gọn hơn
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)', // Nền mờ hơn
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '0.875rem',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)' },
                width: { sm: '180px', md: '250px' }, // Responsive width
              }}
            />
          </Box>
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* --- Mobile Drawer --- */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer(false)}
        ModalProps={{ keepMounted: true }} // Cải thiện hiệu suất mở trên mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280, // Chiều rộng của Drawer
          },
        }}
      >
        {mobileDrawerList}
      </Drawer>

      {/* --- Desktop Submenu Popper --- */}
      <Popper
        open={isDesktopSubmenuOpen}
        anchorEl={desktopSubmenuAnchor} // Neo vào vùng chứa nav cha
        placement="bottom-start" // Sẽ xổ từ bên trái của vùng nav
        modifiers={[
          { name: 'offset', options: { offset: [0, 1] } }, // Điều chỉnh vị trí
          { name: 'preventOverflow', options: { padding: 0 } }, // Cho phép tràn nếu cần thiết
        ]}
        style={{ zIndex: 1200 }} // Popper phải có zIndex thấp hơn AppBar một chút, hoặc AppBar cao hơn
        onMouseEnter={clearHideDesktopSubmenuTimer} // Hủy timer khi chuột vào Popper
        onMouseLeave={startHideDesktopSubmenuTimer} // Bắt đầu timer khi rời Popper
        transition // Cho phép hiệu ứng Grow
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={250}>
            <Paper
              elevation={6} // Tăng độ nổi khối
              className="custom-submenu-scroll" // Class cho thanh cuộn tùy chỉnh
              sx={{
                width: '100vw', // Chiếm toàn bộ chiều rộng viewport
                // Để Paper bắt đầu từ lề trái của viewport:
                // Cần đảm bảo AppBar hoặc parent của nó không có transform làm thay đổi context của position fixed/absolute.
                // Nếu AppBar là static, và Toolbar là con trực tiếp thì `left: 0` của Popper (so với viewport) là mục tiêu.
                // Cách đơn giản là để Popper tự tính vị trí dựa trên anchorEl và placement.
                // Nếu anchorEl là `desktopNavContainerRef`, `placement="bottom-start"` sẽ căn Popper với bên trái của container đó.
                // Để nó full-width, chúng ta cần điều chỉnh sau khi nó render hoặc set width cố định lớn.
                // Hoặc, neo nó vào AppBar và dùng `width: '100%'`.
                // Giả sử AppBar full width, Popper cũng nên như vậy.
                // left: desktopSubmenuAnchor ? `-${desktopSubmenuAnchor.getBoundingClientRect().left}px` : '0',
                // Nếu AppBar là static, không cần left âm.
                // position: 'relative', // không cần thiết cho popper paper
                minHeight: '250px', // Chiều cao tối thiểu
                maxHeight: { xs: '70vh', md: '500px' }, // Giới hạn chiều cao, responsive
                overflowY: 'auto', // Cho phép cuộn dọc
                overflowX: 'hidden', // Quan trọng: Ngăn thanh cuộn ngang do animation
                // Nền trắng đã có mặc định từ Paper
                // display & flexbox cho nội dung bên trong sẽ nằm ở Box con
              }}
            >
              <Box
                key={animationKey} // Quan trọng: Thay đổi key để React re-render và chạy lại animation
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row', // Các nhóm submenu sẽ xếp ngang
                  flexWrap: 'wrap',     // Cho phép xuống dòng
                  padding: { xs: 1, sm: 2, md: 3 }, // Responsive padding
                  animation: slideAnimation ? `${slideAnimation} 0.35s cubic-bezier(0.25, 0.8, 0.25, 1) forwards` : 'none',
                }}
              >
                {currentDesktopSubmenuData.length > 0 ? (
                  currentDesktopSubmenuData.map((subCategory, index) => (
                    <Box
                      key={`${activeDesktopNavKey}-cat-${index}`} // Key cần duy nhất và thay đổi khi nội dung thay đổi
                      sx={{
                        padding: { xs: 1, sm: 1.5, md: 2 },
                        minWidth: { xs: '150px', sm: '180px', md: '220px' }, // Responsive minWidth
                        flexGrow: 1, // Cho phép các cột co giãn
                        // borderRight: index < currentDesktopSubmenuData.length - 1 ? '1px solid #eee' : 'none', // Ngăn cách giữa các cột
                      }}
                    >
                      <Typography
                        variant="subtitle1" // To hơn một chút
                        fontWeight="600" // Đậm hơn
                        gutterBottom
                        sx={{ color: 'text.primary', mb: 1.5 }} // Màu chữ chính, margin bottom
                      >
                        {subCategory.name}
                      </Typography>
                      {subCategory.children?.map((itemText: CategoryResponse, itemIndex: number) => (
                        <MenuItem
                          key={`${activeDesktopNavKey}-item-${index}-${itemIndex}`}
                          onClick={() => {
                            console.log('Clicked:', itemText, subCategory.name);
                            setIsDesktopSubmenuOpen(false); // Đóng submenu khi click
                          }}
                          sx={{
                            padding: '8px 12px', // Padding tùy chỉnh
                            minHeight: 'auto',
                            borderRadius: '4px', // Bo góc nhẹ
                            '&:hover': {
                              backgroundColor: 'action.hover', // Màu hover của MUI
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}> {/* Màu chữ phụ */}
                            {itemText.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Box>
                  ))
                ) : (
                  isDesktopSubmenuOpen && <Typography sx={{ p: 3, color: 'text.secondary' }}>Không có danh mục con.</Typography>
                )}
              </Box>
            </Paper>
          </Grow>
        )}
      </Popper>
    </AppBar>
  );
};

export default Header;