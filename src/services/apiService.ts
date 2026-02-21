// API Service Layer
// This file provides a clean interface for all backend API operations

import { api, API_ENDPOINTS, TokenManager, ApiResponse, AuthResponse, API_CONFIG } from '@/lib/api';

// Helper function to check if user has admin/hr access
export const isAdminOrHR = (user: User | null): boolean => {
  return !!user && (user.role === 'admin' || user.role === 'hr');
};

// Types for API responses
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'candidate' | 'hr' | 'admin'; // hr and admin have same privileges
  phone?: string;
  department?: string;
  position?: string;
  resume?: string;
  skills?: string[];
  experience?: number;
  bio?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  description: string;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: 'active' | 'closed';
  isActive: boolean;
  postedBy?: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  jobId: string;
  candidateId: string | null;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  resume?: string;
  coverLetter?: string;
  status: 'applied' | 'under-review' | 'shortlisted' | 'rejected' | 'interview' | 'offer' | 'selected';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  job?: Job;
  candidate?: User;
}

export interface Interview {
  _id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  scheduledBy: string;
  interviewType: 'phone' | 'video' | 'in-person' | 'group';
  scheduledDate: string;
  duration: number;
  interviewers: string[];
  meetingLink?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: string;
  rating?: number;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  application?: Application;
  job?: Job;
  candidate?: User;
}

export interface Offer {
  _id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  department: string;
  salary: number;
  currency: string;
  startDate: string;
  offerValidTill: string;
  jobDescription?: string;
  benefits: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  respondedAt?: string;
  rejectionReason?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
  // Populated fields
  application?: Application;
  job?: Job;
  candidate?: User;
}

export interface Employee {
  _id: string;
  user: User;
  employeeId: string;
  department: string;
  position: string;
  dateJoined: string;
  status: 'active' | 'probation' | 'terminated' | 'resigned' | 'on-leave';
  salary: {
    amount: number;
    currency: string;
  };
  personalDetails: {
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relation: string;
    };
    dateOfBirth?: string;
  };
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication Service
export const authService = {
  // Register new user
  async register(userData: {
    fullName: string;
    email: string;
    password: string;
    passwordConfirm: string;
    role?: 'candidate' | 'hr' | 'admin';
    phone?: string;
  }) {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData) as any;
    if (response.success && response.token) {
      TokenManager.setToken(response.token);
    }
    return response;
  },

  // Login user
  async login(email: string, password: string) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password }) as any;
    if (response.success && response.token) {
      TokenManager.setToken(response.token);
    }
    return response;
  },

  // Get current user
  async getCurrentUser() {
    return api.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  // Update password
  async updatePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    return api.put(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, passwordData);
  },

  async forgotPassword(email: string) {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  async resetPassword(token: string, passwordData: any) {
    return api.put(API_ENDPOINTS.AUTH.RESET_PASSWORD(token), passwordData);
  },

  // Logout user
  logout() {
    TokenManager.removeToken();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return TokenManager.isAuthenticated() && !TokenManager.isTokenExpired();
  },
};

