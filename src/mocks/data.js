export const mockUsers = [
  // Admins
  {
    id: 1,
    name: "System Admin",
    email: "admin@ims.com",
    role: "ADMIN",
    password: "admin123",
    department: "IT",
    joinDate: "2023-01-15",
    avatar: "SA"
  },
  {
    id: 2,
    name: "Technical Admin",
    email: "tech.admin@ims.com",
    role: "ADMIN",
    password: "tech123",
    department: "IT",
    joinDate: "2023-03-20",
    avatar: "TA"
  },
  
  // HR Managers
  {
    id: 3,
    name: "HR Manager",
    email: "hr@ims.com",
    role: "HR",
    password: "hr123",
    department: "Human Resources",
    joinDate: "2023-02-10",
    avatar: "HR"
  },
  {
    id: 4,
    name: "Recruitment Specialist",
    email: "recruitment@ims.com",
    role: "HR",
    password: "recruit123",
    department: "Human Resources",
    joinDate: "2023-04-05",
    avatar: "RS"
  },
  
  // Internship Coordinators
  {
    id: 5,
    name: "Program Coordinator",
    email: "coordinator@ims.com",
    role: "COORDINATOR",
    password: "coord123",
    department: "Training",
    joinDate: "2023-01-20",
    avatar: "PC"
  },
  {
    id: 6,
    name: "Training Manager",
    email: "training@ims.com",
    role: "COORDINATOR",
    password: "train123",
    department: "Training",
    joinDate: "2023-05-15",
    avatar: "TM"
  },
  
  // Mentors
  {
    id: 7,
    name: "Senior Developer Mentor",
    email: "dev.mentor@ims.com",
    role: "MENTOR",
    password: "mentor123",
    department: "Engineering",
    joinDate: "2022-11-01",
    expertise: ["JavaScript", "React", "Node.js", "Python"],
    avatar: "SD",
    maxInterns: 3,
    currentInterns: 2
  },
  {
    id: 8,
    name: "Marketing Mentor",
    email: "marketing.mentor@ims.com",
    role: "MENTOR",
    password: "mkt123",
    department: "Marketing",
    joinDate: "2023-02-15",
    expertise: ["Digital Marketing", "SEO", "Content Strategy", "Social Media"],
    avatar: "MM",
    maxInterns: 2,
    currentInterns: 1
  },
  {
    id: 12,
    name: "UI/UX Mentor",
    email: "uiux.mentor@ims.com",
    role: "MENTOR",
    password: "uiux123",
    department: "Design",
    joinDate: "2023-01-10",
    expertise: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    avatar: "UX",
    maxInterns: 2,
    currentInterns: 1
  },
  
  // Interns
  {
    id: 9,
    name: "Software Dev Intern",
    email: "dev.intern@ims.com",
    role: "INTERN",
    password: "intern123",
    department: "Engineering",
    joinDate: "2023-06-01",
    university: "Tech University",
    major: "Computer Science",
    expectedGraduation: "2024-05-30",
    avatar: "DI",
    mentorId: 7,
    gpa: 3.8,
    skills: ["JavaScript", "HTML", "CSS"],
    interests: ["Web Development", "Mobile Apps", "AI/ML"]
  },
  {
    id: 10,
    name: "Marketing Intern",
    email: "mkt.intern@ims.com",
    role: "INTERN",
    password: "mktintern123",
    department: "Marketing",
    joinDate: "2023-06-01",
    university: "Business College",
    major: "Marketing",
    expectedGraduation: "2024-06-30",
    avatar: "MI",
    mentorId: 8,
    gpa: 3.6,
    skills: ["Social Media", "Content Writing", "Analytics"],
    interests: ["Digital Marketing", "Brand Management", "SEO"]
  },
  {
    id: 11,
    name: "HR Intern",
    email: "hr.intern@ims.com",
    role: "INTERN",
    password: "hrintern123",
    department: "Human Resources",
    joinDate: "2023-06-01",
    university: "State University",
    major: "Human Resources",
    expectedGraduation: "2023-12-15",
    avatar: "HI",
    mentorId: 3,
    gpa: 3.7,
    skills: ["Recruitment", "Employee Relations", "HRIS"],
    interests: ["Talent Acquisition", "Organizational Development", "Compensation"]
  },
  {
    id: 13,
    name: "UI/UX Design Intern",
    email: "uiux.intern@ims.com",
    role: "INTERN",
    password: "uiuxintern123",
    department: "Design",
    joinDate: "2023-07-01",
    university: "Design Institute",
    major: "Graphic Design",
    expectedGraduation: "2024-07-30",
    avatar: "UI",
    mentorId: 12,
    gpa: 3.9,
    skills: ["Figma", "Adobe Creative Suite", "Typography"],
    interests: ["User Experience", "Visual Design", "Brand Identity"]
  }
];

