import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Typography,
  Collapse,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  DatePicker,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Badge,
  Tooltip,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Save as SaveIcon,
  BookmarkBorder as BookmarkIcon,
  History as HistoryIcon,
  Tune as TuneIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const AdvancedSearch = ({
  onSearch,
  onFiltersChange,
  searchFields = [],
  filterOptions = {},
  initialFilters = {},
  placeholder = 'Tìm kiếm...',
  showSaveSearch = true,
  savedSearches = [],
  onSaveSearch,
  onLoadSearch,
  searchHistory = [],
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [saveMenuAnchor, setSaveMenuAnchor] = useState(null);
  const [historyMenuAnchor, setHistoryMenuAnchor] = useState(null);

  // Count active filters
  useEffect(() => {
    const count = Object.values(filters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== null && v !== '');
      }
      return value !== null && value !== undefined && value !== '';
    }).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleSearch = useCallback(() => {
    const searchData = {
      query: searchQuery,
      filters: filters
    };
    onSearch?.(searchData);
  }, [searchQuery, filters, onSearch]);

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    onFiltersChange?.({});
    onSearch?.({ query: '', filters: {} });
  };

  const clearFilter = (filterKey) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveSearch = (name) => {
    const searchData = {
      name,
      query: searchQuery,
      filters: filters,
      timestamp: new Date().toISOString()
    };
    onSaveSearch?.(searchData);
    setSaveMenuAnchor(null);
  };

  const handleLoadSearch = (search) => {
    setSearchQuery(search.query || '');
    setFilters(search.filters || {});
    setHistoryMenuAnchor(null);
    onSearch?.({ query: search.query || '', filters: search.filters || {} });
  };

  const renderFilterField = (field) => {
    const { key, type, label, options, min, max, step, multiple } = field;
    const value = filters[key];

    switch (type) {
      case 'select':
        return (
          <FormControl fullWidth key={key}>
            <InputLabel>{label}</InputLabel>
            <Select
              value={value || (multiple ? [] : '')}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              multiple={multiple}
              label={label}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'autocomplete':
        return (
          <Autocomplete
            key={key}
            multiple={multiple}
            options={options || []}
            getOptionLabel={(option) => option.label || option}
            value={value || (multiple ? [] : null)}
            onChange={(_, newValue) => handleFilterChange(key, newValue)}
            renderInput={(params) => (
              <TextField {...params} label={label} fullWidth />
            )}
          />
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs} key={key}>
            <MuiDatePicker
              label={label}
              value={value ? dayjs(value) : null}
              onChange={(newValue) => 
                handleFilterChange(key, newValue ? newValue.toISOString() : null)
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        );

      case 'dateRange':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs} key={key}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MuiDatePicker
                  label={`${label} từ`}
                  value={value?.from ? dayjs(value.from) : null}
                  onChange={(newValue) => 
                    handleFilterChange(key, {
                      ...value,
                      from: newValue ? newValue.toISOString() : null
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiDatePicker
                  label={`${label} đến`}
                  value={value?.to ? dayjs(value.to) : null}
                  onChange={(newValue) => 
                    handleFilterChange(key, {
                      ...value,
                      to: newValue ? newValue.toISOString() : null
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        );

      case 'range':
        return (
          <Box key={key}>
            <Typography gutterBottom>{label}</Typography>
            <Slider
              value={value || [min || 0, max || 100]}
              onChange={(_, newValue) => handleFilterChange(key, newValue)}
              valueLabelDisplay="auto"
              min={min || 0}
              max={max || 100}
              step={step || 1}
              marks
            />
          </Box>
        );

      case 'boolean':
        return (
          <FormControlLabel
            key={key}
            control={
              <Switch
                checked={value || false}
                onChange={(e) => handleFilterChange(key, e.target.checked)}
              />
            }
            label={label}
          />
        );

      case 'text':
      default:
        return (
          <TextField
            key={key}
            label={label}
            value={value || ''}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            fullWidth
          />
        );
    }
  };

  const renderActiveFilters = () => {
    const activeFilters = Object.entries(filters).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== null && v !== '');
      }
      return value !== null && value !== undefined && value !== '';
    });

    if (activeFilters.length === 0) return null;

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        {activeFilters.map(([key, value]) => {
          const field = searchFields.find(f => f.key === key);
          const label = field?.label || key;
          
          let displayValue = value;
          if (Array.isArray(value)) {
            displayValue = value.map(v => v.label || v).join(', ');
          } else if (typeof value === 'object' && value !== null) {
            if (value.from || value.to) {
              displayValue = `${value.from ? dayjs(value.from).format('DD/MM/YYYY') : '...'} - ${value.to ? dayjs(value.to).format('DD/MM/YYYY') : '...'}`;
            }
          }

          return (
            <Chip
              key={key}
              label={`${label}: ${displayValue}`}
              onDelete={() => clearFilter(key)}
              size="small"
              color="primary"
              variant="outlined"
            />
          );
        })}
        <Chip
          label="Xóa tất cả"
          onClick={clearAllFilters}
          size="small"
          color="error"
          variant="outlined"
          icon={<ClearIcon />}
        />
      </Box>
    );
  };

  return (
    <Paper className={className} sx={{ p: 2 }}>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            endAdornment: searchQuery && (
              <IconButton size="small" onClick={() => setSearchQuery('')}>
                <ClearIcon />
              </IconButton>
            )
          }}
        />
        
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{ minWidth: 120 }}
        >
          Tìm kiếm
        </Button>

        <Badge badgeContent={activeFiltersCount} color="primary">
          <IconButton
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            color={filtersExpanded ? 'primary' : 'default'}
          >
            <FilterIcon />
          </IconButton>
        </Badge>

        {showSaveSearch && (
          <>
            <Tooltip title="Lưu tìm kiếm">
              <IconButton onClick={(e) => setSaveMenuAnchor(e.currentTarget)}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Lịch sử tìm kiếm">
              <IconButton onClick={(e) => setHistoryMenuAnchor(e.currentTarget)}>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>

      {/* Active Filters */}
      {renderActiveFilters()}

      {/* Advanced Filters */}
      <Collapse in={filtersExpanded}>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TuneIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6">Bộ lọc nâng cao</Typography>
          <Box sx={{ flex: 1 }} />
          <Button
            size="small"
            onClick={clearAllFilters}
            startIcon={<ClearIcon />}
          >
            Xóa tất cả
          </Button>
        </Box>

        <Grid container spacing={2}>
          {searchFields.map((field, index) => (
            <Grid item xs={12} sm={6} md={4} key={field.key}>
              {renderFilterField(field)}
            </Grid>
          ))}
        </Grid>
      </Collapse>

      {/* Save Search Menu */}
      <Menu
        anchorEl={saveMenuAnchor}
        open={Boolean(saveMenuAnchor)}
        onClose={() => setSaveMenuAnchor(null)}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle2" gutterBottom>
            Lưu tìm kiếm
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Tên tìm kiếm..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleSaveSearch(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
        </Box>
      </Menu>

      {/* History Menu */}
      <Menu
        anchorEl={historyMenuAnchor}
        open={Boolean(historyMenuAnchor)}
        onClose={() => setHistoryMenuAnchor(null)}
        PaperProps={{ sx: { maxHeight: 300, minWidth: 300 } }}
      >
        <MenuList>
          {savedSearches.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Tìm kiếm đã lưu
              </Typography>
              {savedSearches.map((search, index) => (
                <MenuItemComponent
                  key={index}
                  onClick={() => handleLoadSearch(search)}
                >
                  <ListItemIcon>
                    <BookmarkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={search.name}
                    secondary={`${search.query || 'Không có từ khóa'} • ${dayjs(search.timestamp).format('DD/MM/YYYY')}`}
                  />
                </MenuItemComponent>
              ))}
              <Divider />
            </>
          )}
          
          {searchHistory.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Lịch sử tìm kiếm
              </Typography>
              {searchHistory.slice(0, 5).map((search, index) => (
                <MenuItemComponent
                  key={index}
                  onClick={() => handleLoadSearch(search)}
                >
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={search.query || 'Tìm kiếm trống'}
                    secondary={dayjs(search.timestamp).format('DD/MM/YYYY HH:mm')}
                  />
                </MenuItemComponent>
              ))}
            </>
          )}
          
          {savedSearches.length === 0 && searchHistory.length === 0 && (
            <Typography variant="body2" sx={{ px: 2, py: 3, color: 'text.secondary', textAlign: 'center' }}>
              Chưa có lịch sử tìm kiếm
            </Typography>
          )}
        </MenuList>
      </Menu>
    </Paper>
  );
};

