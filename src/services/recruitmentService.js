import { 
  mockRecruitmentCampaigns, 
  mockInterviews, 
  mockUsers 
} from '../mocks/data';

const recruitmentService = {
  // Campaign Management
  getAllCampaigns: () => Promise.resolve({ data: mockRecruitmentCampaigns }),
  
  getCampaignById: (id) => Promise.resolve({
    data: mockRecruitmentCampaigns.find(campaign => campaign.id === id)
  }),
  
  createCampaign: (campaignData) => {
    const newCampaign = {
      ...campaignData,
      id: Math.max(...mockRecruitmentCampaigns.map(c => c.id)) + 1,
      applications: 0,
      status: "active",
      createdAt: new Date().toISOString().split('T')[0]
    };
    mockRecruitmentCampaigns.push(newCampaign);
    return Promise.resolve({ data: newCampaign });
  },
  
  updateCampaign: (id, updatedData) => {
    const index = mockRecruitmentCampaigns.findIndex(campaign => campaign.id === id);
    if (index > -1) {
      mockRecruitmentCampaigns[index] = { ...mockRecruitmentCampaigns[index], ...updatedData };
      return Promise.resolve({ data: mockRecruitmentCampaigns[index] });
    }
    return Promise.reject(new Error("Campaign not found"));
  },
  
  deleteCampaign: (id) => {
    const index = mockRecruitmentCampaigns.findIndex(campaign => campaign.id === id);
    if (index > -1) {
      mockRecruitmentCampaigns.splice(index, 1);
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Campaign not found"));
  },

  // Interview Management
  getAllInterviews: () => Promise.resolve({ data: mockInterviews }),
  
  getInterviewsByDate: (date) => Promise.resolve({
    data: mockInterviews.filter(interview => interview.scheduledDate === date)
  }),
  
  getInterviewsByInterviewer: (interviewerId) => Promise.resolve({
    data: mockInterviews.filter(interview => 
      interview.interviewers.includes(interviewerId)
    )
  }),
  
  scheduleInterview: (interviewData) => {
    const newInterview = {
      ...interviewData,
      id: Math.max(...mockInterviews.map(i => i.id)) + 1,
      status: "scheduled"
    };
    mockInterviews.push(newInterview);
    return Promise.resolve({ data: newInterview });
  },
  
  updateInterview: (id, updatedData) => {
    const index = mockInterviews.findIndex(interview => interview.id === id);
    if (index > -1) {
      mockInterviews[index] = { ...mockInterviews[index], ...updatedData };
      return Promise.resolve({ data: mockInterviews[index] });
    }
    return Promise.reject(new Error("Interview not found"));
  },
  
  cancelInterview: (id) => {
    const interview = mockInterviews.find(i => i.id === id);
    if (interview) {
      interview.status = "cancelled";
      return Promise.resolve({ data: interview });
    }
    return Promise.reject(new Error("Interview not found"));
  },

  // Analytics
  getRecruitmentAnalytics: () => {
    const totalCampaigns = mockRecruitmentCampaigns.length;
    const activeCampaigns = mockRecruitmentCampaigns.filter(c => c.status === "active").length;
    const totalApplications = mockRecruitmentCampaigns.reduce((sum, c) => sum + c.applications, 0);
    const totalPositions = mockRecruitmentCampaigns.reduce((sum, c) => sum + c.positions, 0);
    
    return Promise.resolve({
      data: {
        totalCampaigns,
        activeCampaigns,
        totalApplications,
        totalPositions,
        applicationToPositionRatio: totalPositions > 0 ? (totalApplications / totalPositions).toFixed(2) : 0
      }
    });
  }
};

export default recruitmentService;