export const mockInterns = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "intern1@ims.com",
    university: "ĐH Bách Khoa",
    major: "Công nghệ thông tin",
    startDate: "2023-09-01",
    endDate: "2024-03-01",
    status: "active",
    department: "Engineering",
    mentorId: 7,
    gpa: 3.8,
    skills: ["Java", "Spring Boot", "MySQL"],
    interests: ["Backend Development", "Database Design", "API Development"],
    avatar: "NA",
    phone: "0123456789",
    address: "Hà Nội, Việt Nam",
    emergencyContact: {
      name: "Nguyễn Thị B",
      relationship: "Mẹ",
      phone: "0987654321"
    }
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "intern2@ims.com",
    university: "ĐH Kinh tế Quốc dân",
    major: "Marketing",
    startDate: "2023-09-01",
    endDate: "2024-03-01",
    status: "active",
    department: "Marketing",
    mentorId: 8,
    gpa: 3.6,
    skills: ["Digital Marketing", "Content Creation", "Social Media"],
    interests: ["Brand Marketing", "Customer Analytics", "Campaign Management"],
    avatar: "TB",
    phone: "0123456790",
    address: "TP.HCM, Việt Nam",
    emergencyContact: {
      name: "Trần Văn C",
      relationship: "Bố",
      phone: "0987654320"
    }
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "intern3@ims.com",
    university: "ĐH FPT",
    major: "Software Engineering",
    startDate: "2023-10-01",
    endDate: "2024-04-01",
    status: "active",
    department: "Engineering",
    mentorId: 7,
    gpa: 3.9,
    skills: ["React", "Node.js", "MongoDB"],
    interests: ["Full-stack Development", "Cloud Computing", "DevOps"],
    avatar: "LC",
    phone: "0123456791",
    address: "Đà Nẵng, Việt Nam",
    emergencyContact: {
      name: "Lê Thị D",
      relationship: "Chị gái",
      phone: "0987654319"
    }
  }
];

export const mockTasks = [
  {
    id: 1,
    title: "Complete React Training",
    description: "Learn React fundamentals and complete the online course",
    assigneeId: 9,
    assigneeName: "Software Dev Intern",
    mentorId: 7,
    dueDate: "2023-12-15",
    status: "in-progress",
    priority: "high",
    category: "Training",
    estimatedHours: 20,
    actualHours: 12,
    progress: 60,
    attachments: ["react-basics.pdf", "practice-exercises.zip"],
    comments: [
      { id: 1, author: "Senior Developer Mentor", text: "Great progress! Keep up the good work.", timestamp: "2023-12-10T10:00:00Z" }
    ]
  },
  {
    id: 2,
    title: "Design Landing Page",
    description: "Create a responsive landing page for the new product",
    assigneeId: 13,
    assigneeName: "UI/UX Design Intern",
    mentorId: 12,
    dueDate: "2023-12-20",
    status: "in-progress",
    priority: "medium",
    category: "Design",
    estimatedHours: 16,
    actualHours: 8,
    progress: 50,
    attachments: ["design-brief.pdf", "wireframes.fig"],
    comments: [
      { id: 2, author: "UI/UX Mentor", text: "The wireframes look good. Focus on the mobile experience next.", timestamp: "2023-12-12T14:30:00Z" }
    ]
  }
];

