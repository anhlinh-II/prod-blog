'use client';
import React, { useState, useMemo, memo, useCallback } from 'react';
import { debounce } from 'lodash';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemText,
  Collapse, InputBase, Badge, Popover, Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FiChevronRight } from 'react-icons/fi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCategories } from '@/services';
import { CategoryResponse } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MENU_SLIDE_DURATION = 200;

function flattenCategories(categories: CategoryResponse[], parentPath: string[] = []): { id: number, name: string, slug: string, path: string[] }[] {
  let result: { id: number, name: string, slug: string, path: string[] }[] = [];
  for (const cat of categories) {
    result.push({ id: cat.id, name: cat.name, slug: cat.slug, path: [...parentPath, cat.name] });
    if (cat.children && cat.children.length > 0) {
      result = result.concat(flattenCategories(cat.children, [...parentPath, cat.name]));
    }
  }
  return result;
}

const DesktopCategoryMenu = memo(({
  categories,
  onClose,
  anchorEl,
  open,
  router,
}: {
  categories: CategoryResponse[];
  onClose: () => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  router: ReturnType<typeof useRouter>;
}) => {
  const [hovered, setHovered] = useState<{ cat: CategoryResponse | null, anchor: HTMLElement | null }>({ cat: null, anchor: null });

  const debouncedSetHovered = useMemo(
    () => debounce((newHovered: { cat: CategoryResponse | null, anchor: HTMLElement | null }) => {
      setHovered(newHovered);
    }, 100),
    []
  );

  const handleMouseEnter = useCallback(
    (cat: CategoryResponse, anchor: HTMLElement) => {
      debouncedSetHovered({ cat, anchor });
    },
    [debouncedSetHovered]
  );

  const handleMouseLeave = useCallback(() => {
    debouncedSetHovered({ cat: null, anchor: null });
  }, [debouncedSetHovered]);

  const renderCategory = (cat: CategoryResponse, level = 0) => {
    const hasChildren = cat.children && cat.children.length > 0;
    const isHovered = hovered.cat?.id === cat.id;

    return (
      <li
        key={cat.id}
        style={{ position: 'relative', listStyle: 'none', minWidth: 220, zIndex: 1202 }}
        onMouseEnter={e => {
          if (hasChildren) {
            handleMouseEnter(cat, e.currentTarget);
          }
        }}
      >
        <Link
          href={`/danh-muc/${cat.slug}`}
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            fontWeight: level === 0 ? 600 : 500,
            color: isHovered ? '#d32f2f' : '#222',
            textDecoration: 'none',
            background: isHovered ? 'rgba(0,0,0,0.04)' : 'none',
            cursor: 'pointer',
            minWidth: 200,
            borderRadius: 4,
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
          onMouseDown={e => e.preventDefault()}
        >
          <span>{cat.name}</span>
          {hasChildren && (
            <FiChevronRight
              className="ml-2 text-xl"
              style={{ color: isHovered ? '#d32f2f' : '#888', transition: 'color 0.2s ease' }}
            />
          )}
        </Link>

        {hasChildren && isHovered && (
          <Popover
            id={`submenu-${cat.id}`}
            open={Boolean(hovered.anchor)}
            anchorEl={hovered.anchor}
            onClose={handleMouseLeave}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              sx: {
                minWidth: 220,
                mt: 0,
                ml: -0.5,
                p: 0,
                borderRadius: 2,
                boxShadow: 3,
                zIndex: 1300,
              },
              onMouseEnter: () => {
                handleMouseEnter(cat, hovered.anchor!);
              },
              onMouseLeave: handleMouseLeave
            }}
            disableRestoreFocus
            keepMounted
          >
            <ul style={{ margin: 0, padding: 0 }}>
              {cat.children.map(child => renderCategory(child, level + 1))}
            </ul>
          </Popover>
        )}
      </li>
    );
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: {
          minWidth: 260,
          p: 0,
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 1201,
        },
        onMouseLeave: () => {
          handleMouseLeave();
          onClose();
        }
      }}
      disableRestoreFocus
      keepMounted
    >
      <ul style={{ margin: 0, padding: 0 }}>
        {categories.map(cat => renderCategory(cat, 0))}
      </ul>
    </Popover>
  );
});

