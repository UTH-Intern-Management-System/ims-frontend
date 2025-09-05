import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Fab,
  Zoom,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Collapse,
  Card,
  CardContent,
  Grid,
  Hidden,
  Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Mobile Navigation Drawer
export const MobileDrawer = ({ 
  open, 
  onClose, 
  children, 
  anchor = 'left',
  width = 280 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) return null;

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box'
        }
      }}
    >
      {children}
    </Drawer>
  );
};

// Mobile App Bar with hamburger menu
export const MobileAppBar = ({ 
  title, 
  onMenuClick, 
  actions = [],
  showBackButton = false,
  onBackClick 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        display: { xs: 'block', md: isMobile ? 'block' : 'none' },
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        {showBackButton ? (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onBackClick}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        
        {actions.map((action, index) => (
          <IconButton
            key={index}
            color="inherit"
            onClick={action.onClick}
            title={action.title}
          >
            {action.icon}
          </IconButton>
        ))}
      </Toolbar>
    </AppBar>
  );
};

// Responsive Card Grid
export const ResponsiveCardGrid = ({ 
  children, 
  spacing = 2,
  breakpoints = { xs: 12, sm: 6, md: 4, lg: 3 }
}) => (
  <Grid container spacing={spacing}>
    {React.Children.map(children, (child, index) => (
      <Grid item {...breakpoints} key={index}>
        {child}
      </Grid>
    ))}
  </Grid>
);

// Mobile Floating Action Button
export const MobileFAB = ({ 
  actions = [], 
  mainAction,
  position = { bottom: 16, right: 16 }
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) return null;

  if (actions.length === 0 && mainAction) {
    return (
      <Zoom in={true}>
        <Fab
          color="primary"
          onClick={mainAction.onClick}
          sx={{ position: 'fixed', ...position }}
        >
          {mainAction.icon}
        </Fab>
      </Zoom>
    );
  }

  return (
    <SpeedDial
      ariaLabel="Mobile Actions"
      sx={{ position: 'fixed', ...position }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};

// Collapsible Section for mobile
export const CollapsibleSection = ({ 
  title, 
  children, 
  defaultExpanded = false,
  icon 
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) {
    return <Box>{children}</Box>;
  }

  return (
    <Card sx={{ mb: 1 }}>
      <CardContent 
        sx={{ 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </CardContent>
      <Collapse in={expanded}>
        <CardContent sx={{ pt: 0 }}>
          {children}
        </CardContent>
      </Collapse>
    </Card>
  );
};

// Mobile-optimized Table
export const MobileTable = ({ 
  data = [], 
  columns = [], 
  renderMobileCard,
  onRowClick 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) {
    return null; // Use regular table on desktop
  }

  return (
    <Stack spacing={1}>
      {data.map((row, index) => (
        <Card 
          key={index}
          sx={{ 
            cursor: onRowClick ? 'pointer' : 'default',
            '&:hover': onRowClick ? { bgcolor: 'action.hover' } : {}
          }}
          onClick={() => onRowClick?.(row)}
        >
          <CardContent sx={{ py: 2 }}>
            {renderMobileCard ? renderMobileCard(row, index) : (
              <Box>
                {columns.map((column, colIndex) => (
                  <Box key={colIndex} sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {column.label}
                    </Typography>
                    <Typography variant="body2">
                      {row[column.key]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

// Responsive Layout Container
export const ResponsiveContainer = ({ 
  children, 
  maxWidth = 'lg',
  padding = { xs: 1, sm: 2, md: 3 }
}) => (
  <Box
    sx={{
      maxWidth,
      mx: 'auto',
      px: padding,
      width: '100%'
    }}
  >
    {children}
  </Box>
);

// Mobile Bottom Navigation
export const MobileBottomNav = ({ 
  items = [], 
  value, 
  onChange 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        zIndex: theme.zIndex.appBar
      }}
    >
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 1,
            cursor: 'pointer',
            color: value === item.value ? 'primary.main' : 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
          onClick={() => onChange?.(item.value)}
        >
          {item.icon}
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Responsive Stack (changes direction on mobile)
export const ResponsiveStack = ({ 
  children, 
  spacing = 2,
  direction = { xs: 'column', md: 'row' },
  ...props 
}) => (
  <Stack 
    direction={direction}
    spacing={spacing}
    {...props}
  >
    {children}
  </Stack>
);

// Mobile-friendly Form Layout
export const MobileFormLayout = ({ children, spacing = 2 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={spacing}>
      {React.Children.map(children, (child, index) => {
        if (!child) return null;
        
        const childProps = child.props || {};
        const gridProps = childProps.gridProps || {};
        
        return (
          <Grid 
            item 
            xs={12} 
            sm={isMobile ? 12 : (gridProps.sm || 6)}
            md={gridProps.md || 6}
            lg={gridProps.lg || 4}
            key={index}
            {...gridProps}
          >
            {child}
          </Grid>
        );
      })}
    </Grid>
  );
};

// Hide/Show components based on screen size
export const HideOnMobile = ({ children }) => (
  <Hidden smDown>{children}</Hidden>
);

export const ShowOnMobile = ({ children }) => (
  <Hidden smUp>{children}</Hidden>
);

// Responsive Typography
export const ResponsiveTypography = ({ 
  variant, 
  mobileVariant, 
  children, 
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Typography 
      variant={isMobile && mobileVariant ? mobileVariant : variant}
      {...props}
    >
      {children}
    </Typography>
  );
};

// Mobile Swipe Actions
export const SwipeActions = ({ 
  children, 
  leftActions = [], 
  rightActions = [],
  onSwipe 
}) => {
  const [startX, setStartX] = React.useState(0);
  const [currentX, setCurrentX] = React.useState(0);
  const [isSwipping, setIsSwipping] = React.useState(false);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsSwipping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwipping) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isSwipping) return;
    
    const diff = startX - currentX;
    const threshold = 100;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && rightActions.length > 0) {
        // Swipe left - show right actions
        onSwipe?.('right', rightActions[0]);
      } else if (diff < 0 && leftActions.length > 0) {
        // Swipe right - show left actions
        onSwipe?.('left', leftActions[0]);
      }
    }

    setIsSwipping(false);
    setCurrentX(0);
    setStartX(0);
  };

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {children}
    </Box>
  );
};

// Custom hooks for responsive behavior
export const useResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};

export const useMobileNavigation = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isMobile } = useResponsive();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return {
    mobileOpen,
    handleDrawerToggle,
    handleDrawerClose,
    isMobile
  };
};

export default {
  MobileDrawer,
  MobileAppBar,
  ResponsiveCardGrid,
  MobileFAB,
  CollapsibleSection,
  MobileTable,
  ResponsiveContainer,
  MobileBottomNav,
  ResponsiveStack,
  MobileFormLayout,
  HideOnMobile,
  ShowOnMobile,
  ResponsiveTypography,
  SwipeActions,
  useResponsive,
  useMobileNavigation
};