// Recruitment Campaigns
export const mockRecruitmentCampaigns = [
  {
    id: 1,
    title: "Software Engineering Internship 2024",
    department: "Engineering",
    positions: 5,
    applications: 45,
    status: "active",
    startDate: "2023-11-01",
    endDate: "2024-01-31",
    requirements: [
      "Computer Science or related field",
      "Knowledge of programming languages (Java, Python, JavaScript)",
      "Strong problem-solving skills",
      "Good communication skills"
    ],
    benefits: [
      "Competitive stipend",
      "Mentorship program",
      "Real project experience",
      "Potential full-time offer"
    ],
    createdBy: 3,
    createdAt: "2023-10-15"
  },
  {
    id: 2,
    title: "Marketing Internship Program",
    department: "Marketing",
    positions: 3,
    applications: 28,
    status: "active",
    startDate: "2023-11-15",
    endDate: "2024-02-15",
    requirements: [
      "Marketing, Business, or Communications major",
      "Experience with social media platforms",
      "Creative thinking and analytical skills",
      "Fluent in English and Vietnamese"
    ],
    benefits: [
      "Monthly stipend",
      "Professional development workshops",
      "Portfolio building opportunities",
      "Networking events"
    ],
    createdBy: 3,
    createdAt: "2023-10-20"
  }
];

// Training Programs
export const mockTrainingPrograms = [
  {
    id: 1,
    title: "Full-Stack Development Bootcamp",
    description: "Comprehensive training program covering frontend and backend development",
    duration: "8 weeks",
    maxParticipants: 15,
    currentParticipants: 12,
    status: "active",
    modules: [
      {
        id: 1,
        title: "HTML, CSS & JavaScript Fundamentals",
        duration: "2 weeks",
        topics: ["HTML5", "CSS3", "ES6+", "DOM Manipulation"]
      },
      {
        id: 2,
        title: "React.js Development",
        duration: "2 weeks",
        topics: ["Components", "Hooks", "State Management", "Routing"]
      },
      {
        id: 3,
        title: "Node.js & Express",
        duration: "2 weeks",
        topics: ["Server Setup", "API Development", "Database Integration"]
      },
      {
        id: 4,
        title: "Project Development",
        duration: "2 weeks",
        topics: ["Full-stack Project", "Deployment", "Testing"]
      }
    ],
    coordinatorId: 5,
    mentors: [7, 12],
    startDate: "2024-01-15",
    endDate: "2024-03-15"
  },
  {
    id: 2,
    title: "Digital Marketing Masterclass",
    description: "Advanced digital marketing techniques and strategies",
    duration: "6 weeks",
    maxParticipants: 20,
    currentParticipants: 18,
    status: "active",
    modules: [
      {
        id: 5,
        title: "SEO & Content Marketing",
        duration: "2 weeks",
        topics: ["Keyword Research", "Content Strategy", "On-page SEO"]
      },
      {
        id: 6,
        title: "Social Media Marketing",
        duration: "2 weeks",
        topics: ["Platform Strategy", "Content Creation", "Community Management"]
      },
      {
        id: 7,
        title: "Analytics & Optimization",
        duration: "2 weeks",
        topics: ["Google Analytics", "A/B Testing", "ROI Measurement"]
      }
    ],
    coordinatorId: 6,
    mentors: [8],
    startDate: "2024-01-20",
    endDate: "2024-03-05"
  }
];

