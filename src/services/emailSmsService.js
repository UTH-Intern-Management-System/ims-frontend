// Mock Email/SMS Service for IMS
class EmailSmsService {
  constructor() {
    this.emailQueue = [];
    this.smsQueue = [];
    this.sentEmails = [];
    this.sentSms = [];
    this.templates = this.initializeTemplates();
    this.isProcessing = false;
  }

  // Initialize email/SMS templates
  initializeTemplates() {
    return {
      email: {
        interview_scheduled: {
          subject: 'Lịch phỏng vấn thực tập - {companyName}',
          body: `
            Xin chào {candidateName},
            
            Chúng tôi rất vui mừng thông báo rằng bạn đã được lên lịch phỏng vấn cho vị trí thực tập tại {companyName}.
            
            Thông tin chi tiết:
            - Thời gian: {interviewDate} lúc {interviewTime}
            - Địa điểm: {location}
            - Người phỏng vấn: {interviewer}
            - Hình thức: {format}
            
            Vui lòng xác nhận tham dự và chuẩn bị các tài liệu cần thiết.
            
            Trân trọng,
            Đội ngũ HR {companyName}
          `
        },
        intern_accepted: {
          subject: 'Chúc mừng! Bạn đã được nhận vào chương trình thực tập',
          body: `
            Xin chào {internName},
            
            Chúc mừng! Bạn đã được chính thức nhận vào chương trình thực tập tại {companyName}.
            
            Thông tin bắt đầu:
            - Ngày bắt đầu: {startDate}
            - Phòng ban: {department}
            - Mentor: {mentorName}
            - Địa điểm làm việc: {workLocation}
            
            Vui lòng liên hệ với HR để hoàn tất thủ tục.
            
            Chào mừng bạn đến với đại gia đình {companyName}!
          `
        },
        task_assigned: {
          subject: 'Nhiệm vụ mới được giao - {taskTitle}',
          body: `
            Xin chào {internName},
            
            Bạn đã được giao một nhiệm vụ mới:
            
            Tiêu đề: {taskTitle}
            Mô tả: {taskDescription}
            Hạn chót: {dueDate}
            Độ ưu tiên: {priority}
            
            Vui lòng truy cập hệ thống để xem chi tiết và cập nhật tiến độ.
            
            Chúc bạn hoàn thành tốt!
          `
        },
        assessment_reminder: {
          subject: 'Nhắc nhở: Đánh giá kỹ năng định kỳ',
          body: `
            Xin chào {internName},
            
            Đây là lời nhắc nhở về buổi đánh giá kỹ năng định kỳ:
            
            - Thời gian: {assessmentDate}
            - Mentor đánh giá: {mentorName}
            - Kỹ năng được đánh giá: {skills}
            
            Vui lòng chuẩn bị và tham gia đầy đủ.
          `
        },
        feedback_request: {
          subject: 'Yêu cầu phản hồi về chương trình thực tập',
          body: `
            Xin chào {internName},
            
            Chúng tôi mong muốn nhận được phản hồi của bạn về:
            - Chương trình đào tạo
            - Sự hỗ trợ từ mentor
            - Môi trường làm việc
            - Đề xuất cải thiện
            
            Vui lòng truy cập hệ thống để gửi phản hồi.
            
            Cảm ơn bạn!
          `
        }
      },
      sms: {
        interview_reminder: 'Nhắc nhở: Phỏng vấn thực tập ngày mai lúc {time} tại {location}. Vui lòng đến đúng giờ. - {companyName}',
        task_deadline: 'Nhắc nhở: Nhiệm vụ "{taskTitle}" sẽ hết hạn trong {hours} giờ. Vui lòng hoàn thành. - {companyName}',
        assessment_today: 'Hôm nay bạn có buổi đánh giá kỹ năng lúc {time} với {mentorName}. Chúc bạn thành công! - {companyName}',
        welcome_intern: 'Chào mừng {internName} đến với {companyName}! Ngày đầu tiên: {startDate}. Chúc bạn có trải nghiệm tuyệt vời!',
        urgent_notification: 'Thông báo khẩn: {message}. Vui lòng kiểm tra hệ thống ngay. - {companyName}'
      }
    };
  }

  // Send email
  async sendEmail(to, templateKey, variables = {}, options = {}) {
    const template = this.templates.email[templateKey];
    if (!template) {
      throw new Error(`Email template '${templateKey}' not found`);
    }

    const email = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      to,
      subject: this.replaceVariables(template.subject, variables),
      body: this.replaceVariables(template.body, variables),
      templateKey,
      variables,
      priority: options.priority || 'normal',
      scheduledAt: options.scheduledAt || new Date().toISOString(),
      status: 'queued',
      attempts: 0,
      createdAt: new Date().toISOString()
    };

