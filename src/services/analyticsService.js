import { 
  mockUsers, 
  mockInterns, 
  mockTasks, 
  mockRecruitmentCampaigns,
  mockTrainingPrograms,
  mockAssessments,
  mockDailyProgress
} from '../mocks/data';

const analyticsService = {
  // System Overview Analytics
  getSystemOverview: () => {
    const totalUsers = mockUsers.length;
    const totalInterns = mockInterns.length;
    const totalTasks = mockTasks.length;
    const totalCampaigns = mockRecruitmentCampaigns.length;
    const totalPrograms = mockTrainingPrograms.length;
    
    // User distribution by role
    const roleDistribution = {};
    mockUsers.forEach(user => {
      roleDistribution[user.role] = (roleDistribution[user.role] || 0) + 1;
    });
    
    // Department distribution
    const departmentDistribution = {};
    mockUsers.forEach(user => {
      if (user.department) {
        departmentDistribution[user.department] = (departmentDistribution[user.department] || 0) + 1;
      }
    });
    
    return Promise.resolve({
      data: {
        totalUsers,
        totalInterns,
        totalTasks,
        totalCampaigns,
        totalPrograms,
        roleDistribution,
        departmentDistribution,
        systemHealth: {
          status: "healthy",
          uptime: "99.9%",
          lastBackup: new Date().toISOString().split('T')[0]
        }
      }
    });
  },

  // Intern Performance Analytics
  getInternPerformanceAnalytics: () => {
    const totalInterns = mockInterns.length;
    const activeInterns = mockInterns.filter(intern => intern.status === "active").length;
    
    // Performance by department
    const departmentPerformance = {};
    mockAssessments.forEach(assessment => {
      const intern = mockUsers.find(u => u.id === assessment.internId);
      if (intern && intern.department) {
        if (!departmentPerformance[intern.department]) {
          departmentPerformance[intern.department] = { total: 0, count: 0 };
        }
        departmentPerformance[intern.department].total += parseFloat(assessment.overallScore);
        departmentPerformance[intern.department].count += 1;
      }
    });
    
    Object.keys(departmentPerformance).forEach(dept => {
      departmentPerformance[dept] = (departmentPerformance[dept].total / departmentPerformance[dept].count).toFixed(1);
    });
    
    // GPA distribution
    const gpaRanges = {
      "3.5-4.0": 0,
      "3.0-3.4": 0,
      "2.5-2.9": 0,
      "2.0-2.4": 0
    };
    
    mockUsers.filter(u => u.role === "INTERN").forEach(intern => {
      if (intern.gpa >= 3.5) gpaRanges["3.5-4.0"]++;
      else if (intern.gpa >= 3.0) gpaRanges["3.0-3.4"]++;
      else if (intern.gpa >= 2.5) gpaRanges["2.5-2.9"]++;
      else gpaRanges["2.0-2.4"]++;
    });
    
    return Promise.resolve({
      data: {
        totalInterns,
        activeInterns,
        inactiveInterns: totalInterns - activeInterns,
        departmentPerformance,
        gpaDistribution: gpaRanges,
        averageGPA: (() => {
          const internsWithGPA = mockUsers.filter(u => u.role === "INTERN" && u.gpa);
          return internsWithGPA.length > 0 ? 
            internsWithGPA.reduce((sum, intern) => sum + intern.gpa, 0) / internsWithGPA.length : 0;
        })()
      }
    });
  },

  // Task Management Analytics
  getTaskAnalytics: () => {
    const totalTasks = mockTasks.length;
    const completedTasks = mockTasks.filter(task => task.status === "completed").length;
    const inProgressTasks = mockTasks.filter(task => task.status === "in-progress").length;
    const pendingTasks = mockTasks.filter(task => task.status === "planning").length;
    
    // Task completion rate
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
    
    // Tasks by priority
    const priorityDistribution = {};
    mockTasks.forEach(task => {
      priorityDistribution[task.priority] = (priorityDistribution[task.priority] || 0) + 1;
    });
    
    // Tasks by category
    const categoryDistribution = {};
    mockTasks.forEach(task => {
      categoryDistribution[task.category] = (categoryDistribution[task.category] || 0) + 1;
    });
    
    // Average progress
    const averageProgress = totalTasks > 0 ? mockTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / totalTasks : 0;
    
    return Promise.resolve({
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        completionRate: `${completionRate}%`,
        priorityDistribution,
        categoryDistribution,
        averageProgress: averageProgress.toFixed(1),
        overdueTasks: mockTasks.filter(task => 
          new Date(task.dueDate) < new Date() && task.status !== "completed"
        ).length
      }
    });
  },

  // Recruitment Analytics
  getRecruitmentAnalytics: () => {
    const totalCampaigns = mockRecruitmentCampaigns.length;
    const activeCampaigns = mockRecruitmentCampaigns.filter(c => c.status === "active").length;
    const totalApplications = mockRecruitmentCampaigns.reduce((sum, c) => sum + c.applications, 0);
    const totalPositions = mockRecruitmentCampaigns.reduce((sum, c) => sum + c.positions, 0);
    
    // Applications per campaign
    const applicationsPerCampaign = mockRecruitmentCampaigns.map(campaign => ({
      campaignTitle: campaign.title,
      applications: campaign.applications,
      positions: campaign.positions,
      ratio: campaign.positions > 0 ? (campaign.applications / campaign.positions).toFixed(2) : 0
    }));
    
    // Department distribution
    const departmentDistribution = {};
    mockRecruitmentCampaigns.forEach(campaign => {
      departmentDistribution[campaign.department] = (departmentDistribution[campaign.department] || 0) + 1;
    });
    
    return Promise.resolve({
      data: {
        totalCampaigns,
        activeCampaigns,
        inactiveCampaigns: totalCampaigns - activeCampaigns,
        totalApplications,
        totalPositions,
        applicationToPositionRatio: totalPositions > 0 ? (totalApplications / totalPositions).toFixed(2) : 0,
        applicationsPerCampaign,
        departmentDistribution,
        averageApplicationsPerCampaign: totalCampaigns > 0 ? (totalApplications / totalCampaigns).toFixed(1) : 0
      }
    });
  },

  // Training Analytics
  getTrainingAnalytics: () => {
    const totalPrograms = mockTrainingPrograms.length;
    const activePrograms = mockTrainingPrograms.filter(p => p.status === "active").length;
    const totalCapacity = mockTrainingPrograms.reduce((sum, p) => sum + p.maxParticipants, 0);
    const totalEnrolled = mockTrainingPrograms.reduce((sum, p) => sum + p.currentParticipants, 0);
    
    // Enrollment rate by program
    const enrollmentByProgram = mockTrainingPrograms.map(program => ({
      programTitle: program.title,
      maxParticipants: program.maxParticipants,
      currentParticipants: program.currentParticipants,
      enrollmentRate: program.maxParticipants > 0 ? 
        ((program.currentParticipants / program.maxParticipants) * 100).toFixed(1) : 0
    }));
    
    // Module distribution
    const totalModules = mockTrainingPrograms.reduce((sum, p) => sum + p.modules.length, 0);
    const averageModulesPerProgram = totalPrograms > 0 ? (totalModules / totalPrograms).toFixed(1) : 0;
    
    return Promise.resolve({
      data: {
        totalPrograms,
        activePrograms,
        inactivePrograms: totalPrograms - activePrograms,
        totalCapacity,
        totalEnrolled,
        overallEnrollmentRate: totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : 0,
        enrollmentByProgram,
        totalModules,
        averageModulesPerProgram,
        averageProgramDuration: totalPrograms > 0 ? mockTrainingPrograms.reduce((sum, p) => {
          const duration = parseInt(p.duration.split(' ')[0]);
          return sum + duration;
        }, 0) / totalPrograms : 0
      }
    });
  },

  // Progress Tracking Analytics
  getProgressAnalytics: () => {
    const totalProgressEntries = mockDailyProgress.length;
    const totalHours = mockDailyProgress.reduce((sum, p) => sum + p.hoursWorked, 0);
    const averageHoursPerDay = totalProgressEntries > 0 ? (totalHours / totalProgressEntries).toFixed(1) : 0;
    
    // Mood tracking
    const moodDistribution = {};
    mockDailyProgress.forEach(progress => {
      moodDistribution[progress.mood] = (moodDistribution[progress.mood] || 0) + 1;
    });
    
    // Progress by intern
    const progressByIntern = {};
    mockDailyProgress.forEach(progress => {
      if (!progressByIntern[progress.internId]) {
        progressByIntern[progress.internId] = { totalHours: 0, days: 0 };
      }
      progressByIntern[progress.internId].totalHours += progress.hoursWorked;
      progressByIntern[progress.internId].days += 1;
    });
    
    Object.keys(progressByIntern).forEach(internId => {
      progressByIntern[internId].averageHoursPerDay = 
        (progressByIntern[internId].totalHours / progressByIntern[internId].days).toFixed(1);
    });
    
    return Promise.resolve({
      data: {
        totalProgressEntries,
        totalHours,
        averageHoursPerDay,
        moodDistribution,
        progressByIntern,
        mostProductiveDay: mockDailyProgress.reduce((max, p) => 
          p.hoursWorked > max.hoursWorked ? p : max
        , { hoursWorked: 0 })
      }
    });
  },

  // Dashboard Summary
  getDashboardSummary: () => {
    return Promise.all([
      this.getSystemOverview(),
      this.getInternPerformanceAnalytics(),
      this.getTaskAnalytics(),
      this.getRecruitmentAnalytics(),
      this.getTrainingAnalytics(),
      this.getProgressAnalytics()
    ]).then(results => {
      const summary = {
        system: results[0].data,
        internPerformance: results[1].data,
        tasks: results[2].data,
        recruitment: results[3].data,
        training: results[4].data,
        progress: results[5].data,
        lastUpdated: new Date().toISOString()
      };
      
      return { data: summary };
    });
  }
};

export default analyticsService; 