// Interview Schedules
export const mockInterviews = [
  {
    id: 1,
    candidateName: "Nguyễn Thị D",
    candidateEmail: "candidate1@email.com",
    position: "Software Engineering Intern",
    department: "Engineering",
    interviewType: "Technical",
    scheduledDate: "2024-01-15",
    scheduledTime: "14:00",
    duration: 60,
    interviewers: [7, 5],
    status: "scheduled",
    location: "Conference Room A",
    notes: "Candidate has strong Java background, focus on problem-solving skills"
  },
  {
    id: 2,
    candidateName: "Trần Văn E",
    candidateEmail: "candidate2@email.com",
    position: "Marketing Intern",
    department: "Marketing",
    interviewType: "Behavioral",
    scheduledDate: "2024-01-16",
    scheduledTime: "10:00",
    duration: 45,
    interviewers: [8, 3],
    status: "scheduled",
    location: "Conference Room B",
    notes: "Marketing major with social media experience"
  },
  {
    id: 3,
    candidateName: "Lê Thị F",
    candidateEmail: "candidate3@email.com",
    position: "UI/UX Design Intern",
    department: "Design",
    interviewType: "Portfolio Review",
    scheduledDate: "2024-01-17",
    scheduledTime: "15:30",
    duration: 90,
    interviewers: [12, 6],
    status: "scheduled",
    location: "Design Studio",
    notes: "Bring portfolio and design process examples"
  }
];

// Performance Assessments
export const mockAssessments = [
  {
    id: 1,
    internId: 9,
    internName: "Software Dev Intern",
    mentorId: 7,
    mentorName: "Senior Developer Mentor",
    period: "Q4 2023",
    assessmentDate: "2023-12-15",
    technicalSkills: {
      "JavaScript": { score: 4, maxScore: 5, notes: "Strong fundamentals, needs practice with async programming" },
      "React": { score: 3, maxScore: 5, notes: "Good understanding of components, needs work on state management" },
      "Problem Solving": { score: 4, maxScore: 5, notes: "Excellent analytical thinking, good at debugging" }
    },
    softSkills: {
      "Communication": { score: 4, maxScore: 5, notes: "Clear and professional communication" },
      "Teamwork": { score: 5, maxScore: 5, notes: "Great team player, helps others" },
      "Time Management": { score: 3, maxScore: 5, notes: "Sometimes needs reminders for deadlines" }
    },
    overallScore: 3.8,
    strengths: ["Quick learner", "Good problem-solving skills", "Team player"],
    areasForImprovement: ["Async programming", "State management", "Time management"],
    goals: ["Master React Hooks", "Complete 2 projects", "Improve time management"],
    mentorComments: "Excellent progress this quarter. Focus on the identified areas for improvement.",
    nextReviewDate: "2024-03-15"
  },
  {
    id: 2,
    internId: 10,
    internName: "Marketing Intern",
    mentorId: 8,
    mentorName: "Marketing Mentor",
    period: "Q4 2023",
    assessmentDate: "2023-12-15",
    technicalSkills: {
      "Social Media": { score: 4, maxScore: 5, notes: "Great content creation skills" },
      "Analytics": { score: 3, maxScore: 5, notes: "Basic understanding, needs more practice" },
      "Content Strategy": { score: 4, maxScore: 5, notes: "Creative ideas, good writing skills" }
    },
    softSkills: {
      "Communication": { score: 5, maxScore: 5, notes: "Excellent communication skills" },
      "Creativity": { score: 5, maxScore: 5, notes: "Very creative and innovative" },
      "Organization": { score: 4, maxScore: 5, notes: "Well organized, good planning skills" }
    },
    overallScore: 4.2,
    strengths: ["Creative thinking", "Strong communication", "Content creation"],
    areasForImprovement: ["Data analytics", "Campaign measurement", "ROI calculation"],
    goals: ["Master Google Analytics", "Lead 1 campaign", "Improve data analysis skills"],
    mentorComments: "Outstanding performance in content creation. Focus on analytics skills.",
    nextReviewDate: "2024-03-15"
  }
];

