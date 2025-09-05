import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton = ({ count = 4 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Chart Skeleton
export const ChartSkeleton = ({ height = 300 }) => (
  <Paper sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Skeleton variant="text" width="30%" height={32} />
      <Skeleton variant="rectangular" width={80} height={32} />
    </Box>
    <Skeleton variant="rectangular" width="100%" height={height} />
  </Paper>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          {Array.from({ length: columns }).map((_, index) => (
            <TableCell key={index}>
              <Skeleton variant="text" width="80%" />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton variant="text" width={colIndex === 0 ? "60%" : "40%"} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// List Skeleton
export const ListSkeleton = ({ items = 5, showAvatar = true, showSecondary = true }) => (
  <List>
    {Array.from({ length: items }).map((_, index) => (
      <ListItem key={index} divider>
        {showAvatar && (
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={<Skeleton variant="text" width="70%" />}
          secondary={showSecondary ? <Skeleton variant="text" width="50%" /> : null}
        />
      </ListItem>
    ))}
  </List>
);

// Card Grid Skeleton
export const CardGridSkeleton = ({ count = 6, columns = { xs: 12, md: 6, lg: 4 } }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item {...columns} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="text" width={120} />
              </Box>
              <Skeleton variant="rectangular" width={60} height={24} />
            </Box>
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Skeleton variant="circular" width={16} height={16} />
              <Skeleton variant="text" width="50%" />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Skeleton variant="rectangular" width={60} height={32} />
              <Skeleton variant="rectangular" width={60} height={32} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Form Skeleton
export const FormSkeleton = ({ fields = 6 }) => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
    <Grid container spacing={2}>
      {Array.from({ length: fields }).map((_, index) => (
        <Grid item xs={12} sm={index % 3 === 0 ? 12 : 6} key={index}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
      ))}
    </Grid>
    <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
      <Skeleton variant="rectangular" width={80} height={36} />
      <Skeleton variant="rectangular" width={100} height={36} />
    </Box>
  </Box>
);

// Calendar Skeleton
export const CalendarSkeleton = () => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="rectangular" width={120} height={36} />
      </Box>
    </Box>
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {Array.from({ length: 7 }).map((_, index) => (
          <Grid item xs key={index}>
            <Skeleton variant="text" width="100%" height={24} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1}>
        {Array.from({ length: 35 }).map((_, index) => (
          <Grid item xs key={index}>
            <Skeleton variant="rectangular" width="100%" height={120} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Box>
);

// Chat Skeleton
export const ChatSkeleton = () => (
  <Box sx={{ display: 'flex', gap: 3, height: '70vh' }}>
    {/* Contacts List */}
    <Paper sx={{ width: 350, p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={40} />
      </Box>
      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
      <List sx={{ maxHeight: 'calc(70vh - 200px)', overflow: 'auto' }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <ListItem key={index} sx={{ borderRadius: 1, mb: 1 }}>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton variant="text" width="70%" />}
              secondary={
                <Box>
                  <Skeleton variant="text" width="50%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="30%" />
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>

    {/* Chat Area */}
    <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={100} height={20} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
              mb: 2
            }}
          >
            <Box sx={{ maxWidth: '70%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width={60} />
              </Box>
              <Skeleton
                variant="rectangular"
                width={index % 3 === 0 ? 200 : index % 2 === 0 ? 150 : 180}
                height={40}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
          <Skeleton variant="rectangular" width="100%" height={80} />
          <Skeleton variant="rectangular" width={80} height={36} />
        </Box>
      </Box>
    </Paper>
  </Box>
);

// Profile Skeleton
export const ProfileSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
        <Skeleton variant="circular" width={120} height={120} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="text" width="30%" height={24} />
          <Skeleton variant="text" width="50%" height={20} />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={100} height={32} />
          </Box>
        </Box>
      </Box>
    </Paper>

    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={24} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
          <List>
            {Array.from({ length: 4 }).map((_, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={<Skeleton variant="text" width="70%" />}
                  secondary={<Skeleton variant="text" width="50%" />}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

// Page Loading Skeleton
export const PageLoadingSkeleton = ({ type = 'dashboard' }) => {
  const skeletons = {
    dashboard: (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={48} sx={{ mb: 3 }} />
        <DashboardStatsSkeleton />
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <ChartSkeleton />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartSkeleton />
          </Grid>
        </Grid>
      </Box>
    ),
    table: (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width="30%" height={48} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
        <TableSkeleton />
      </Box>
    ),
    form: <FormSkeleton />,
    calendar: <CalendarSkeleton />,
    chat: <ChatSkeleton />,
    profile: <ProfileSkeleton />,
    cards: (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width="30%" height={48} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
        <CardGridSkeleton />
      </Box>
    )
  };

  return skeletons[type] || skeletons.dashboard;
};

export default {
  DashboardStatsSkeleton,
  ChartSkeleton,
  TableSkeleton,
  ListSkeleton,
  CardGridSkeleton,
  FormSkeleton,
  CalendarSkeleton,
  ChatSkeleton,
  ProfileSkeleton,
  PageLoadingSkeleton
};
