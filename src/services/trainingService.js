import { mockTrainingPrograms, mockUsers } from '../mocks/data';

const trainingService = {
  // Training Programs
  getAllPrograms: () => Promise.resolve({ data: mockTrainingPrograms }),
  
  getProgramById: (id) => Promise.resolve({
    data: mockTrainingPrograms.find(program => program.id === id)
  }),
  
  getProgramsByCoordinator: (coordinatorId) => Promise.resolve({
    data: mockTrainingPrograms.filter(program => program.coordinatorId === coordinatorId)
  }),
  
  getProgramsByMentor: (mentorId) => Promise.resolve({
    data: mockTrainingPrograms.filter(program => 
      program.mentors.includes(mentorId)
    )
  }),
  
  createProgram: (programData) => {
    const newProgram = {
      ...programData,
      id: Math.max(...mockTrainingPrograms.map(p => p.id)) + 1,
      currentParticipants: 0,
      status: "active"
    };
    mockTrainingPrograms.push(newProgram);
    return Promise.resolve({ data: newProgram });
  },
  
  updateProgram: (id, updatedData) => {
    const index = mockTrainingPrograms.findIndex(program => program.id === id);
    if (index > -1) {
      mockTrainingPrograms[index] = { ...mockTrainingPrograms[index], ...updatedData };
      return Promise.resolve({ data: mockTrainingPrograms[index] });
    }
    return Promise.reject(new Error("Training program not found"));
  },
  
  deleteProgram: (id) => {
    const initialLength = mockTrainingPrograms.length;
    const filtered = mockTrainingPrograms.filter(program => program.id !== id);
    if (filtered.length < initialLength) {
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Training program not found"));
  },

  // Module Management
  addModuleToProgram: (programId, moduleData) => {
    const program = mockTrainingPrograms.find(p => p.id === programId);
    if (program) {
      const newModule = {
        ...moduleData,
        id: Math.max(...program.modules.map(m => m.id)) + 1
      };
      program.modules.push(newModule);
      return Promise.resolve({ data: newModule });
    }
    return Promise.reject(new Error("Training program not found"));
  },
  
  updateModule: (programId, moduleId, updatedData) => {
    const program = mockTrainingPrograms.find(p => p.id === programId);
    if (program) {
      const moduleIndex = program.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex > -1) {
        program.modules[moduleIndex] = { ...program.modules[moduleIndex], ...updatedData };
        return Promise.resolve({ data: program.modules[moduleIndex] });
      }
    }
    return Promise.reject(new Error("Module not found"));
  },
  
  deleteModule: (programId, moduleId) => {
    const program = mockTrainingPrograms.find(p => p.id === programId);
    if (program) {
      const initialLength = program.modules.length;
      program.modules = program.modules.filter(m => m.id !== moduleId);
      if (program.modules.length < initialLength) {
        return Promise.resolve({ success: true });
      }
    }
    return Promise.reject(new Error("Module not found"));
  },

  // Participant Management
  enrollParticipant: (programId, participantId) => {
    const program = mockTrainingPrograms.find(p => p.id === programId);
    if (program) {
      if (program.currentParticipants < program.maxParticipants) {
        program.currentParticipants += 1;
        return Promise.resolve({ 
          data: { 
            programId, 
            participantId, 
            currentParticipants: program.currentParticipants 
          } 
        });
      } else {
        return Promise.reject(new Error("Program is full"));
      }
    }
    return Promise.reject(new Error("Training program not found"));
  },
  
  removeParticipant: (programId, participantId) => {
    const program = mockTrainingPrograms.find(p => p.id === programId);
    if (program && program.currentParticipants > 0) {
      program.currentParticipants -= 1;
      return Promise.resolve({ 
        data: { 
          programId, 
          participantId, 
          currentParticipants: program.currentParticipants 
        } 
      });
    }
    return Promise.reject(new Error("Training program not found"));
  },

  // Analytics
  getTrainingAnalytics: () => {
    const totalPrograms = mockTrainingPrograms.length;
    const activePrograms = mockTrainingPrograms.filter(p => p.status === "active").length;
    const totalCapacity = mockTrainingPrograms.reduce((sum, p) => sum + p.maxParticipants, 0);
    const totalEnrolled = mockTrainingPrograms.reduce((sum, p) => sum + p.currentParticipants, 0);
    const enrollmentRate = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : 0;
    
    return Promise.resolve({
      data: {
        totalPrograms,
        activePrograms,
        totalCapacity,
        totalEnrolled,
        enrollmentRate: `${enrollmentRate}%`,
        averageProgramDuration: mockTrainingPrograms.reduce((sum, p) => {
          const duration = parseInt(p.duration.split(' ')[0]);
          return sum + duration;
        }, 0) / totalPrograms
      }
    });
  }
};

export default trainingService; 