export default function Header() {
  const queryClient = useQueryClient();
  const cachedCategories = queryClient.getQueryData<CategoryResponse[]>(['categories']);
  const { data: categories = cachedCategories || [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    initialData: cachedCategories,
  });
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [catMenuAnchor, setCatMenuAnchor] = useState<null | HTMLElement>(null);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [openMobileCat, setOpenMobileCat] = useState<{ [id: number]: boolean }>({});

  const flatCats = flattenCategories(categories);

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);
  const handleMobileCatToggle = (id: number) => {
    setOpenMobileCat((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setSearchFocus(false);
    }
  };

  const renderMobileCategories = (cats: CategoryResponse[], level = 0) => (
    cats.map(cat => (
      <React.Fragment key={cat.id}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ pl: 2 + level * 2 }}
            onClick={() => {
              if (cat.children && cat.children.length > 0) {
                handleMobileCatToggle(cat.id);
              } else {
                setDrawerOpen(false);
                router.push(`/danh-muc/${cat.slug}`);
              }
            }}
          >
            <ListItemText primary={cat.name} />
            {cat.children && cat.children.length > 0 && (
              <ExpandMoreIcon
                sx={{
                  transform: openMobileCat[cat.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        {cat.children && cat.children.length > 0 && (
          <Collapse in={openMobileCat[cat.id]} timeout="auto" unmountOnExit>
            {renderMobileCategories(cat.children, level + 1)}
          </Collapse>
        )}
      </React.Fragment>
    ))
  );

  const searchSuggestions = searchFocus && search.trim()
    ? flatCats.filter(cat => cat.name.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 6)
    : [];

  return (
    <>
      <AppBar position="sticky" color="primary" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ minHeight: 64, px: { xs: 1, md: 3 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: 1,
              mr: 3,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            VShare <span style={{ fontWeight: 400, fontSize: '0.8em' }}>Năng lượng</span>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', flexGrow: 1 }}>
            <Button
              color="inherit"
              sx={{ mx: 1, fontWeight: 500 }}
              component={Link}
              href="/"
            >
              Trang chủ
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1, fontWeight: 500 }}
              onMouseEnter={e => {
                setCatMenuAnchor(e.currentTarget);
                setCatMenuOpen(true);
              }}
              onMouseLeave={() => {
                setCatMenuOpen(false);
              }}
              endIcon={<ExpandMoreIcon />}
              aria-haspopup="true"
              aria-expanded={catMenuOpen ? 'true' : undefined}
            >
              Danh mục
            </Button>
            <DesktopCategoryMenu
              categories={categories}
              onClose={() => setCatMenuOpen(false)}
              anchorEl={catMenuAnchor}
              open={catMenuOpen}
              router={router}
            />
            <Button
              color="inherit"
              sx={{ mx: 1, fontWeight: 500 }}
              component={Link}
              href="/san-pham"
            >
              Sản phẩm
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1, fontWeight: 500 }}
              component={Link}
              href="/bai-viet"
            >
              Bài viết
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1, fontWeight: 500 }}
              component={Link}
              href="/lien-he"
            >
              Liên hệ
            </Button>
          </Box>
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              ml: { xs: 0, md: 2 },
              flexGrow: { xs: 1, md: 0 },
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.12)',
              borderRadius: 2,
              px: 1,
              minWidth: { xs: 0, md: 220 },
              maxWidth: 320,
            }}
          >
            <InputBase
              placeholder="Tìm kiếm danh mục..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
              sx={{
                color: 'white',
                width: '100%',
                fontSize: '0.95rem',
                px: 1,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton type="submit" color="inherit" size="small" sx={{ p: 0.5 }}>
              <SearchIcon />
            </IconButton>
            {searchSuggestions.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '100%',
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  borderRadius: 1,
                  zIndex: 2000,
                  maxHeight: 260,
                  overflowY: 'auto',
                }}
              >
                {searchSuggestions.map(sug => (
                  <ListItemButton
                    key={sug.id}
                    onMouseDown={() => {
                      setSearch('');
                      setSearchFocus(false);
                      router.push(`/danh-muc/${sug.slug}`);
                    }}
                  >
                    {sug.path.join(' > ')}
                  </ListItemButton>
                ))}
              </Box>
            )}
          </Box>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <Badge badgeContent={0} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ '& .MuiDrawer-paper': { width: 260 } }}
      >
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="h6" fontWeight={700} color="primary" mb={1}>
            VShare Năng lượng
          </Typography>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/" onClick={handleDrawerToggle}>
              <ListItemText primary="Trang chủ" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMobileCatToggle(-1)}>
              <ListItemText primary="Danh mục" />
              <ExpandMoreIcon
                sx={{
                  transform: openMobileCat[-1] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </ListItemButton>
          </ListItem>
          <Collapse in={openMobileCat[-1]} timeout="auto" unmountOnExit>
            {renderMobileCategories(categories)}
          </Collapse>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/san-pham" onClick={handleDrawerToggle}>
              <ListItemText primary="Sản phẩm" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/bai-viet" onClick={handleDrawerToggle}>
              <ListItemText primary="Bài viết" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/lien-he" onClick={handleDrawerToggle}>
              <ListItemText primary="Liên hệ" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}