import emailSmsService from './emailSmsService';
import crossModuleService from './crossModuleService';
import eventBus, { EVENT_TYPES } from './eventBus';

// Workflow integration service to connect email/SMS with cross-module events
class WorkflowIntegration {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Interview scheduling workflow
    eventBus.on(EVENT_TYPES.INTERVIEW_SCHEDULED, async (data) => {
      await this.handleInterviewScheduled(data);
    });

    // Intern creation workflow
    eventBus.on(EVENT_TYPES.INTERN_CREATED, async (data) => {
      await this.handleInternCreated(data);
    });

    // Task assignment workflow
    eventBus.on(EVENT_TYPES.TASK_ASSIGNED, async (data) => {
      await this.handleTaskAssigned(data);
    });

    // Assessment completion workflow
    eventBus.on(EVENT_TYPES.ASSESSMENT_COMPLETED, async (data) => {
      await this.handleAssessmentCompleted(data);
    });

    // Feedback submission workflow
    eventBus.on(EVENT_TYPES.FEEDBACK_SUBMITTED, async (data) => {
      await this.handleFeedbackSubmitted(data);
    });
  }

  // Handle interview scheduled event
  async handleInterviewScheduled(data) {
    const { candidateName, candidateEmail, candidatePhone, interviewDate, interviewTime, location, interviewer, format } = data;

    // Send email confirmation
    await emailSmsService.sendEmail(
      candidateEmail,
      'interview_scheduled',
      {
        candidateName,
        companyName: 'Công ty ABC',
        interviewDate: new Date(interviewDate).toLocaleDateString('vi-VN'),
        interviewTime,
        location,
        interviewer,
        format
      }
    );

    // Send SMS reminder 1 day before
    const reminderDate = new Date(interviewDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    
    await emailSmsService.scheduleSms(
      candidatePhone,
      'interview_reminder',
      {
        time: interviewTime,
        location,
        companyName: 'Công ty ABC'
      },
      reminderDate.toISOString()
    );

    console.log(`📧 Interview notifications sent to ${candidateName}`);
  }

  // Handle intern creation event
  async handleInternCreated(data) {
    const { name, email, phone, department, mentorName, startDate, workLocation } = data;

    // Send welcome email
    await emailSmsService.sendEmail(
      email,
      'intern_accepted',
      {
        internName: name,
        companyName: 'Công ty ABC',
        startDate: new Date(startDate).toLocaleDateString('vi-VN'),
        department,
        mentorName,
        workLocation
      }
    );

    // Send welcome SMS
    await emailSmsService.sendSms(
      phone,
      'welcome_intern',
      {
        internName: name,
        companyName: 'Công ty ABC',
        startDate: new Date(startDate).toLocaleDateString('vi-VN')
      }
    );

    console.log(`🎉 Welcome notifications sent to ${name}`);
  }

  // Handle task assignment event
  async handleTaskAssigned(data) {
    const { internName, internEmail, internPhone, taskTitle, taskDescription, dueDate, priority } = data;

    // Send task assignment email
    await emailSmsService.sendEmail(
      internEmail,
      'task_assigned',
      {
        internName,
        taskTitle,
        taskDescription,
        dueDate: new Date(dueDate).toLocaleDateString('vi-VN'),
        priority: priority === 'high' ? 'Cao' : priority === 'medium' ? 'Trung bình' : 'Thấp'
      }
    );

    // Send SMS reminder 2 hours before deadline for high priority tasks
    if (priority === 'high') {
      const reminderDate = new Date(dueDate);
      reminderDate.setHours(reminderDate.getHours() - 2);
      
      await emailSmsService.scheduleSms(
        internPhone,
        'task_deadline',
        {
          taskTitle,
          hours: '2',
          companyName: 'Công ty ABC'
        },
        reminderDate.toISOString()
      );
    }

    console.log(`📋 Task assignment notifications sent to ${internName}`);
  }

  // Handle assessment completion event
  async handleAssessmentCompleted(data) {
    const { internName, internEmail, mentorName, assessmentDate, skills } = data;

    // Send assessment completion email
    await emailSmsService.sendEmail(
      internEmail,
      'assessment_reminder',
      {
        internName,
        assessmentDate: new Date(assessmentDate).toLocaleDateString('vi-VN'),
        mentorName,
        skills: skills.join(', ')
      }
    );

    console.log(`📊 Assessment notifications sent to ${internName}`);
  }

  // Handle feedback submission event
  async handleFeedbackSubmitted(data) {
    const { internName, mentorEmail, hrEmail, feedbackType, priority } = data;

    // Send notification to mentor
    if (mentorEmail) {
      await emailSmsService.sendEmail(
        mentorEmail,
        'feedback_request',
        {
          internName,
          feedbackType
        }
      );
    }

    // Send notification to HR for high priority feedback
    if (priority === 'high' && hrEmail) {
      await emailSmsService.sendEmail(
        hrEmail,
        'feedback_request',
        {
          internName,
          feedbackType: `${feedbackType} (Ưu tiên cao)`
        }
      );
    }

    console.log(`💬 Feedback notifications sent for ${internName}`);
  }

  // Trigger workflows manually for testing
  async triggerInterviewWorkflow(candidateData) {
    eventBus.emit(EVENT_TYPES.INTERVIEW_SCHEDULED, candidateData);
  }

  async triggerInternWelcomeWorkflow(internData) {
    eventBus.emit(EVENT_TYPES.INTERN_CREATED, internData);
  }

  async triggerTaskAssignmentWorkflow(taskData) {
    eventBus.emit(EVENT_TYPES.TASK_ASSIGNED, taskData);
  }

  // Bulk operations
  async sendBulkInterviewReminders(interviews) {
    const recipients = interviews.map(interview => ({
      email: interview.candidateEmail,
      variables: {
        candidateName: interview.candidateName,
        time: interview.interviewTime,
        location: interview.location,
        companyName: 'Công ty ABC'
      }
    }));

    return await emailSmsService.sendBulkEmails(recipients, 'interview_scheduled');
  }

  async sendBulkTaskReminders(tasks) {
    const recipients = tasks.map(task => ({
      email: task.internEmail,
      variables: {
        internName: task.internName,
        taskTitle: task.taskTitle,
        hours: '24',
        companyName: 'Công ty ABC'
      }
    }));

    return await emailSmsService.sendBulkEmails(recipients, 'task_deadline');
  }

  // Get communication statistics
  getCommunicationStats() {
    return {
      ...emailSmsService.getQueueStatus(),
      emailHistory: emailSmsService.getEmailHistory(10),
      smsHistory: emailSmsService.getSmsHistory(10)
    };
  }
}

// Create singleton instance
const workflowIntegration = new WorkflowIntegration();

export default workflowIntegration;
