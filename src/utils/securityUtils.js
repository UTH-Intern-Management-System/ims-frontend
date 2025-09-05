// Security Utilities for Input Validation, XSS Protection, and CSRF Protection
import DOMPurify from 'dompurify';

// Input Validation Utilities
export class InputValidator {
  static patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^\d+$/,
    vietnameseText: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/
  };

  static validate(value, type, options = {}) {
    const { required = false, minLength, maxLength, customPattern } = options;

    // Check if required
    if (required && (!value || value.toString().trim() === '')) {
      return { isValid: false, error: 'Trường này là bắt buộc' };
    }

    // If not required and empty, return valid
    if (!required && (!value || value.toString().trim() === '')) {
      return { isValid: true };
    }

    const stringValue = value.toString().trim();

    // Check length constraints
    if (minLength && stringValue.length < minLength) {
      return { isValid: false, error: `Tối thiểu ${minLength} ký tự` };
    }

    if (maxLength && stringValue.length > maxLength) {
      return { isValid: false, error: `Tối đa ${maxLength} ký tự` };
    }

    // Check pattern
    const pattern = customPattern || this.patterns[type];
    if (pattern && !pattern.test(stringValue)) {
      return { isValid: false, error: this.getErrorMessage(type) };
    }

    // Additional validations
    switch (type) {
      case 'email':
        return this.validateEmail(stringValue);
      case 'password':
        return this.validatePassword(stringValue, options);
      case 'phone':
        return this.validatePhone(stringValue);
      case 'date':
        return this.validateDate(stringValue, options);
      case 'number':
        return this.validateNumber(value, options);
      default:
        return { isValid: true };
    }
  }

  static validateEmail(email) {
    if (!this.patterns.email.test(email)) {
      return { isValid: false, error: 'Email không hợp lệ' };
    }

    // Check for common typos
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    
    if (domain && !commonDomains.includes(domain)) {
      // Could add domain validation here
    }

    return { isValid: true };
  }

  static validatePassword(password, options = {}) {
    const { 
      minLength = 8, 
      requireUppercase = true, 
      requireLowercase = true, 
      requireNumbers = true, 
      requireSpecialChars = true 
    } = options;

    const errors = [];

    if (password.length < minLength) {
      errors.push(`Tối thiểu ${minLength} ký tự`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Phải có ít nhất 1 chữ hoa');
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Phải có ít nhất 1 chữ thường');
    }

    if (requireNumbers && !/\d/.test(password)) {
      errors.push('Phải có ít nhất 1 số');
    }

    if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
      errors.push('Phải có ít nhất 1 ký tự đặc biệt');
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('Mật khẩu quá yếu');
    }

    return {
      isValid: errors.length === 0,
      error: errors.join(', '),
      strength: this.calculatePasswordStrength(password)
    };
  }

  static calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    if (password.length >= 16) score += 1;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  static validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 15) {
      return { isValid: false, error: 'Số điện thoại không hợp lệ' };
    }

    // Vietnam phone number validation
    if (cleaned.startsWith('84') || cleaned.startsWith('0')) {
      const vnPattern = /^(84|0)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
      if (!vnPattern.test(cleaned)) {
        return { isValid: false, error: 'Số điện thoại Việt Nam không hợp lệ' };
      }
    }

    return { isValid: true };
  }

  static validateDate(dateString, options = {}) {
    const { minDate, maxDate, format = 'YYYY-MM-DD' } = options;
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Ngày không hợp lệ' };
    }

    if (minDate && date < new Date(minDate)) {
      return { isValid: false, error: `Ngày phải sau ${minDate}` };
    }

    if (maxDate && date > new Date(maxDate)) {
      return { isValid: false, error: `Ngày phải trước ${maxDate}` };
    }

    return { isValid: true };
  }

  static validateNumber(value, options = {}) {
    const { min, max, integer = false } = options;
    const num = parseFloat(value);

    if (isNaN(num)) {
      return { isValid: false, error: 'Phải là số' };
    }

    if (integer && !Number.isInteger(num)) {
      return { isValid: false, error: 'Phải là số nguyên' };
    }

    if (min !== undefined && num < min) {
      return { isValid: false, error: `Phải >= ${min}` };
    }

    if (max !== undefined && num > max) {
      return { isValid: false, error: `Phải <= ${max}` };
    }

    return { isValid: true };
  }

  static getErrorMessage(type) {
    const messages = {
      email: 'Email không hợp lệ',
      phone: 'Số điện thoại không hợp lệ',
      password: 'Mật khẩu không đủ mạnh',
      username: 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới',
      url: 'URL không hợp lệ',
      alphanumeric: 'Chỉ chứa chữ và số',
      numeric: 'Chỉ chứa số',
      vietnameseText: 'Chỉ chứa chữ cái tiếng Việt'
    };

    return messages[type] || 'Dữ liệu không hợp lệ';
  }
}