// Daily Progress Logs
export const mockDailyProgress = [
  {
    id: 1,
    internId: 9,
    internName: "Software Dev Intern",
    date: "2023-12-14",
    tasksCompleted: [
      "Completed React Hooks tutorial",
      "Built a simple todo app",
      "Reviewed code with mentor"
    ],
    hoursWorked: 8,
    challenges: "Understanding useEffect dependencies",
    solutions: "Mentor explained with examples",
    mood: "excited",
    notes: "Great day! Finally understood React Hooks concept."
  },
  {
    id: 2,
    internId: 10,
    internName: "Marketing Intern",
    date: "2023-12-14",
    tasksCompleted: [
      "Created social media content for Q1 campaign",
      "Analyzed competitor social media strategies",
      "Attended marketing team meeting"
    ],
    hoursWorked: 7.5,
    challenges: "Finding unique content angles",
    solutions: "Brainstormed with team",
    mood: "productive",
    notes: "Team collaboration was very helpful for content ideas."
  }
];

// System Notifications
export const mockNotifications = [
  {
    id: 1,
    userId: 9,
    type: "task_due",
    title: "Task Due Soon",
    message: "React Training completion is due in 2 days",
    timestamp: "2023-12-13T10:00:00Z",
    read: false,
    priority: "high"
  },
  {
    id: 2,
    userId: 7,
    type: "assessment_due",
    title: "Performance Review Due",
    message: "Q4 performance assessment for Software Dev Intern is due",
    timestamp: "2023-12-13T09:00:00Z",
    read: false,
    priority: "medium"
  },
  {
    id: 3,
    userId: 3,
    type: "application_received",
    title: "New Application",
    message: "New application received for Software Engineering Internship",
    timestamp: "2023-12-13T08:30:00Z",
    read: true,
    priority: "low"
  }
];

// Analytics Data - Moved to analyticsService.js for better organization

// Feedback Data
export const mockFeedback = [
  {
    id: 1,
    internId: 13,
    mentorId: 7,
    type: "training",
    rating: 4.5,
    comment: "The React training was very helpful. I learned a lot about component lifecycle.",
    category: "training_program",
    programId: 1,
    createdAt: "2024-01-20",
    status: "submitted"
  },
  {
    id: 2,
    internId: 14,
    mentorId: 8,
    type: "mentor",
    rating: 5.0,
    comment: "My mentor is very supportive and provides clear guidance.",
    category: "mentor_interaction",
    createdAt: "2024-01-22",
    status: "submitted"
  },
  {
    id: 3,
    internId: 15,
    mentorId: 12,
    type: "program",
    rating: 4.0,
    comment: "The overall internship program is well-structured.",
    category: "program_experience",
    createdAt: "2024-01-25",
    status: "submitted"
  }
];

// Communication Data
export const mockMessages = [
  {
    id: 1,
    senderId: 7,
    receiverId: 13,
    content: "How is the React project coming along?",
    timestamp: "2024-01-20T10:30:00Z",
    type: "text",
    status: "read"
  },
  {
    id: 2,
    senderId: 13,
    receiverId: 7,
    content: "I'm making good progress. Can we schedule a review session?",
    timestamp: "2024-01-20T11:15:00Z",
    type: "text",
    status: "read"
  },
  {
    id: 3,
    senderId: 8,
    receiverId: 14,
    content: "Great work on the marketing campaign!",
    timestamp: "2024-01-21T09:00:00Z",
    type: "text",
    status: "unread"
  }
];

// Chat Rooms
export const mockChatRooms = [
  {
    id: 1,
    name: "React Development Team",
    participants: [7, 13, 15],
    lastMessage: "2024-01-21T14:30:00Z",
    unreadCount: 2
  },
  {
    id: 2,
    name: "Marketing Team",
    participants: [8, 14],
    lastMessage: "2024-01-21T16:45:00Z",
    unreadCount: 0
  }
];