    this.emailQueue.push(email);
    console.log(`Email queued: ${email.subject} to ${to}`);

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }

    return email.id;
  }

  // Send SMS
  async sendSms(to, templateKey, variables = {}, options = {}) {
    const template = this.templates.sms[templateKey];
    if (!template) {
      throw new Error(`SMS template '${templateKey}' not found`);
    }

    const sms = {
      id: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      to,
      message: this.replaceVariables(template, variables),
      templateKey,
      variables,
      priority: options.priority || 'normal',
      scheduledAt: options.scheduledAt || new Date().toISOString(),
      status: 'queued',
      attempts: 0,
      createdAt: new Date().toISOString()
    };

    this.smsQueue.push(sms);
    console.log(`SMS queued: ${sms.message.substring(0, 50)}... to ${to}`);

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }

    return sms.id;
  }

  // Replace template variables
  replaceVariables(template, variables) {
    let result = template;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, variables[key] || '');
    });
    return result;
  }

  // Process email/SMS queue
  async processQueue() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;

    try {
      // Process emails
      while (this.emailQueue.length > 0) {
        const email = this.emailQueue.shift();
        await this.simulateEmailSending(email);
      }

      // Process SMS
      while (this.smsQueue.length > 0) {
        const sms = this.smsQueue.shift();
        await this.simulateSmsSending(sms);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Simulate email sending
  async simulateEmailSending(email) {
    return new Promise((resolve) => {
      // Simulate network delay
      const delay = Math.random() * 2000 + 500; // 0.5-2.5 seconds
      
      setTimeout(() => {
        // Simulate success/failure (95% success rate)
        const success = Math.random() > 0.05;
        
        if (success) {
          email.status = 'sent';
          email.sentAt = new Date().toISOString();
          email.attempts++;
          
          this.sentEmails.push(email);
          console.log(`✅ Email sent successfully: ${email.subject}`);
          
          // Simulate email delivery confirmation after delay
          setTimeout(() => {
            email.status = 'delivered';
            email.deliveredAt = new Date().toISOString();
            console.log(`📧 Email delivered: ${email.subject}`);
          }, Math.random() * 5000 + 1000);
          
        } else {
          email.status = 'failed';
          email.failedAt = new Date().toISOString();
          email.attempts++;
          email.error = 'Simulated delivery failure';
          
          console.log(`❌ Email failed: ${email.subject}`);
          
          // Retry logic for failed emails
          if (email.attempts < 3) {
            email.status = 'retrying';
            setTimeout(() => {
              this.emailQueue.unshift(email); // Add back to front of queue
              if (!this.isProcessing) {
                this.processQueue();
              }
            }, 5000); // Retry after 5 seconds
          }
        }
        
        resolve(email);
      }, delay);
    });
  }

  // Simulate SMS sending
  async simulateSmsSending(sms) {
    return new Promise((resolve) => {
      // Simulate network delay
      const delay = Math.random() * 1500 + 300; // 0.3-1.8 seconds
      
      setTimeout(() => {
        // Simulate success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
          sms.status = 'sent';
          sms.sentAt = new Date().toISOString();
          sms.attempts++;
          
          this.sentSms.push(sms);
          console.log(`✅ SMS sent successfully to ${sms.to}`);
          
          // Simulate SMS delivery confirmation
          setTimeout(() => {
            sms.status = 'delivered';
            sms.deliveredAt = new Date().toISOString();
            console.log(`📱 SMS delivered to ${sms.to}`);
          }, Math.random() * 3000 + 500);
          
        } else {
          sms.status = 'failed';
          sms.failedAt = new Date().toISOString();
          sms.attempts++;
          sms.error = 'Simulated delivery failure';
          
          console.log(`❌ SMS failed to ${sms.to}`);
          
          // Retry logic for failed SMS
          if (sms.attempts < 3) {
            sms.status = 'retrying';
            setTimeout(() => {
              this.smsQueue.unshift(sms); // Add back to front of queue
              if (!this.isProcessing) {
                this.processQueue();
              }
            }, 3000); // Retry after 3 seconds
          }
        }
        
        resolve(sms);
      }, delay);
    });
  }

  // Get email/SMS history
  getEmailHistory(limit = 50) {
    return this.sentEmails
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  getSmsHistory(limit = 50) {
    return this.sentSms
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  // Get queue status
  getQueueStatus() {
    return {
      emailQueue: this.emailQueue.length,
      smsQueue: this.smsQueue.length,
      isProcessing: this.isProcessing,
      totalEmailsSent: this.sentEmails.length,
      totalSmsSent: this.sentSms.length
    };
  }

  // Bulk send emails
  async sendBulkEmails(recipients, templateKey, variables = {}, options = {}) {
    const emailIds = [];
    
    for (const recipient of recipients) {
      const emailId = await this.sendEmail(
        recipient.email, 
        templateKey, 
        { ...variables, ...recipient.variables }, 
        options
      );
      emailIds.push(emailId);
    }
    
    return emailIds;
  }

  // Schedule email/SMS for later
  scheduleEmail(to, templateKey, variables, scheduledAt) {
    return this.sendEmail(to, templateKey, variables, { scheduledAt });
  }

  scheduleSms(to, templateKey, variables, scheduledAt) {
    return this.sendSms(to, templateKey, variables, { scheduledAt });
  }
}

// Create singleton instance
const emailSmsService = new EmailSmsService();

export default emailSmsService;
