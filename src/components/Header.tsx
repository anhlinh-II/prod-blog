'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Popper } from '@mui/material';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Button,
  Box,
  Menu, // Quan trọng cho dropdown
  MenuItem, // Quan trọng cho các mục trong dropdown
  Paper,  // Có thể dùng để tùy chỉnh giao diện Menu
  Slide,  // Cho hiệu ứng
  List, // Không bắt buộc nếu dùng Menu/MenuItem trực tiếp
  ListItemButton, // Tương tự List
  ListItemText, // Thêm để fix lỗi không tìm thấy ListItemText
  Collapse, // Dùng cho mobile
  Drawer,   // Dùng cho mobile
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Cho button cha trên header
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // Cho mục menu có con
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { CategoryResponse } from '@/types'; // Đảm bảo type này đúng
import { fetchCategories } from '@/services';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

const MENU_HIDE_DELAY = 300; // Thời gian trễ (ms)

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  // State quản lý các menu đang mở và anchor của chúng
  // key: một ID duy nhất cho menu (ví dụ: navItem.key hoặc category.id)
  // value: HTMLElement dùng để neo menu
  const [openMenuAnchors, setOpenMenuAnchors] = useState<Record<string, HTMLElement | null>>({});
  const menuTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Cleanup timers khi component unmount
  useEffect(() => {
    const currentTimers = menuTimers.current;
    return () => {
      Object.values(currentTimers).forEach(clearTimeout);
    };
  }, []);

  const navItems = [
    {
      label: 'Hàng Mới',
      key: 'new-arrivals',
      subItems: [
        {
          id: 1,
          name: 'Quần Áo Mới',
          slug: 'quan-ao-moi',
          description: '',
          parentCategoryName: null,
          parentId: 0,
          children: [
            { id: 11, name: 'Áo Mới', slug: 'ao-moi', description: '', parentCategoryName: 'Quần Áo Mới', parentId: 1, children: [] },
            { id: 12, name: 'Quần Mới', slug: 'quan-moi', description: '', parentCategoryName: 'Quần Áo Mới', parentId: 1, children: [] }
          ]
        },
        {
          id: 2,
          name: 'Giày Dép Mới',
          slug: 'giay-dep-moi',
          description: '',
          parentCategoryName: null,
          parentId: 0,
          children: []
        }
      ] as CategoryResponse[],
    },
    {
      label: 'Bán Chạy',
      key: 'best-sellers',
      subItems: [] as CategoryResponse[],
    },
    {
      label: 'Danh mục sản phẩm',
      key: 'product-categories',
      subItems: categories,
    },
  ];

  // Hàm mở menu
  const handleOpenMenu = (key: string, anchorEl: HTMLElement, parentKey?: string) => {
    if (menuTimers.current[key]) clearTimeout(menuTimers.current[key]);
    if (parentKey && menuTimers.current[parentKey]) clearTimeout(menuTimers.current[parentKey]);


    // Đóng các menu "anh em" ở cùng cấp và các menu con của chúng
    const newAnchors: Record<string, HTMLElement | null> = {};
    if (parentKey) { // Nếu là submenu
      // Giữ lại các menu cha và menu hiện tại/anh em của menu cha
      Object.keys(openMenuAnchors).forEach(openKey => {
        if (!openKey.startsWith(parentKey + "_") || openKey.startsWith(parentKey + "_" + key.split('_').slice(-2, -1)[0])) { // Giữ menu cha và anh em của menu cha
          if (openKey === parentKey || !openMenuAnchors[openKey]?.id.startsWith(parentKey + "_")) {
            newAnchors[openKey] = openMenuAnchors[openKey];
          }
        }
      });
    } else { // Nếu là menu cấp 1 từ header
      // Đóng tất cả các menu cấp 1 khác
    }


    setOpenMenuAnchors(prev => {
      const updatedAnchors = { ...prev };
      // Tìm các key con của parentKey nhưng không phải là con của key hiện tại (để đóng các nhánh khác)
      if (parentKey) {
        const prefixCurrentSubmenu = parentKey + "_" + key.substring(parentKey.length + 1).split('_')[0];
        Object.keys(prev).forEach(k => {
          if (k.startsWith(parentKey + "_") && !k.startsWith(prefixCurrentSubmenu)) {
            delete updatedAnchors[k];
          }
        });
      } else { // Đang mở menu cấp 1 từ header, đóng các menu cấp 1 khác
        Object.keys(prev).forEach(k => {
          if (k !== key && !k.includes("_child_")) delete updatedAnchors[k];
        });
      }
      updatedAnchors[key] = anchorEl;
      return updatedAnchors;
    });
  };

  // Hàm chuẩn bị đóng menu (sau một khoảng trễ)
  const handleCloseMenuIntent = (key: string, isSubmenu: boolean = false) => {
    if (menuTimers.current[key]) clearTimeout(menuTimers.current[key]);
    menuTimers.current[key] = setTimeout(() => {
      setOpenMenuAnchors(prev => {
        const newState = { ...prev };
        // Đóng menu này và tất cả các menu con của nó
        Object.keys(newState).forEach(openKey => {
          if (openKey === key || openKey.startsWith(key + "_child_")) {
            delete newState[openKey];
          }
        });
        return newState;
      });
    }, MENU_HIDE_DELAY);
  };

  // Hủy ý định đóng menu (khi chuột vào lại menu hoặc menu con)
  const cancelCloseMenuIntent = (key: string) => {
    if (menuTimers.current[key]) {
      clearTimeout(menuTimers.current[key]);
    }
  };

  // Component đệ quy cho các mục menu (desktop)
  const RecursiveMenuItem: React.FC<{ category: CategoryResponse; parentKey: string }> = ({ category, parentKey }) => {
    const subMenuKey = `${parentKey}_child_${category.id}`;
    const hasChildren = category.children && category.children.length > 0;
    const menuItemRef = useRef<HTMLLIElement>(null);

    const handleOpenSubMenu = () => {
      if (menuItemRef.current) {
        handleOpenMenu(subMenuKey, menuItemRef.current, parentKey);
      } else {
        console.warn(`menuItemRef is null for subMenuKey: ${subMenuKey}`);
      }
    };

    return (
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => {
          cancelCloseMenuIntent(parentKey);
          if (hasChildren) handleOpenSubMenu();
        }}
        onMouseLeave={() => {
          if (hasChildren) handleCloseMenuIntent(subMenuKey, true);
        }}
      >
        {/* Move the ref to MenuItem */}
        <MenuItem
          ref={menuItemRef}
          onClick={() => {
            router.push(`/danh-muc/${category.slug}`);
            setOpenMenuAnchors({});
          }}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            minWidth: 180,
            padding: '8px 16px',
          }}
        >
          {category.name}
          {hasChildren && <ChevronRightIcon fontSize="small" />}
        </MenuItem>
        {hasChildren && (
          <Popper
            open={Boolean(openMenuAnchors[subMenuKey])}
            anchorEl={openMenuAnchors[subMenuKey]}
            placement="right-start"
            disablePortal={false}
            modifiers={[
              { name: 'offset', options: { offset: [0, 8] } },
              { name: 'preventOverflow', options: { boundariesElement: 'viewport' } },
              { name: 'flip', options: { enabled: true } },
            ]}
            sx={{
              zIndex: 1300,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                minWidth: 180,
                bgcolor: 'background.paper',
                borderRadius: 1,
                overflow: 'hidden',
              }}
              onMouseEnter={() => cancelCloseMenuIntent(subMenuKey)}
              onMouseLeave={() => handleCloseMenuIntent(subMenuKey, true)}
            >
              {category.children!.map(child => (
                <RecursiveMenuItem
                  key={child.id}
                  category={child}
                  parentKey={subMenuKey}
                />
              ))}
            </Paper>
          </Popper>
        )}
      </div>
    );
  };

  // --- Mobile Drawer --- (recursive version)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  // Change to array to support multiple open submenus at different levels
  const [openMobileSubmenuKeys, setOpenMobileSubmenuKeys] = useState<string[]>([]);

  const toggleMobileDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setMobileDrawerOpen(open);
    if (!open) {
      setOpenMobileSubmenuKeys([]);
    }
  };

  const handleMobileCategoryClick = (key: string, parentKey: string | null = null) => {
    setOpenMobileSubmenuKeys(prev => {
      // If already open, close this and all children
      if (prev.includes(key)) {
        return prev.filter(k => k !== key && !k.startsWith(key + '_'));
      }
      // If parentKey is null, it's a root menu, so only open this root
      if (!parentKey) {
        return [key];
      }
      // Otherwise, keep all ancestors and open this submenu
      const parentKeys = prev.filter(k => key.startsWith(k));
      return [...parentKeys, key];
    });
  };

  const handleMobileLeafClick = (categoryPath: string[]) => {
    console.log('Mobile Navigating to:', categoryPath.join(' > '));
    setMobileDrawerOpen(false);
    setOpenMobileSubmenuKeys([]);
  };

  // Recursive component for mobile categories
  const MobileRecursiveCategory: React.FC<{
    category: CategoryResponse;
    categoryPath: string[];
    parentKey: string;
  }> = ({ category, categoryPath, parentKey }) => {
    const hasChildren = category.children && category.children.length > 0;
    const thisKey = parentKey + '_' + category.id;
    const isOpen = openMobileSubmenuKeys.includes(thisKey);

    return (
      <>
        <ListItemButton
          onClick={() => {
            if (hasChildren) {
              handleMobileCategoryClick(thisKey, parentKey);
            } else {
              router.push(`/danh-muc/${category.slug}`);
              setMobileDrawerOpen(false);
              setOpenMobileSubmenuKeys([]);
            }
          }}
          sx={{ pl: categoryPath.length * 2, py: 1 }}
        >
          <ListItemText
            primary={category.name}
            primaryTypographyProps={{
              fontWeight: isOpen ? '700' : '500',
              fontSize: '0.95rem'
            }}
          />
          {hasChildren && (
            <ExpandMoreIcon
              sx={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: (theme) => theme.transitions.create('transform', { duration: theme.transitions.duration.short })
              }}
            />
          )}
        </ListItemButton>
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.children.map(child => (
                <MobileRecursiveCategory
                  key={child.id}
                  category={child}
                  categoryPath={[...categoryPath, category.name]}
                  parentKey={thisKey}
                />
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

  const mobileDrawerList = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>Danh Mục</Typography>
        <IconButton onClick={toggleMobileDrawer(false)} aria-label="close drawer">
          <IoMdCloseCircleOutline />
        </IconButton>
      </Box>
      <List component="nav" sx={{ p: 0 }}>
        {navItems.map((item) => (
          <React.Fragment key={`mobile-drawer-${item.key}`}>
            <ListItemButton
              onClick={() => {
                if (item.subItems && item.subItems.length > 0) {
                  handleMobileCategoryClick(item.key, null);
                } else {
                  handleMobileLeafClick([item.label]);
                }
              }}
              sx={{ py: 1.2, px: 2 }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: openMobileSubmenuKeys.includes(item.key) ? '700' : '500',
                  fontSize: '0.95rem'
                }}
              />
              {item.subItems && item.subItems.length > 0 && (
                <ExpandMoreIcon
                  sx={{
                    transform: openMobileSubmenuKeys.includes(item.key) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: (theme) => theme.transitions.create('transform', { duration: theme.transitions.duration.short })
                  }}
                />
              )}
            </ListItemButton>
            {item.subItems && item.subItems.length > 0 && (
              <Collapse in={openMobileSubmenuKeys.includes(item.key)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subCategory) => (
                    <MobileRecursiveCategory
                      key={subCategory.id}
                      category={subCategory}
                      categoryPath={[item.label]}
                      parentKey={item.key}
                    />
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  return (
    <AppBar position="static" className="bg-sky-600" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleMobileDrawer(true)} sx={{ mr: 2, display: { md: 'none' } }} >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ display: 'flex', flexDirection: 'column', mr: { xs: 1, md: 4 }, flexGrow: { xs: 1, md: 0 } }}>
          <span>MUJI</span>
          <span style={{ fontSize: '0.75rem', lineHeight: '1' }}>無印良品</span>
        </Typography>

        {/* Navigation Menu (desktop) */}

        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
          {navItems.map((item) => {
            const menuKey = item.key;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const buttonRef = useRef<HTMLButtonElement>(null);

            return (
              <Box
                key={menuKey}
                onMouseEnter={(event) => {
                  if (hasSubItems) {
                    handleOpenMenu(menuKey, event.currentTarget as HTMLElement);
                  }
                  Object.keys(openMenuAnchors).forEach(k => {
                    if (k !== menuKey && !k.includes("_child_")) {
                      if (menuTimers.current[k]) clearTimeout(menuTimers.current[k]);
                      setOpenMenuAnchors(prev => {
                        const newState = { ...prev };
                        delete newState[k];
                        Object.keys(newState).forEach(openSubKey => {
                          if (openSubKey.startsWith(k + "_child_")) {
                            delete newState[openSubKey];
                          }
                        });
                        return newState;
                      });
                    }
                  });
                }}
                onMouseLeave={() => {
                  if (hasSubItems) {
                    handleCloseMenuIntent(menuKey);
                  }
                }}
                sx={{ position: 'relative' }}
              >
                <Button
                  ref={buttonRef}
                  color="inherit"
                  aria-haspopup="true"
                  aria-expanded={Boolean(openMenuAnchors[menuKey])}
                  endIcon={hasSubItems ? <ExpandMoreIcon /> : null}
                  sx={{
                    textTransform: 'none', fontWeight: 'bold', py: 2.2, px: 1.5,
                    '&::after': { content: '""', position: 'absolute', width: '0%', height: '2px', bottom: '10px', left: '50%', backgroundColor: 'white', transition: 'width 0.3s ease, left 0.3s ease', },
                    '&:hover::after': { width: 'calc(100% - 16px)', left: '8px', },
                  }}
                  onClick={() => {
                    if (hasSubItems && buttonRef.current) {
                      handleOpenMenu(menuKey, buttonRef.current);
                    }
                  }}
                >
                  {item.label}
                </Button>
                {hasSubItems && (
                  <Popper
                    open={Boolean(openMenuAnchors[menuKey])}
                    anchorEl={openMenuAnchors[menuKey]}
                    placement="bottom-start"
                    disablePortal={false}
                    modifiers={[
                      { name: 'offset', options: { offset: [0, 8] } },
                      { name: 'preventOverflow', options: { boundariesElement: 'viewport' } },
                      { name: 'flip', options: { enabled: true } },
                    ]}
                    sx={{ zIndex: 1300 }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        minWidth: 180,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                      onMouseEnter={() => cancelCloseMenuIntent(menuKey)}
                      onMouseLeave={() => handleCloseMenuIntent(menuKey)}
                    >
                      {item.subItems.map(category => (
                        <RecursiveMenuItem
                          key={category.id}
                          category={category}
                          parentKey={menuKey}
                        />
                      ))}
                    </Paper>
                  </Popper>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Search Bar and Cart */}
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <IconButton type="submit" color="inherit" size="small" aria-label="search"> <SearchIcon /> </IconButton>
          <TextField variant="outlined" placeholder="Tìm kiếm..." size="small" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '4px', '& .MuiOutlinedInput-root': { borderRadius: '4px', color: 'white', fontSize: '0.875rem', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }, '&.Mui-focused fieldset': { borderColor: 'white' }, }, '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)' }, width: { sm: '180px', md: '250px' }, }}
          />
        </Box>
        <IconButton color="inherit" aria-label="shopping cart"> <ShoppingCartIcon /> </IconButton>
      </Toolbar>

      {/* --- Mobile Drawer --- */}
      <Drawer anchor="left" open={mobileDrawerOpen} onClose={toggleMobileDrawer(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 } }}>
        {mobileDrawerList}
      </Drawer>
    </AppBar>
  );
};

export default Header;