// Jobs Service
export const jobsService = {
  // Get all jobs with optional filters
  async getJobs(filters?: {
    status?: string;
    department?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return api.get<Job[]>(API_ENDPOINTS.JOBS.LIST, filters);
  },

  // Get single job by ID
  async getJobById(id: string) {
    return api.get<Job>(API_ENDPOINTS.JOBS.DETAIL(id));
  },

  // Create new job (HR/Admin only)
  async createJob(jobData: {
    title: string;
    department: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    salary?: string;
    description: string;
    skills: string[];
    requirements: string[];
    responsibilities: string[];
    benefits?: string[];
  }) {
    return api.post<Job>(API_ENDPOINTS.JOBS.CREATE, jobData);
  },

  // Update job (HR/Admin only)
  async updateJob(id: string, jobData: Partial<Job>) {
    return api.put<Job>(API_ENDPOINTS.JOBS.UPDATE(id), jobData);
  },

  // Delete job (HR/Admin only)
  async deleteJob(id: string) {
    return api.delete(API_ENDPOINTS.JOBS.DELETE(id));
  },

  // Toggle job status (HR/Admin only)
  async toggleJobStatus(id: string) {
    return api.patch<Job>(API_ENDPOINTS.JOBS.TOGGLE_STATUS(id));
  },
};

// Applications Service
export const applicationsService = {
  // Get all applications with filters
  async getApplications(filters?: {
    jobId?: string;
    candidateId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return api.get<Application[]>(API_ENDPOINTS.APPLICATIONS.LIST, filters);
  },

  // Get single application by ID
  async getApplicationById(id: string) {
    return api.get<Application>(API_ENDPOINTS.APPLICATIONS.DETAIL(id));
  },

  // Apply for a job (public endpoint - no auth required)
  async applyForJob(applicationData: {
    jobId: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone?: string;
    resume?: File;
    coverLetter?: string;
  }) {
    // Use FormData for file uploads
    const formData = new FormData();

    // Add all fields to FormData
    formData.append('jobId', applicationData.jobId);
    formData.append('candidateName', applicationData.candidateName);
    formData.append('candidateEmail', applicationData.candidateEmail);
    if (applicationData.candidatePhone) {
      formData.append('candidatePhone', applicationData.candidatePhone);
    }
    if (applicationData.coverLetter) {
      formData.append('coverLetter', applicationData.coverLetter);
    }

    // Add file if provided
    if (applicationData.resume) {
      formData.append('resume', applicationData.resume);
    }

    // Debug FormData contents
    console.log('📤 FormData contents being sent:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes, ${value.type})` : value);
    }

    const headers: HeadersInit = {};
    const token = TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.APPLICATIONS.CREATE}`, {
      method: 'POST',
      headers,
      // Don't set Content-Type header - let browser set it with boundary for FormData
      body: formData,
    });

    const responseText = await response.text();
    let responseData: ApiResponse<Application>;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = {
        success: false,
        message: 'Invalid JSON response from server',
        data: {
          _id: '',
          jobId: '',
          candidateId: null,
          candidateName: '',
          candidateEmail: '',
          candidatePhone: '',
          resume: '',
          coverLetter: '',
          status: 'applied',
          appliedAt: new Date().toISOString(),
          reviewedAt: undefined,
          reviewedBy: undefined,
          notes: undefined,
          rating: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    if (!response.ok) {
      throw new Error(responseData.message || 'Unknown API error');
    }

    // Ensure the response has the required data property
    if (responseData.success && !responseData.data) {
      responseData.data = {
        _id: '',
        jobId: '',
        candidateId: null,
        candidateName: '',
        candidateEmail: '',
        candidatePhone: '',
        resume: '',
        coverLetter: '',
        status: 'applied',
        appliedAt: new Date().toISOString(),
        reviewedAt: undefined,
        reviewedBy: undefined,
        notes: undefined,
        rating: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return responseData;
  },

  // Update application (HR/Admin only)
  async updateApplication(id: string, updateData: {
    status?: string;
    notes?: string;
    rating?: number;
    reviewedBy?: string;
  }) {
    return api.put<Application>(API_ENDPOINTS.APPLICATIONS.UPDATE(id), updateData);
  },

  // Delete application (HR/Admin only)
  async deleteApplication(id: string) {
    return api.delete(API_ENDPOINTS.APPLICATIONS.DELETE(id));
  },

  // Get applications for a specific job
  async getJobApplications(jobId: string) {
    return api.get<Application[]>(API_ENDPOINTS.APPLICATIONS.BY_JOB(jobId));
  },

  // Get current user's applications
  async getMyApplications() {
    return api.get<Application[]>(API_ENDPOINTS.APPLICATIONS.MY_APPLICATIONS);
  },
};

// Interviews Service
export const interviewsService = {
  // Get all interviews with filters
  async getInterviews(filters?: {
    jobId?: string;
    candidateId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return api.get<Interview[]>(API_ENDPOINTS.INTERVIEWS.LIST, filters);
  },

  // Get single interview by ID
  async getInterviewById(id: string) {
    return api.get<Interview>(API_ENDPOINTS.INTERVIEWS.DETAIL(id));
  },

  // Schedule interview (HR/Admin only)
  async scheduleInterview(interviewData: {
    applicationId: string;
    jobId: string;
    candidateId: string;
    interviewType?: 'phone' | 'video' | 'in-person' | 'group';
    scheduledDate: string;
    duration?: number;
    interviewers?: string[];
    meetingLink?: string;
    location?: string;
  }) {
    return api.post<Interview>(API_ENDPOINTS.INTERVIEWS.CREATE, interviewData);
  },

  // Update interview (HR/Admin only)
  async updateInterview(id: string, updateData: {
    status?: string;
    feedback?: string;
    rating?: number;
    notes?: string;
    scheduledDate?: string;
    interviewers?: string[];
  }) {
    return api.put<Interview>(API_ENDPOINTS.INTERVIEWS.UPDATE(id), updateData);
  },

  // Delete interview (HR/Admin only)
  async deleteInterview(id: string) {
    return api.delete(API_ENDPOINTS.INTERVIEWS.DELETE(id));
  },

  // Get current user's interviews
  async getMyInterviews() {
    return api.get<Interview[]>(API_ENDPOINTS.INTERVIEWS.MY_INTERVIEWS);
  },
};

// Offers Service
export const offersService = {
  // Get all offers with filters
  async getOffers(filters?: {
    status?: string;
    candidateId?: string;
    page?: number;
    limit?: number;
  }) {
    return api.get<Offer[]>(API_ENDPOINTS.OFFERS.LIST, filters);
  },

  // Get single offer by ID
  async getOfferById(id: string) {
    return api.get<Offer>(API_ENDPOINTS.OFFERS.DETAIL(id));
  },

  // Create offer (HR/Admin only)
  async createOffer(offerData: {
    applicationId: string;
    jobId: string;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    position: string;
    department: string;
    salary: number;
    currency?: string;
    startDate: string;
    offerValidTill: string;
    jobDescription?: string;
    benefits?: string[];
    documents?: string[];
  }) {
    return api.post<Offer>(API_ENDPOINTS.OFFERS.CREATE, offerData);
  },

  // Update offer (HR/Admin only)
  async updateOffer(id: string, updateData: {
    status?: string;
    rejectionReason?: string;
    respondedAt?: string;
  }) {
    return api.put<Offer>(API_ENDPOINTS.OFFERS.UPDATE(id), updateData);
  },

  // Delete offer (HR/Admin only)
  async deleteOffer(id: string) {
    return api.delete(API_ENDPOINTS.OFFERS.DELETE(id));
  },

  // Get current user's offers
  async getMyOffers() {
    return api.get<Offer[]>(API_ENDPOINTS.OFFERS.MY_OFFERS);
  },
};

// Employees Service
export const employeesService = {
  // Get all employees
  async getEmployees(filters?: { search?: string }) {
    return api.get<Employee[]>(API_ENDPOINTS.EMPLOYEES.LIST, filters);
  },

  // Get single employee
  async getEmployeeById(id: string) {
    return api.get<Employee>(API_ENDPOINTS.EMPLOYEES.DETAIL(id));
  },

  // Update employee
  async updateEmployee(id: string, employeeData: any) {
    return api.put<Employee>(API_ENDPOINTS.EMPLOYEES.UPDATE(id), employeeData);
  },

  // Delete employee
  async deleteEmployee(id: string) {
    return api.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id));
  },
};

// Users Service
export const usersService = {
  // Get all users with filters
  async getAllUsers(filters?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return api.get<User[]>(API_ENDPOINTS.USERS.LIST, filters);
  },

  // Get user by ID
  async getUserById(id: string) {
    return api.get<User>(API_ENDPOINTS.USERS.DETAIL(id));
  },

  // Create user (Admin only)
  async createUser(userData: {
    fullName: string;
    email: string;
    password: string;
    role: 'candidate' | 'hr' | 'admin';
    phone?: string;
  }) {
    return api.post<User>(API_ENDPOINTS.USERS.CREATE, userData);
  },

  // Update user
  async updateUser(id: string, userData: {
    fullName?: string;
    phone?: string;
    bio?: string;
    skills?: string[];
    experience?: number;
  }) {
    return api.put<User>(API_ENDPOINTS.USERS.UPDATE(id), userData);
  },

  // Delete user (Admin only)
  async deleteUser(id: string) {
    return api.delete(API_ENDPOINTS.USERS.DELETE(id));
  },
};

// System Service
export const systemService = {
  // Health check
  async healthCheck() {
    return api.health();
  },
};

// Export all services
export const apiService = {
  auth: authService,
  jobs: jobsService,
  applications: applicationsService,
  interviews: interviewsService,
  offers: offersService,
  employees: employeesService,
  users: usersService,
  system: systemService,
};

export default apiService;
