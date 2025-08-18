import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Rating,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  Assessment, 
  Star, 
  TrendingUp, 
  History, 
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const SkillAssessment = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [dialogMode, setDialogMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Enhanced mock data for skill assessment
  const interns = [
    { 
      id: 9, 
      name: 'Software Dev Intern', 
      department: 'Engineering',
      startDate: '2023-06-01',
      currentSkills: [
        { name: 'ReactJS', level: 3, maxLevel: 5, category: 'Frontend' },
        { name: 'JavaScript', level: 4, maxLevel: 5, category: 'Programming' },
        { name: 'HTML/CSS', level: 5, maxLevel: 5, category: 'Frontend' },
        { name: 'Node.js', level: 2, maxLevel: 5, category: 'Backend' },
        { name: 'Database Design', level: 2, maxLevel: 5, category: 'Database' }
      ],
      targetSkills: [
        { name: 'Redux', priority: 'High', targetLevel: 4 },
        { name: 'TypeScript', priority: 'Medium', targetLevel: 3 },
        { name: 'API Design', priority: 'High', targetLevel: 4 }
      ]
    },
    { 
      id: 13, 
      name: 'UI/UX Design Intern', 
      department: 'Design',
      startDate: '2023-07-01',
      currentSkills: [
        { name: 'Figma', level: 4, maxLevel: 5, category: 'Design Tools' },
        { name: 'Adobe Creative Suite', level: 3, maxLevel: 5, category: 'Design Tools' },
        { name: 'User Research', level: 3, maxLevel: 5, category: 'Research' },
        { name: 'Prototyping', level: 3, maxLevel: 5, category: 'Design Process' },
        { name: 'Typography', level: 4, maxLevel: 5, category: 'Design Principles' }
      ],
      targetSkills: [
        { name: 'User Testing', priority: 'High', targetLevel: 4 },
        { name: 'Design Systems', priority: 'Medium', targetLevel: 3 },
        { name: 'Accessibility', priority: 'Medium', targetLevel: 3 }
      ]
    },
    { 
      id: 10, 
      name: 'Marketing Intern', 
      department: 'Marketing',
      startDate: '2023-06-01',
      currentSkills: [
        { name: 'Social Media', level: 4, maxLevel: 5, category: 'Digital Marketing' },
        { name: 'Content Writing', level: 3, maxLevel: 5, category: 'Content' },
        { name: 'Analytics', level: 3, maxLevel: 5, category: 'Data' },
        { name: 'SEO', level: 2, maxLevel: 5, category: 'Digital Marketing' },
        { name: 'Email Marketing', level: 2, maxLevel: 5, category: 'Digital Marketing' }
      ],
      targetSkills: [
        { name: 'Google Ads', priority: 'High', targetLevel: 4 },
        { name: 'Marketing Automation', priority: 'Medium', targetLevel: 3 },
        { name: 'Brand Strategy', priority: 'Low', targetLevel: 3 }
      ]
    }
  ];

  // Assessment history mock data
  const assessmentHistory = [
    {
      id: 1,
      internId: 9,
      date: '2024-01-15',
      skills: [
        { name: 'ReactJS', level: 3, notes: 'Good understanding of components, needs work on hooks' },
        { name: 'JavaScript', level: 4, notes: 'Strong fundamentals, ready for advanced concepts' }
      ],
      overallRating: 4,
      mentorNotes: 'Intern is progressing well. Focus on Redux next.',
      nextSteps: 'Implement Redux in current project'
    },
    {
      id: 2,
      internId: 9,
      date: '2024-01-08',
      skills: [
        { name: 'ReactJS', level: 2, notes: 'Basic component creation, needs more practice' },
        { name: 'JavaScript', level: 3, notes: 'Good with basic concepts' }
      ],
      overallRating: 3,
      mentorNotes: 'Good progress from last week.',
      nextSteps: 'Continue with React components'
    }
  ];

  useEffect(() => {
    // Load existing assessments
    const existingAssessments = {};
    interns.forEach(intern => {
      intern.currentSkills.forEach(skill => {
        existingAssessments[`${intern.id}-${skill.name}`] = skill.level;
      });
    });
    setAssessments(existingAssessments);
  }, []);

  const handleAssessmentChange = (internId, skillName, newLevel) => {
    setAssessments(prev => ({
      ...prev,
      [`${internId}-${skillName}`]: newLevel
    }));
  };

  const handleOpenDialog = (mode, intern = null) => {
    setDialogMode(mode);
    setSelectedIntern(intern);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIntern(null);
  };

  const handleSubmitAssessment = (internId) => {
    const internAssessments = Object.keys(assessments)
      .filter(key => key.startsWith(`${internId}-`))
      .map(key => ({
        skill: key.split('-')[1],
        level: assessments[key]
      }));
    
    // Assessment data loaded successfully
    
    // Simulate saving assessment
    const newAssessment = {
      id: Date.now(),
      internId,
      date: new Date().toISOString().split('T')[0],
      skills: internAssessments,
      overallRating: Math.round(internAssessments.reduce((sum, skill) => sum + skill.level, 0) / internAssessments.length),
      mentorNotes: 'Assessment completed',
      nextSteps: 'Continue skill development'
    };
    
    showSnackbar('Đánh giá đã được lưu thành công!', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getSkillColor = (level, maxLevel) => {
    const percentage = (level / maxLevel) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const getInternById = (id) => interns.find(intern => intern.id === id);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Assessment color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4">Đánh giá kỹ năng thực tập sinh</Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {interns.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thực tập sinh
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {interns.reduce((sum, intern) => 
                  sum + intern.currentSkills.filter(skill => skill.level >= 4).length, 0
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kỹ năng tốt (≥4/5)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {interns.reduce((sum, intern) => 
                  sum + intern.currentSkills.filter(skill => skill.level <= 2).length, 0
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cần cải thiện (≤2/5)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {interns.reduce((sum, intern) => sum + intern.targetSkills.length, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mục tiêu phát triển
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Interns Assessment */}
      <Grid container spacing={3}>
        {interns.map((intern) => (
          <Grid item xs={12} key={intern.id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h5">{intern.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {intern.department} • Bắt đầu: {intern.startDate}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    icon={<TrendingUp />} 
                    label="Đang thực tập" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Tooltip title="Xem lịch sử đánh giá">
                    <IconButton
                      onClick={() => handleOpenDialog('history', intern)}
                      color="primary"
                    >
                      <History />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Current Skills Assessment */}
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Đánh giá kỹ năng hiện tại
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {intern.currentSkills.map((skill) => (
                  <Grid item xs={12} md={6} key={skill.name}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box>
                            <Typography variant="h6">{skill.name}</Typography>
                            <Chip 
                              label={skill.category} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Box>
                          <Rating
                            value={assessments[`${intern.id}-${skill.name}`] || skill.level}
                            max={skill.maxLevel}
                            onChange={(event, newValue) => {
                              handleAssessmentChange(intern.id, skill.name, newValue);
                            }}
                            icon={<Star color="primary" />}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={((assessments[`${intern.id}-${skill.name}`] || skill.level) / skill.maxLevel) * 100}
                            color={getSkillColor(assessments[`${intern.id}-${skill.name}`] || skill.level, skill.maxLevel)}
                            sx={{ flex: 1 }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {assessments[`${intern.id}-${skill.name}`] || skill.level}/{skill.maxLevel}
                          </Typography>
                        </Box>

                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Ghi chú về kỹ năng này..."
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Target Skills */}
              <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                Mục tiêu phát triển
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {intern.targetSkills.map((targetSkill) => (
                  <Grid item xs={12} md={4} key={targetSkill.name}>
                    <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {targetSkill.name}
                          </Typography>
                          <Chip 
                            label={targetSkill.priority} 
                            color={getPriorityColor(targetSkill.priority)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Mục tiêu: {targetSkill.targetLevel}/5
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Ưu tiên: {targetSkill.priority}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Overall Assessment */}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Nhận xét tổng quan về thực tập sinh..."
                  label="Nhận xét tổng quan"
                />
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Lần đánh giá cuối: {assessmentHistory
                    .filter(h => h.internId === intern.id)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date || 'Chưa có'}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleSubmitAssessment(intern.id)}
                  startIcon={<Assessment />}
                >
                  Lưu đánh giá
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Assessment History Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Lịch sử đánh giá - {selectedIntern?.name}
        </DialogTitle>
        <DialogContent>
          <AssessmentHistory intern={selectedIntern} history={assessmentHistory} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Assessment History Component
const AssessmentHistory = ({ intern, history }) => {
  if (!intern) return null;

  const internHistory = history.filter(h => h.internId === intern.id);

  return (
    <Box sx={{ pt: 2 }}>
      {internHistory.length === 0 ? (
        <Alert severity="info">Chưa có lịch sử đánh giá cho thực tập sinh này.</Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell><strong>Ngày</strong></TableCell>
                <TableCell><strong>Kỹ năng đánh giá</strong></TableCell>
                <TableCell><strong>Đánh giá tổng thể</strong></TableCell>
                <TableCell><strong>Ghi chú</strong></TableCell>
                <TableCell><strong>Bước tiếp theo</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {internHistory.map((assessment) => (
                <TableRow key={assessment.id} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {assessment.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {assessment.skills.map((skill, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {skill.name}:
                          </Typography>
                          <Rating
                            value={skill.level}
                            max={5}
                            size="small"
                            readOnly
                            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          />
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={assessment.overallRating}
                        max={5}
                        size="small"
                        readOnly
                        icon={<Star color="primary" />}
                      />
                      <Typography variant="body2">
                        ({assessment.overallRating}/5)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {assessment.mentorNotes}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {assessment.nextSteps}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SkillAssessment;
