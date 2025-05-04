'use client';
import { useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const navItems = [
  {
    label: 'Hàng Mới',
    subItems: [],
  },
  {
    label: 'Bán Chạy',
    subItems: [],
  },
  {
    label: 'Quần Áo',
    subItems: [
      { label: 'Áo', subItems: ['Áo thun', 'Áo sơ mi'] },
      { label: 'Quần', subItems: ['Quần jeans', 'Quần kaki'] },
    ],
  },
  {
    label: 'Sức Khỏe & Làm Đẹp',
    subItems: [
      { label: 'Chăm sóc da', subItems: ['Kem dưỡng', 'Sữa rửa mặt'] },
      { label: 'Mỹ phẩm', subItems: ['Son môi', 'Phấn nền'] },
    ],
  },
  {
    label: 'Gia Dụng',
    subItems: [
      { label: 'Đồ bếp', subItems: ['Nồi', 'Chảo'] },
      { label: 'Đồ gia dụng', subItems: ['Quạt', 'Bàn ủi'] },
    ],
  },
  {
    label: 'Thực Phẩm',
    subItems: [
      { label: 'Đồ ăn nhẹ', subItems: ['Bánh', 'Snack'] },
      { label: 'Đồ uống', subItems: ['Nước ngọt', 'Trà'] },
    ],
  },
];

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElSub, setAnchorElSub] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setMenuOpen(false);
  };

  const handleOpenSubMenu = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorElSub((prev) => ({ ...prev, [index]: event.currentTarget }));
  };

  const handleCloseSubMenu = (index: number) => {
    setAnchorElSub((prev) => ({ ...prev, [index]: null }));
  };

  return (
    <AppBar position="static" className="bg-sky-600">
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" sx={{ display: 'flex', flexDirection: 'column', mr: 4 }}>
          <span>MUJI</span>
          <span style={{ fontSize: '0.75rem', lineHeight: '1' }}>無印良品</span>
        </Typography>

        {/* Hamburger Menu (mobile) */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={handleOpenNavMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {navItems.map((item, i) => (
              <Box key={i}>
                {item.subItems.length > 0 ? (
                  <>
                    <MenuItem onClick={(e) => handleOpenSubMenu(e, i)}>
                      <ListItemText primary={item.label} />
                      <ExpandMoreIcon />
                    </MenuItem>
                    <Menu
                      anchorEl={anchorElSub[i]}
                      open={Boolean(anchorElSub[i])}
                      onClose={() => handleCloseSubMenu(i)}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      TransitionProps={{ timeout: 300 }}
                    >
                      {item.subItems.map((sub, j) => (
                        <Box key={j}>
                          {sub.subItems.length > 0 ? (
                            <Menu
                              anchorEl={anchorElSub[`${i}-${j}`]}
                              open={Boolean(anchorElSub[`${i}-${j}`])}
                              onClose={() => handleCloseSubMenu(`${i}-${j}` as any)}
                              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                              TransitionProps={{ timeout: 300 }}
                            >
                              {sub.subItems.map((subsub, k) => (
                                <MenuItem key={k} onClick={handleCloseNavMenu}>
                                  {subsub}
                                </MenuItem>
                              ))}
                            </Menu>
                          ) : (
                            <MenuItem onClick={handleCloseNavMenu}>{sub.label}</MenuItem>
                          )}
                        </Box>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <MenuItem onClick={handleCloseNavMenu}>{item.label}</MenuItem>
                )}
              </Box>
            ))}
          </Menu>
        </Box>

        {/* Navigation Menu (desktop) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
          {navItems.map((item, i) => (
            <Box key={i} sx={{ position: 'relative', mx: 1 }}>
              <Button
                color="inherit"
                onMouseEnter={(e) => item.subItems.length > 0 && handleOpenSubMenu(e, i)}
                onMouseLeave={() => handleCloseSubMenu(i)}
                endIcon={item.subItems.length > 0 ? <ExpandMoreIcon /> : null}
                sx={{
                  textTransform: 'none',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: '-4px',
                    left: '50%',
                    backgroundColor: 'white',
                    transition: 'width 0.3s ease, left 0.3s ease',
                  },
                  '&:hover::after': {
                    width: '100%',
                    left: '0',
                  },
                }}
              >
                {item.label}
              </Button>
              {item.subItems.length > 0 && (
                <Menu
                  anchorEl={anchorElSub[i]}
                  open={Boolean(anchorElSub[i])}
                  onClose={() => handleCloseSubMenu(i)}
                  onMouseEnter={(e) => handleOpenSubMenu(e, i)}
                  onMouseLeave={() => handleCloseSubMenu(i)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  TransitionProps={{ timeout: 300 }}
                  sx={{
                    '& .MuiPaper-root': {
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                      opacity: Boolean(anchorElSub[i]) ? 1 : 0,
                      transform: Boolean(anchorElSub[i]) ? 'scaleY(1)' : 'scaleY(0)',
                      transformOrigin: 'top',
                    },
                  }}
                >
                  {item.subItems.map((sub, j) => (
                    <Box key={j}>
                      {sub.subItems.length > 0 ? (
                        <>
                          <MenuItem
                            onMouseEnter={(e) => handleOpenSubMenu(e, `${i}-${j}` as any)}
                            onMouseLeave={() => handleCloseSubMenu(`${i}-${j}` as any)}
                          >
                            <ListItemText primary={sub.label} />
                            <ListItemIcon sx={{ minWidth: '24px' }}>
                              <ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />
                            </ListItemIcon>
                          </MenuItem>
                          <Menu
                            anchorEl={anchorElSub[`${i}-${j}`]}
                            open={Boolean(anchorElSub[`${i}-${j}`])}
                            onClose={() => handleCloseSubMenu(`${i}-${j}` as any)}
                            onMouseEnter={(e) => handleOpenSubMenu(e, `${i}-${j}` as any)}
                            onMouseLeave={() => handleCloseSubMenu(`${i}-${j}` as any)}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            TransitionProps={{ timeout: 300 }}
                            sx={{
                              '& .MuiPaper-root': {
                                transition: 'opacity 0.3s ease, transform 0.3s ease',
                                opacity: Boolean(anchorElSub[`${i}-${j}`]) ? 1 : 0,
                                transform: Boolean(anchorElSub[`${i}-${j}`]) ? 'scaleY(1)' : 'scaleY(0)',
                                transformOrigin: 'top',
                              },
                            }}
                          >
                            {sub.subItems.map((subsub, k) => (
                              <MenuItem key={k} onClick={() => handleCloseSubMenu(i)}>
                                {subsub}
                              </MenuItem>
                            ))}
                          </Menu>
                        </>
                      ) : (
                        <MenuItem onClick={() => handleCloseSubMenu(i)}>{sub.label}</MenuItem>
                      )}
                    </Box>
                  ))}
                </Menu>
              )}
            </Box>
          ))}
        </Box>

        {/* Search Bar and Cart */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Bạn đang muốn tìm kiếm gì?"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': { borderRadius: '4px' },
              }}
            />
            <IconButton type="submit" color="inherit">
              <SearchIcon />
            </IconButton>
          </Box>
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;