// XSS Protection Utilities
export class XSSProtection {
  static sanitizeHTML(dirty) {
    if (typeof dirty !== 'string') return dirty;
    
    // Configure DOMPurify for Vietnamese content
    const config = {
      ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'u', 'br', 'p', 'div', 'span',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'img'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    };

    return DOMPurify.sanitize(dirty, config);
  }

  static escapeHTML(text) {
    if (typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static unescapeHTML(html) {
    if (typeof html !== 'string') return html;
    
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  static sanitizeUserInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  static validateFileUpload(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`Kích thước file tối đa ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('Loại file không được phép');
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errors.push('Phần mở rộng file không được phép');
    }

    // Check for potentially dangerous files
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.js', '.vbs'];
    if (dangerousExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      errors.push('File có thể nguy hiểm');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// CSRF Protection Utilities
export class CSRFProtection {
  static tokenKey = 'csrf_token';
  static tokenHeader = 'X-CSRF-Token';

  static generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static setToken(token = null) {
    const csrfToken = token || this.generateToken();
    sessionStorage.setItem(this.tokenKey, csrfToken);
    
    // Add to meta tag for easy access
    let metaTag = document.querySelector('meta[name="csrf-token"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      document.head.appendChild(metaTag);
    }
    metaTag.content = csrfToken;
    
    return csrfToken;
  }

  static getToken() {
    return sessionStorage.getItem(this.tokenKey) || 
           document.querySelector('meta[name="csrf-token"]')?.content;
  }

  static validateToken(token) {
    const storedToken = this.getToken();
    return storedToken && token === storedToken;
  }

  static addTokenToRequest(config) {
    const token = this.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers[this.tokenHeader] = token;
    }
    return config;
  }

  static setupAxiosInterceptor(axiosInstance) {
    // Request interceptor to add CSRF token
    axiosInstance.interceptors.request.use(
      (config) => {
        // Only add token to state-changing requests
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
          return this.addTokenToRequest(config);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle CSRF errors
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403 && error.response?.data?.error === 'CSRF_TOKEN_MISMATCH') {
          // Refresh token and retry
          this.setToken();
          const originalRequest = error.config;
          return axiosInstance.request(this.addTokenToRequest(originalRequest));
        }
        return Promise.reject(error);
      }
    );
  }
}

// Content Security Policy Utilities
export class CSPUtils {
  static generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  static setCSPHeader(nonce) {
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'unsafe-eval'`, // unsafe-eval needed for React dev
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' ws: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');

    // Add CSP meta tag
    let metaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.httpEquiv = 'Content-Security-Policy';
      document.head.appendChild(metaTag);
    }
    metaTag.content = csp;
  }
}

// Rate Limiting Utilities
export class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  isAllowed(key, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const userRequests = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  getRemainingRequests(key, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.requests.has(key)) {
      return maxRequests;
    }

    const userRequests = this.requests.get(key);
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, maxRequests - validRequests.length);
  }

  getResetTime(key, windowMs = 60000) {
    if (!this.requests.has(key)) {
      return null;
    }

    const userRequests = this.requests.get(key);
    if (userRequests.length === 0) {
      return null;
    }

    const oldestRequest = Math.min(...userRequests);
    return new Date(oldestRequest + windowMs);
  }
}

