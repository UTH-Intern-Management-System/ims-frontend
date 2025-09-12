import { mockAssessments, mockDailyProgress, mockUsers } from '../mocks/data';

const API_BASE_URL = 'http://localhost:9004/assessment';

const assessmentService = {
  // Core Assessment APIs
  getAllAssessments: async () => {
    try {
      console.log('🔄 Fetching assessments from:', `${API_BASE_URL}/assessments`);
      const response = await fetch(`${API_BASE_URL}/assessments`);
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Successfully fetched assessments:', data.length, 'items');
      return { data };
    } catch (error) {
      console.error('❌ Error fetching assessments:', error);
      console.log('🔄 Falling back to mock data with', mockAssessments.length, 'items');
      return Promise.resolve({ data: mockAssessments });
    }
  },

  getAssessmentById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assessments/${id}`);
      if (!response.ok) throw new Error('Assessment not found');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error fetching assessment:', error);
      const assessment = mockAssessments.find(a => a.id === id);
      return Promise.resolve({ data: assessment });
    }
  },

  getAssessmentsByIntern: async (internId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assessments/intern/${internId}`);
      if (!response.ok) throw new Error('Failed to fetch intern assessments');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error fetching intern assessments:', error);
      const assessments = mockAssessments.filter(a => a.internId === internId);
      return Promise.resolve({ data: assessments });
    }
  },

  createAssessment: async (assessmentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });
      if (!response.ok) throw new Error('Failed to create assessment');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error creating assessment:', error);
      // Fallback to mock data
      const newAssessment = {
        ...assessmentData,
        id: Math.max(...mockAssessments.map(a => a.id)) + 1,
        assessmentDate: new Date().toISOString().split('T')[0]
      };
      mockAssessments.push(newAssessment);
      return Promise.resolve({ data: newAssessment });
    }
  },

  updateAssessment: async (id, assessmentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assessments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });
      if (!response.ok) throw new Error('Failed to update assessment');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error updating assessment:', error);
      const index = mockAssessments.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAssessments[index] = { ...mockAssessments[index], ...assessmentData };
        return Promise.resolve({ data: mockAssessments[index] });
      }
      return Promise.reject(new Error('Assessment not found'));
    }
  },

  deleteAssessment: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assessments/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete assessment');
      return { success: true };
    } catch (error) {
      console.error('Error deleting assessment:', error);
      const index = mockAssessments.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAssessments.splice(index, 1);
        return Promise.resolve({ success: true });
      }
      return Promise.reject(new Error('Assessment not found'));
    }
  },

  // Daily Progress APIs
  getDailyProgress: async (internId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/${internId}`);
      if (!response.ok) throw new Error('Failed to fetch daily progress');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error fetching daily progress:', error);
      const progress = mockDailyProgress.filter(p => p.internId === internId);
      return Promise.resolve({ data: progress });
    }
  },

  submitDailyProgress: async (progressData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData)
      });
      if (!response.ok) throw new Error('Failed to submit daily progress');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error submitting daily progress:', error);
      const newProgress = {
        ...progressData,
        id: Math.max(...mockDailyProgress.map(p => p.id)) + 1
      };
      mockDailyProgress.push(newProgress);
      return Promise.resolve({ data: newProgress });
    }
  },

  // Skill Assessment APIs
  assessSkill: async (internId, skillName, score, notes) => {
    try {
      const response = await fetch(`${API_BASE_URL}/skills/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ internId, skillName, score, notes })
      });
      if (!response.ok) throw new Error('Failed to assess skill');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error assessing skill:', error);
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
        
        const allSkills = { ...assessment.technicalSkills, ...assessment.softSkills };
        const totalScore = Object.values(allSkills).reduce((sum, skill) => sum + skill.score, 0);
        const totalSkills = Object.keys(allSkills).length;
        assessment.overallScore = totalSkills > 0 ? (totalScore / totalSkills).toFixed(1) : 0;
        
        return Promise.resolve({ data: assessment });
      }
      return Promise.reject(new Error("Assessment not found"));
    }
  },

  // Analytics APIs
  getAssessmentAnalytics: () => {
    const totalAssessments = mockAssessments.length;
    const averageScore = mockAssessments.reduce((sum, a) => sum + parseFloat(a.overallScore), 0) / totalAssessments;
    
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

  getProgressAnalytics: (internId) => {
    const internProgress = mockDailyProgress.filter(p => p.internId === internId);
    const totalHours = internProgress.reduce((sum, p) => sum + p.hoursWorked, 0);
    const averageHoursPerDay = internProgress.length > 0 ? (totalHours / internProgress.length).toFixed(1) : 0;
    
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