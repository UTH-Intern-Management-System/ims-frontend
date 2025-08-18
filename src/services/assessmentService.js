import { mockAssessments, mockDailyProgress, mockUsers } from '../mocks/data';

const assessmentService = {
  // Performance Assessments
  getAllAssessments: () => Promise.resolve({ data: mockAssessments }),
  
  getAssessmentById: (id) => Promise.resolve({
    data: mockAssessments.find(assessment => assessment.id === id)
  }),
  
  getAssessmentsByIntern: (internId) => Promise.resolve({
    data: mockAssessments.filter(assessment => assessment.internId === internId)
  }),
  
  getAssessmentsByMentor: (mentorId) => Promise.resolve({
    data: mockAssessments.filter(assessment => assessment.mentorId === mentorId)
  }),
  
  createAssessment: (assessmentData) => {
    const newAssessment = {
      ...assessmentData,
      id: Math.max(...mockAssessments.map(a => a.id)) + 1,
      assessmentDate: new Date().toISOString().split('T')[0]
    };
    mockAssessments.push(newAssessment);
    return Promise.resolve({ data: newAssessment });
  },
  
  updateAssessment: (id, updatedData) => {
    const index = mockAssessments.findIndex(assessment => assessment.id === id);
    if (index > -1) {
      mockAssessments[index] = { ...mockAssessments[index], ...updatedData };
      return Promise.resolve({ data: mockAssessments[index] });
    }
    return Promise.reject(new Error("Assessment not found"));
  },
  
  deleteAssessment: (id) => {
    const initialLength = mockAssessments.length;
    const filtered = mockAssessments.filter(assessment => assessment.id !== id);
    if (filtered.length < initialLength) {
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Assessment not found"));
  },

  // Daily Progress Tracking
  getAllDailyProgress: () => Promise.resolve({ data: mockDailyProgress }),
  
  getDailyProgressByIntern: (internId) => Promise.resolve({
    data: mockDailyProgress.filter(progress => progress.internId === internId)
  }),
  
  getDailyProgressByDate: (date) => Promise.resolve({
    data: mockDailyProgress.filter(progress => progress.date === date)
  }),
  
  logDailyProgress: (progressData) => {
    const newProgress = {
      ...progressData,
      id: Math.max(...mockDailyProgress.map(p => p.id)) + 1,
      date: new Date().toISOString().split('T')[0]
    };
    mockDailyProgress.push(newProgress);
    return Promise.resolve({ data: newProgress });
  },
  
  updateDailyProgress: (id, updatedData) => {
    const index = mockDailyProgress.findIndex(progress => progress.id === id);
    if (index > -1) {
      mockDailyProgress[index] = { ...mockDailyProgress[index], ...updatedData };
      return Promise.resolve({ data: mockDailyProgress[index] });
    }
    return Promise.reject(new Error("Daily progress not found"));
  },
  
  deleteDailyProgress: (id) => {
    const initialLength = mockDailyProgress.length;
    const filtered = mockDailyProgress.filter(progress => progress.id !== id);
    if (filtered.length < initialLength) {
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Daily progress not found"));
  },

  // Skill Assessment
  assessSkill: (internId, skillName, score, notes) => {
    const assessment = mockAssessments.find(a => a.internId === internId);
    if (assessment) {
      if (!assessment.technicalSkills[skillName]) {
        assessment.technicalSkills[skillName] = { score: 0, maxScore: 5, notes: "" };
      }
      assessment.technicalSkills[skillName] = { 
        score, 
        maxScore: 5, 
        notes: notes || assessment.technicalSkills[skillName].notes 
      };
      
      // Recalculate overall score
      const allSkills = { ...assessment.technicalSkills, ...assessment.softSkills };
      const totalScore = Object.values(allSkills).reduce((sum, skill) => sum + skill.score, 0);
      const totalSkills = Object.keys(allSkills).length;
      assessment.overallScore = totalSkills > 0 ? (totalScore / totalSkills).toFixed(1) : 0;
      
      return Promise.resolve({ data: assessment });
    }
    return Promise.reject(new Error("Assessment not found"));
  },

  // Analytics
  getAssessmentAnalytics: () => {
    const totalAssessments = mockAssessments.length;
    const averageScore = mockAssessments.reduce((sum, a) => sum + parseFloat(a.overallScore), 0) / totalAssessments;
    
    // Department performance
    const departmentScores = {};
    mockAssessments.forEach(assessment => {
      const intern = mockUsers.find(u => u.id === assessment.internId);
      if (intern && intern.department) {
        if (!departmentScores[intern.department]) {
          departmentScores[intern.department] = { total: 0, count: 0 };
        }
        departmentScores[intern.department].total += parseFloat(assessment.overallScore);
        departmentScores[intern.department].count += 1;
      }
    });
    
    Object.keys(departmentScores).forEach(dept => {
      departmentScores[dept] = (departmentScores[dept].total / departmentScores[dept].count).toFixed(1);
    });
    
    return Promise.resolve({
      data: {
        totalAssessments,
        averageScore: averageScore.toFixed(1),
        departmentPerformance: departmentScores,
        recentAssessments: mockAssessments
          .sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate))
          .slice(0, 5)
      }
    });
  },

  // Progress Tracking Analytics
  getProgressAnalytics: (internId) => {
    const internProgress = mockDailyProgress.filter(p => p.internId === internId);
    const totalHours = internProgress.reduce((sum, p) => sum + p.hoursWorked, 0);
    const averageHoursPerDay = internProgress.length > 0 ? (totalHours / internProgress.length).toFixed(1) : 0;
    
    // Mood tracking
    const moodCounts = {};
    internProgress.forEach(progress => {
      moodCounts[progress.mood] = (moodCounts[progress.mood] || 0) + 1;
    });
    
    return Promise.resolve({
      data: {
        totalDays: internProgress.length,
        totalHours,
        averageHoursPerDay,
        moodTracking: moodCounts,
        recentProgress: internProgress
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7)
      }
    });
  }
};

export default assessmentService; 