// Predefined search configurations for different entities
export const InternSearchConfig = {
  searchFields: [
    { key: 'status', type: 'select', label: 'Trạng thái', options: [
      { value: 'Active', label: 'Đang hoạt động' },
      { value: 'Completed', label: 'Hoàn thành' },
      { value: 'Pending', label: 'Chờ xử lý' }
    ]},
    { key: 'department', type: 'autocomplete', label: 'Phòng ban', multiple: true, options: [
      { label: 'IT', value: 'IT' },
      { label: 'HR', value: 'HR' },
      { label: 'Marketing', value: 'Marketing' }
    ]},
    { key: 'startDate', type: 'dateRange', label: 'Ngày bắt đầu' },
    { key: 'gpa', type: 'range', label: 'GPA', min: 0, max: 4, step: 0.1 },
    { key: 'hasCV', type: 'boolean', label: 'Có CV' }
  ]
};

export const TaskSearchConfig = {
  searchFields: [
    { key: 'priority', type: 'select', label: 'Độ ưu tiên', options: [
      { value: 'High', label: 'Cao' },
      { value: 'Medium', label: 'Trung bình' },
      { value: 'Low', label: 'Thấp' }
    ]},
    { key: 'status', type: 'select', label: 'Trạng thái', options: [
      { value: 'Todo', label: 'Chưa làm' },
      { value: 'In Progress', label: 'Đang làm' },
      { value: 'Completed', label: 'Hoàn thành' }
    ]},
    { key: 'assignee', type: 'autocomplete', label: 'Người thực hiện', multiple: true },
    { key: 'dueDate', type: 'dateRange', label: 'Hạn hoàn thành' },
    { key: 'isOverdue', type: 'boolean', label: 'Quá hạn' }
  ]
};

export default AdvancedSearch;
