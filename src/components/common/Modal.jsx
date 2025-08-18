import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md',
  fullWidth = true,
  dividers = true
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers={dividers}>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions sx={{ p: 2 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;