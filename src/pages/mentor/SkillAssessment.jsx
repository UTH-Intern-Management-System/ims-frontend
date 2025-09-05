import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Rating,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  Design as DesignIcon,
  Business as BusinessIcon,
  Science as ScienceIcon,
  Language as LanguageIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  Target as TargetIcon,
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Group,
  School,
  TrendingUp,
  Assessment
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid } from 'recharts';

const SkillAssessment = () => {
  const [interns, setInterns] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'NA',
      department: 'Engineering',
      skills: [
        {
          id: 1,
          name: 'ReactJS',
          category: 'Frontend',
          currentLevel: 4,
          previousLevel: 3,
          targetLevel: 5,
          progress: 80,
          assessment: {
            technical: 4,
            problemSolving: 4,
            communication: 3,
            teamwork: 4,
            learning: 5
          },
          feedback: 'Excellent progress in React Hooks. Needs more practice with state management.',
          goals: 'Master advanced patterns by next month',
          lastAssessment: '2024-01-15',
          nextAssessment: '2024-02-15'
        },
        {
          id: 2,
          name: 'JavaScript',
          category: 'Programming',
          currentLevel: 4.5,
          previousLevel: 4,
          targetLevel: 5,
          progress: 90,
          assessment: {
            technical: 4.5,
            problemSolving: 5,
            communication: 4,
            teamwork: 4,
            learning: 5
          },
          feedback: 'Strong fundamentals. Ready for advanced concepts.',
          goals: 'Expert level by end of internship',
          lastAssessment: '2024-01-15',
          nextAssessment: '2024-02-15'
        }
      ]
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'TB',
      department: 'Marketing',
      skills: [
        {
          id: 3,
          name: 'Digital Marketing',
          category: 'Marketing',
          currentLevel: 3.5,
          previousLevel: 3,
          targetLevel: 4,
          progress: 70,
          assessment: {
            technical: 3.5,
            problemSolving: 3,
            communication: 4.5,
            teamwork: 4,
            learning: 4
          },
          feedback: 'Great communication skills. Needs more analytical thinking.',
          goals: 'Improve data analysis skills',
          lastAssessment: '2024-01-10',
          nextAssessment: '2024-02-10'
        }
      ]
    }
  ]);

  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [openAssessmentDialog, setOpenAssessmentDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [assessmentData, setAssessmentData] = useState({
    technical: 3,
    problemSolving: 3,
    communication: 3,
    teamwork: 3,
    learning: 3,
    feedback: '',
    goals: '',
    nextAssessment: ''
  });

  const assessmentCriteria = [
    { key: 'technical', label: 'Kỹ thuật', description: 'Khả năng thực hiện kỹ thuật' },
    { key: 'problemSolving', label: 'Giải quyết vấn đề', description: 'Khả năng phân tích và giải quyết' },
    { key: 'communication', label: 'Giao tiếp', description: 'Khả năng truyền đạt ý tưởng' },
    { key: 'teamwork', label: 'Làm việc nhóm', description: 'Khả năng hợp tác với team' },
    { key: 'learning', label: 'Học tập', description: 'Khả năng tiếp thu kiến thức mới' }
  ];

  const handleOpenAssessment = (intern, skill) => {
    setSelectedIntern(intern);
    setSelectedSkill(skill);
    setAssessmentData({
      technical: skill.assessment.technical,
      problemSolving: skill.assessment.problemSolving,
      communication: skill.assessment.communication,
      teamwork: skill.assessment.teamwork,
      learning: skill.assessment.learning,
      feedback: skill.feedback,
      goals: skill.goals,
      nextAssessment: skill.nextAssessment
    });
    setOpenAssessmentDialog(true);
  };

  const handleOpenFeedback = (intern, skill) => {
    setSelectedIntern(intern);
    setSelectedSkill(skill);
    setOpenFeedbackDialog(true);
  };

  const handleSaveAssessment = () => {
    if (!selectedIntern || !selectedSkill) return;

    const updatedInterns = interns.map(intern => {
      if (intern.id === selectedIntern.id) {
        const updatedSkills = intern.skills.map(skill => {
          if (skill.id === selectedSkill.id) {
            const newLevel = Math.round(
              (assessmentData.technical + assessmentData.problemSolving + 
               assessmentData.communication + assessmentData.teamwork + 
               assessmentData.learning) / 5
            );
            
            return {
              ...skill,
              previousLevel: skill.currentLevel,
              currentLevel: newLevel,
              progress: Math.round((newLevel / skill.targetLevel) * 100),
              assessment: {
                technical: assessmentData.technical,
                problemSolving: assessmentData.problemSolving,
                communication: assessmentData.communication,
                teamwork: assessmentData.teamwork,
                learning: assessmentData.learning
              },
              feedback: assessmentData.feedback,
              goals: assessmentData.goals,
              lastAssessment: new Date().toISOString().split('T')[0],
              nextAssessment: assessmentData.nextAssessment
            };
          }
          return skill;
        });

        return { ...intern, skills: updatedSkills };
      }
      return intern;
    });

    setInterns(updatedInterns);
    setOpenAssessmentDialog(false);
    showSnackbar('Đánh giá đã được lưu thành công', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderInternsOverview = () => {
    const totalInterns = interns.length;
    const totalSkills = interns.reduce((sum, intern) => sum + intern.skills.length, 0);
    const averageProgress = interns.reduce((sum, intern) => {
      const internProgress = intern.skills.reduce((skillSum, skill) => skillSum + skill.progress, 0);
      return sum + (internProgress / intern.skills.length);
    }, 0) / totalInterns;

    const chartData = interns.map(intern => ({
      name: intern.name,
      progress: intern.skills.reduce((sum, skill) => sum + skill.progress, 0) / intern.skills.length
    }));

    return (
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Group />
                </Avatar>
                <Box>
                  <Typography variant="h4">{totalInterns}</Typography>
                  <Typography variant="body2" color="textSecondary">Tổng thực tập sinh</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h4">{totalSkills}</Typography>
                  <Typography variant="body2" color="textSecondary">Tổng kỹ năng</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4">{Math.round(averageProgress)}%</Typography>
                  <Typography variant="body2" color="textSecondary">Tiến độ trung bình</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Assessment />
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {interns.reduce((sum, intern) => 
                      sum + intern.skills.filter(s => 
                        new Date(s.nextAssessment) <= new Date()
                      ).length, 0
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Cần đánh giá</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Tiến độ thực tập sinh</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderInternsList = () => {
    return (
      <Grid container spacing={3}>
        {interns.map(intern => (
          <Grid item xs={12} key={intern.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{intern.avatar}</Avatar>
                  <Box>
                    <Typography variant="h6">{intern.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {intern.department}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  {intern.skills.map(skill => (
                    <Grid item xs={12} md={6} key={skill.id}>
                      <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {skill.name}
                          </Typography>
                          <Chip 
                            label={`${skill.currentLevel}/5`} 
                            color="primary" 
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          {skill.category}
                        </Typography>

                        {/* Progress Bar */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Tiến độ</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {skill.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={skill.progress}
                            color="success"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>

                        {/* Assessment Summary */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="bold" gutterBottom>
                            Đánh giá:
                          </Typography>
                          <Grid container spacing={1}>
                            {Object.entries(skill.assessment).map(([key, value]) => (
                              <Grid item xs={6} key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption">
                                    {assessmentCriteria.find(c => c.key === key)?.label}:
                                  </Typography>
                                  <Rating value={value} max={5} size="small" readOnly />
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<AssessmentIcon />}
                            onClick={() => handleOpenAssessment(intern, skill)}
                          >
                            Đánh giá
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenFeedback(intern, skill)}
                          >
                            Phản hồi
                          </Button>
                        </Box>

                        {/* Assessment Info */}
                        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                          <Typography variant="caption" color="textSecondary">
                            Đánh giá cuối: {skill.lastAssessment} | 
                            Tiếp theo: {skill.nextAssessment}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderAssessmentHistory = () => {
    const allAssessments = interns.flatMap(intern => 
      intern.skills.map(skill => ({
        intern: intern.name,
        skill: skill.name,
        previousLevel: skill.previousLevel,
        currentLevel: skill.currentLevel,
        progress: skill.progress,
        lastAssessment: skill.lastAssessment,
        feedback: skill.feedback
      }))
    );

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Lịch sử đánh giá</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thực tập sinh</TableCell>
                  <TableCell>Kỹ năng</TableCell>
                  <TableCell>Mức độ trước</TableCell>
                  <TableCell>Mức độ hiện tại</TableCell>
                  <TableCell>Tiến độ</TableCell>
                  <TableCell>Ngày đánh giá</TableCell>
                  <TableCell>Phản hồi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allAssessments.map((assessment, index) => (
                  <TableRow key={index}>
                    <TableCell>{assessment.intern}</TableCell>
                    <TableCell>{assessment.skill}</TableCell>
                    <TableCell>
                      <Rating value={assessment.previousLevel} max={5} size="small" readOnly />
                    </TableCell>
                    <TableCell>
                      <Rating value={assessment.currentLevel} max={5} size="small" readOnly />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={assessment.progress}
                          sx={{ width: 60, height: 6 }}
                        />
                        <Typography variant="body2">{assessment.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{assessment.lastAssessment}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {assessment.feedback}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Đánh giá kỹ năng thực tập sinh</Typography>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<TimelineIcon />} label="Tổng quan" />
          <Tab icon={<GroupIcon />} label="Danh sách thực tập sinh" />
          <Tab icon={<AssessmentIcon />} label="Lịch sử đánh giá" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderInternsOverview()}
      {activeTab === 1 && renderInternsList()}
      {activeTab === 2 && renderAssessmentHistory()}

      {/* Assessment Dialog */}
      <Dialog open={openAssessmentDialog} onClose={() => setOpenAssessmentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Đánh giá kỹ năng: {selectedSkill?.name} - {selectedIntern?.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {assessmentCriteria.map(criteria => (
              <Grid item xs={12} md={6} key={criteria.key}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {criteria.label}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                    {criteria.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating
                      value={assessmentData[criteria.key]}
                      onChange={(event, newValue) => {
                        setAssessmentData({ ...assessmentData, [criteria.key]: newValue });
                      }}
                      max={5}
                    />
                    <Typography variant="body2">
                      ({assessmentData[criteria.key]}/5)
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phản hồi chi tiết"
                multiline
                rows={4}
                value={assessmentData.feedback}
                onChange={(e) => setAssessmentData({ ...assessmentData, feedback: e.target.value })}
                placeholder="Nhận xét về tiến độ và hướng phát triển..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mục tiêu tiếp theo"
                value={assessmentData.goals}
                onChange={(e) => setAssessmentData({ ...assessmentData, goals: e.target.value })}
                placeholder="Đặt mục tiêu cho kỳ đánh giá tiếp theo..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ngày đánh giá tiếp theo"
                type="date"
                value={assessmentData.nextAssessment}
                onChange={(e) => setAssessmentData({ ...assessmentData, nextAssessment: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssessmentDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveAssessment} variant="contained" startIcon={<SaveIcon />}>
            Lưu đánh giá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={openFeedbackDialog} onClose={() => setOpenFeedbackDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Phản hồi: {selectedSkill?.name} - {selectedIntern?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Phản hồi hiện tại:</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            {selectedSkill?.feedback || 'Chưa có phản hồi'}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Mục tiêu hiện tại:</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            {selectedSkill?.goals || 'Chưa có mục tiêu'}
          </Typography>
          
          <TextField
            fullWidth
            label="Thêm phản hồi mới"
            multiline
            rows={4}
            placeholder="Nhập phản hồi mới..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedbackDialog(false)}>Đóng</Button>
          <Button variant="contained" startIcon={<SendIcon />}>
            Gửi phản hồi
          </Button>
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

export default SkillAssessment;
