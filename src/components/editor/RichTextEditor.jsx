import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Typography,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Chip,
  Alert
} from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatStrikethrough as StrikethroughIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberListIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  FormatAlignJustify as AlignJustifyIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  FormatQuote as QuoteIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatClear as ClearFormatIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Save as SaveIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';

const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  minHeight = 200,
  maxHeight = 500,
  readOnly = false,
  showToolbar = true,
  showWordCount = true,
  showCharCount = true,
  maxLength = null,
  onSave,
  autoSave = false,
  autoSaveInterval = 30000, // 30 seconds
  templates = [],
  mentions = [],
  className
}) => {
  const [content, setContent] = useState(value);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [linkDialog, setLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [templateMenu, setTemplateMenu] = useState(null);
  const [mentionMenu, setMentionMenu] = useState(null);
  const [mentionSearch, setMentionSearch] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const editorRef = useRef(null);
  const autoSaveRef = useRef(null);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      autoSaveRef.current = setTimeout(() => {
        handleSave();
      }, autoSaveInterval);
    }
    
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [content, autoSave, autoSaveInterval, hasUnsavedChanges]);

  // Update content when value prop changes
  useEffect(() => {
    if (value !== content) {
      setContent(value);
      setHasUnsavedChanges(false);
    }
  }, [value]);

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      setHasUnsavedChanges(true);
      onChange?.(newContent);
    }
  };

  const handleSave = () => {
    onSave?.(content);
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const link = document.createElement('a');
        link.href = linkUrl;
        link.textContent = linkText;
        link.target = '_blank';
        range.insertNode(link);
      }
      setLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
      handleContentChange();
    }
  };

  const insertTemplate = (template) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = template.content;
      handleContentChange();
    }
    setTemplateMenu(null);
  };

  const insertMention = (mention) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const mentionSpan = document.createElement('span');
      mentionSpan.className = 'mention';
      mentionSpan.style.backgroundColor = '#e3f2fd';
      mentionSpan.style.padding = '2px 6px';
      mentionSpan.style.borderRadius = '4px';
      mentionSpan.style.color = '#1976d2';
      mentionSpan.textContent = `@${mention.name}`;
      mentionSpan.setAttribute('data-mention-id', mention.id);
      range.insertNode(mentionSpan);
    }
    setMentionMenu(null);
    setMentionSearch('');
    handleContentChange();
  };

  const handleKeyDown = (e) => {
    // Handle mentions
    if (e.key === '@' && mentions.length > 0) {
      setMentionMenu(e.currentTarget);
      setMentionSearch('');
    }
    
    // Handle shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 's':
          e.preventDefault();
          handleSave();
          break;
      }
    }
  };

  const getWordCount = () => {
    const text = editorRef.current?.textContent || '';
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = () => {
    return editorRef.current?.textContent?.length || 0;
  };

  const filteredMentions = mentions.filter(mention =>
    mention.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <Box className={className}>
      <Paper 
        sx={{ 
          border: 1, 
          borderColor: 'divider',
          ...(isFullscreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            borderRadius: 0
          })
        }}
      >
        {showToolbar && !readOnly && (
          <Toolbar 
            variant="dense" 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              flexWrap: 'wrap',
              gap: 0.5
            }}
          >
            {/* Format buttons */}
            <Tooltip title="Đậm (Ctrl+B)">
              <IconButton size="small" onClick={() => execCommand('bold')}>
                <BoldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Nghiêng (Ctrl+I)">
              <IconButton size="small" onClick={() => execCommand('italic')}>
                <ItalicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gạch chân (Ctrl+U)">
              <IconButton size="small" onClick={() => execCommand('underline')}>
                <UnderlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gạch ngang">
              <IconButton size="small" onClick={() => execCommand('strikeThrough')}>
                <StrikethroughIcon />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* List buttons */}
            <Tooltip title="Danh sách dấu đầu dòng">
              <IconButton size="small" onClick={() => execCommand('insertUnorderedList')}>
                <BulletListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Danh sách đánh số">
              <IconButton size="small" onClick={() => execCommand('insertOrderedList')}>
                <NumberListIcon />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Alignment buttons */}
            <Tooltip title="Căn trái">
              <IconButton size="small" onClick={() => execCommand('justifyLeft')}>
                <AlignLeftIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Căn giữa">
              <IconButton size="small" onClick={() => execCommand('justifyCenter')}>
                <AlignCenterIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Căn phải">
              <IconButton size="small" onClick={() => execCommand('justifyRight')}>
                <AlignRightIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Căn đều">
              <IconButton size="small" onClick={() => execCommand('justifyFull')}>
                <AlignJustifyIcon />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Insert buttons */}
            <Tooltip title="Chèn liên kết">
              <IconButton size="small" onClick={() => setLinkDialog(true)}>
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Trích dẫn">
              <IconButton size="small" onClick={() => execCommand('formatBlock', 'blockquote')}>
                <QuoteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Code">
              <IconButton size="small" onClick={() => execCommand('formatBlock', 'pre')}>
                <CodeIcon />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Undo/Redo */}
            <Tooltip title="Hoàn tác">
              <IconButton size="small" onClick={() => execCommand('undo')}>
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Làm lại">
              <IconButton size="small" onClick={() => execCommand('redo')}>
                <RedoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa định dạng">
              <IconButton size="small" onClick={() => execCommand('removeFormat')}>
                <ClearFormatIcon />
              </IconButton>
            </Tooltip>

            <Box sx={{ flex: 1 }} />

            {/* Templates */}
            {templates.length > 0 && (
              <Button
                size="small"
                onClick={(e) => setTemplateMenu(e.currentTarget)}
              >
                Mẫu
              </Button>
            )}

            {/* Action buttons */}
            <Tooltip title="Xem trước">
              <IconButton 
                size="small" 
                onClick={() => setShowPreview(!showPreview)}
                color={showPreview ? 'primary' : 'default'}
              >
                <PreviewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>
              <IconButton 
                size="small" 
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            {onSave && (
              <Tooltip title="Lưu (Ctrl+S)">
                <IconButton 
                  size="small" 
                  onClick={handleSave}
                  color={hasUnsavedChanges ? 'primary' : 'default'}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        )}

        <Box sx={{ position: 'relative' }}>
          {showPreview ? (
            <Box
              sx={{
                p: 2,
                minHeight,
                maxHeight: isFullscreen ? 'calc(100vh - 120px)' : maxHeight,
                overflow: 'auto',
                '& .mention': {
                  backgroundColor: '#e3f2fd',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: '#1976d2'
                }
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <Box
              ref={editorRef}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onInput={handleContentChange}
              onKeyDown={handleKeyDown}
              sx={{
                p: 2,
                minHeight,
                maxHeight: isFullscreen ? 'calc(100vh - 120px)' : maxHeight,
                overflow: 'auto',
                outline: 'none',
                '&:empty::before': {
                  content: `"${placeholder}"`,
                  color: 'text.secondary',
                  fontStyle: 'italic'
                },
                '& .mention': {
                  backgroundColor: '#e3f2fd',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: '#1976d2'
                }
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </Box>

        {/* Status bar */}
        {(showWordCount || showCharCount || lastSaved || hasUnsavedChanges) && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              px: 2, 
              py: 1, 
              borderTop: 1, 
              borderColor: 'divider',
              backgroundColor: 'grey.50'
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              {showWordCount && (
                <Typography variant="caption">
                  Từ: {getWordCount()}
                </Typography>
              )}
              {showCharCount && (
                <Typography variant="caption">
                  Ký tự: {getCharCount()}
                  {maxLength && `/${maxLength}`}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {hasUnsavedChanges && (
                <Chip size="small" label="Chưa lưu" color="warning" />
              )}
              {lastSaved && (
                <Typography variant="caption" color="text.secondary">
                  Đã lưu: {lastSaved.toLocaleTimeString('vi-VN')}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Link Dialog */}
      <Dialog open={linkDialog} onClose={() => setLinkDialog(false)}>
        <DialogTitle>Chèn liên kết</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Văn bản hiển thị"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            margin="normal"
            placeholder="https://example.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialog(false)}>Hủy</Button>
          <Button onClick={insertLink} variant="contained">Chèn</Button>
        </DialogActions>
      </Dialog>

      {/* Template Menu */}
      <Menu
        anchorEl={templateMenu}
        open={Boolean(templateMenu)}
        onClose={() => setTemplateMenu(null)}
      >
        {templates.map((template, index) => (
          <MenuItem key={index} onClick={() => insertTemplate(template)}>
            {template.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Mention Menu */}
      <Menu
        anchorEl={mentionMenu}
        open={Boolean(mentionMenu)}
        onClose={() => setMentionMenu(null)}
      >
        <Box sx={{ p: 1, minWidth: 200 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Tìm kiếm..."
            value={mentionSearch}
            onChange={(e) => setMentionSearch(e.target.value)}
            autoFocus
          />
        </Box>
        {filteredMentions.slice(0, 5).map((mention) => (
          <MenuItem key={mention.id} onClick={() => insertMention(mention)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {mention.avatar && (
                <img 
                  src={mention.avatar} 
                  alt={mention.name}
                  style={{ width: 24, height: 24, borderRadius: '50%' }}
                />
              )}
              <Box>
                <Typography variant="body2">{mention.name}</Typography>
                {mention.role && (
                  <Typography variant="caption" color="text.secondary">
                    {mention.role}
                  </Typography>
                )}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

// Feedback Editor Component
export const FeedbackEditor = ({ 
  onSubmit, 
  initialValue = '', 
  placeholder = 'Nhập phản hồi của bạn...',
  showRating = true,
  showCategories = true,
  categories = ['Kỹ thuật', 'Giao tiếp', 'Thái độ', 'Khác'],
  mentions = []
}) => {
  const [content, setContent] = useState(initialValue);
  const [rating, setRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        content,
        rating: showRating ? rating : null,
        categories: showCategories ? selectedCategories : null,
        timestamp: new Date().toISOString()
      });
      setContent('');
      setRating(0);
      setSelectedCategories([]);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder={placeholder}
        minHeight={150}
        mentions={mentions}
        templates={[
          {
            name: 'Phản hồi tích cực',
            content: '<p>Thực tập sinh đã thể hiện tốt trong:</p><ul><li></li></ul><p>Gợi ý cải thiện:</p><ul><li></li></ul>'
          },
          {
            name: 'Phản hồi cần cải thiện',
            content: '<p>Các điểm cần cải thiện:</p><ul><li></li></ul><p>Hướng dẫn:</p><ul><li></li></ul>'
          }
        ]}
      />
      
      {showRating && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Đánh giá:</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                onClick={() => setRating(star)}
                color={star <= rating ? 'primary' : 'default'}
              >
                ⭐
              </IconButton>
            ))}
          </Box>
        </Box>
      )}

      {showCategories && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Danh mục:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                clickable
                color={selectedCategories.includes(category) ? 'primary' : 'default'}
                onClick={() => {
                  setSelectedCategories(prev =>
                    prev.includes(category)
                      ? prev.filter(c => c !== category)
                      : [...prev, category]
                  );
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
        </Button>
      </Box>
    </Box>
  );
};

export default RichTextEditor;
