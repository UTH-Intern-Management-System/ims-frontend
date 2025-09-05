import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CloudUpload,
  AttachFile,
  Delete,
  InsertDriveFile,
  Image,
  PictureAsPdf,
  Description,
  VideoFile,
  AudioFile,
  Archive,
  Preview,
  Download
} from '@mui/icons-material';

const FileUpload = ({
  multiple = false,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  onFilesChange,
  disabled = false,
  showPreview = true,
  allowedTypes = [],
  label = 'Tải lên tệp'
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const getFileIcon = (file) => {
    const type = file.type;
    const extension = file.name.split('.').pop().toLowerCase();

    if (type.startsWith('image/')) return <Image color="primary" />;
    if (type === 'application/pdf') return <PictureAsPdf color="error" />;
    if (type.startsWith('video/')) return <VideoFile color="secondary" />;
    if (type.startsWith('audio/')) return <AudioFile color="info" />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return <Archive color="warning" />;
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return <Description color="primary" />;
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    // Check if file exists and has size property
    if (!file || typeof file.size === 'undefined') {
      return `Tệp không hợp lệ`;
    }
    
    // Check file size
    if (file.size > maxSize) {
      return `Tệp "${file.name}" quá lớn. Kích thước tối đa: ${formatFileSize(maxSize)}`;
    }

    // Check allowed types
    if (allowedTypes.length > 0) {
      const extension = file.name.split('.').pop().toLowerCase();
      const mimeType = file.type;
      
      const isAllowed = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return extension === type.substring(1);
        }
        return mimeType.includes(type);
      });

      if (!isAllowed) {
        return `Loại tệp "${extension}" không được hỗ trợ. Các loại được phép: ${allowedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const processFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList);
    
    // Check max files limit
    if (!multiple && newFiles.length > 1) {
      setError('Chỉ được chọn một tệp');
      return;
    }

    if (files.length + newFiles.length > maxFiles) {
      setError(`Tối đa ${maxFiles} tệp được phép`);
      return;
    }

    // Validate each file
    const validFiles = [];
    const errors = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        // Add unique ID and preview URL for images
        const fileWithId = {
          ...file,
          id: Date.now() + Math.random(),
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        };
        validFiles.push(fileWithId);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setError('');
    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(updatedFiles);
    
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  }, [files, multiple, maxFiles, maxSize, allowedTypes, onFilesChange]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  }, [disabled, processFiles]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const simulateUpload = async (file) => {
    setUploading(true);
    setUploadProgress(prev => ({ ...prev, [file.id]: 0 }));

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(prev => ({ ...prev, [file.id]: progress }));
    }

    setUploading(false);
  };

  const handleUploadAll = async () => {
    for (const file of files) {
      await simulateUpload(file);
    }
  };

  return (
    <Box>
      {/* Drop Zone */}
      <Paper
        sx={{
          border: 2,
          borderStyle: 'dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          bgcolor: dragActive ? 'primary.light' : 'background.paper',
          p: 4,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: disabled ? 'grey.300' : 'primary.main',
            bgcolor: disabled ? 'background.paper' : 'primary.light'
          }
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CloudUpload 
          sx={{ 
            fontSize: 48, 
            color: dragActive ? 'primary.main' : 'grey.400',
            mb: 2 
          }} 
        />
        <Typography variant="h6" gutterBottom>
          {dragActive ? 'Thả tệp vào đây' : label}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Kéo thả tệp hoặc nhấp để chọn
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {multiple ? `Tối đa ${maxFiles} tệp` : 'Chỉ một tệp'} • 
          Kích thước tối đa: {formatFileSize(maxSize)}
        </Typography>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={disabled}
        />
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Tệp đã chọn ({files.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setFiles([])}
              >
                Xóa tất cả
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleUploadAll}
                disabled={uploading}
              >
                Tải lên tất cả
              </Button>
            </Box>
          </Box>

          <List>
            {files.map((file) => (
              <ListItem key={file.id} divider>
                <ListItemIcon>
                  {getFileIcon(file)}
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={
                    <Box>
                      <Typography variant="caption">
                        {file.size ? formatFileSize(file.size) : 'Unknown size'} • {file.type || 'Unknown type'}
                      </Typography>
                      {uploadProgress[file.id] !== undefined && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={uploadProgress[file.id]} 
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {uploadProgress[file.id]}% hoàn thành
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {showPreview && (file.type.startsWith('image/') || file.type === 'application/pdf') && (
                      <IconButton
                        size="small"
                        onClick={() => handlePreview(file)}
                        title="Xem trước"
                      >
                        <Preview />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => {
                        const url = URL.createObjectURL(file);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = file.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      title="Tải xuống"
                    >
                      <Download />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFile(file.id)}
                      title="Xóa"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Xem trước: {previewFile?.name}
        </DialogTitle>
        <DialogContent>
          {previewFile && (
            <Box sx={{ textAlign: 'center' }}>
              {previewFile.type.startsWith('image/') ? (
                <img
                  src={previewFile.preview || URL.createObjectURL(previewFile)}
                  alt={previewFile.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '500px',
                    objectFit: 'contain'
                  }}
                />
              ) : previewFile.type === 'application/pdf' ? (
                <embed
                  src={URL.createObjectURL(previewFile)}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                />
              ) : (
                <Typography>
                  Không thể xem trước loại tệp này
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Specialized components for different use cases
export const ImageUpload = (props) => (
  <FileUpload
    {...props}
    accept="image/*"
    allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
    label="Tải lên hình ảnh"
  />
);

export const DocumentUpload = (props) => (
  <FileUpload
    {...props}
    accept=".pdf,.doc,.docx,.txt,.rtf"
    allowedTypes={['.pdf', '.doc', '.docx', '.txt', '.rtf']}
    label="Tải lên tài liệu"
  />
);

export const ResumeUpload = (props) => (
  <FileUpload
    {...props}
    accept=".pdf,.doc,.docx"
    allowedTypes={['.pdf', '.doc', '.docx']}
    multiple={false}
    maxSize={5 * 1024 * 1024} // 5MB
    label="Tải lên CV"
  />
);

export default FileUpload;