// Security Headers Utilities
export class SecurityHeaders {
  static setSecurityHeaders() {
    // X-Content-Type-Options
    this.setMetaTag('X-Content-Type-Options', 'nosniff');
    
    // X-Frame-Options
    this.setMetaTag('X-Frame-Options', 'DENY');
    
    // X-XSS-Protection
    this.setMetaTag('X-XSS-Protection', '1; mode=block');
    
    // Referrer-Policy
    this.setMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions-Policy
    this.setMetaTag('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  }

  static setMetaTag(name, content) {
    let metaTag = document.querySelector(`meta[http-equiv="${name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.httpEquiv = name;
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  }
}

// Audit Logging
export class SecurityAuditLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details: {
        ...details,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: sessionStorage.getItem('sessionId') || 'anonymous'
      }
    };

    this.logs.push(logEntry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('securityLogs', JSON.stringify(this.logs.slice(-100)));
    } catch (error) {
      console.warn('Could not save security logs:', error);
    }

    // Log critical events to console
    if (details.severity === 'high') {
      console.warn('Security Event:', logEntry);
    }
  }

  getLogs(filters = {}) {
    let filtered = [...this.logs];

    if (filters.event) {
      filtered = filtered.filter(log => log.event === filters.event);
    }

    if (filters.severity) {
      filtered = filtered.filter(log => log.details.severity === filters.severity);
    }

    if (filters.since) {
      const since = new Date(filters.since);
      filtered = filtered.filter(log => new Date(log.timestamp) >= since);
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  exportLogs() {
    const logs = this.getLogs();
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

// Initialize security utilities
export const rateLimiter = new RateLimiter();
export const auditLogger = new SecurityAuditLogger();

// Initialize security on app start
export const initializeSecurity = () => {
  // Set CSRF token
  CSRFProtection.setToken();
  
  // Set security headers
  SecurityHeaders.setSecurityHeaders();
  
  // Set CSP
  const nonce = CSPUtils.generateNonce();
  CSPUtils.setCSPHeader(nonce);
  
  // Log initialization
  auditLogger.log('security_initialized', {
    severity: 'low',
    message: 'Security utilities initialized'
  });
  
  return { nonce };
};

// React hooks for security
export const useInputValidation = (initialValues = {}) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);

  const validateField = React.useCallback((name, value, rules) => {
    const result = InputValidator.validate(value, rules.type, rules);
    
    setErrors(prev => ({
      ...prev,
      [name]: result.isValid ? null : result.error
    }));

    return result.isValid;
  }, []);

  const setValue = React.useCallback((name, value, rules) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (rules) {
      validateField(name, value, rules);
    }
  }, [validateField]);

  const validateAll = React.useCallback((validationRules) => {
    const newErrors = {};
    let allValid = true;

    Object.entries(validationRules).forEach(([name, rules]) => {
      const value = values[name];
      const result = InputValidator.validate(value, rules.type, rules);
      
      if (!result.isValid) {
        newErrors[name] = result.error;
        allValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(allValid);
    
    return allValid;
  }, [values]);

  return {
    values,
    errors,
    isValid,
    setValue,
    validateField,
    validateAll,
    reset: () => {
      setValues(initialValues);
      setErrors({});
      setIsValid(false);
    }
  };
};

export default {
  InputValidator,
  XSSProtection,
  CSRFProtection,
  CSPUtils,
  RateLimiter,
  SecurityHeaders,
  SecurityAuditLogger,
  rateLimiter,
  auditLogger,
  initializeSecurity,
  useInputValidation
};
