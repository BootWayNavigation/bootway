// Legacy API Client - DEPRECATED
// This file is kept for backward compatibility
// Please use the new API services from '@/services/apiService' instead

import { apiService } from '@/services/apiService';

// Re-export all API functions from the new service layer
export const getJobs = () => apiService.jobs.getJobs();
export const getJobById = (jobId: string) => apiService.jobs.getJobById(jobId);
export const createJob = (jobData: any) => apiService.jobs.createJob(jobData);
export const updateJob = (jobId: string, jobData: any) => apiService.jobs.updateJob(jobId, jobData);
export const deleteJob = (jobId: string) => apiService.jobs.deleteJob(jobId);
export const toggleJobStatus = (jobId: string) => apiService.jobs.toggleJobStatus(jobId);

export const register = (userData: any) => apiService.auth.register(userData);
export const login = (email: string, password: string) => apiService.auth.login(email, password);
export const getCurrentUser = () => apiService.auth.getCurrentUser();
export const updatePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => 
  apiService.auth.updatePassword({ currentPassword, newPassword, confirmPassword });

export const getAllUsers = (role?: string) => apiService.users.getAllUsers({ role });
export const getUserById = (userId: string) => apiService.users.getUserById(userId);
export const createUser = (userData: any) => apiService.users.createUser(userData);
export const updateUser = (userId: string, userData: any) => apiService.users.updateUser(userId, userData);
export const deleteUser = (userId: string) => apiService.users.deleteUser(userId);

export const getApplications = (filters?: any) => apiService.applications.getApplications(filters);
export const getApplicationById = (appId: string) => apiService.applications.getApplicationById(appId);
export const applyForJob = (applicationData: any) => apiService.applications.applyForJob(applicationData);
export const updateApplication = (appId: string, updateData: any) => apiService.applications.updateApplication(appId, updateData);
export const deleteApplication = (appId: string) => apiService.applications.deleteApplication(appId);
export const getJobApplications = (jobId: string) => apiService.applications.getJobApplications(jobId);
export const getMyApplications = () => apiService.applications.getMyApplications();

export const getInterviews = (filters?: any) => apiService.interviews.getInterviews(filters);
export const getInterviewById = (interviewId: string) => apiService.interviews.getInterviewById(interviewId);
export const scheduleInterview = (interviewData: any) => apiService.interviews.scheduleInterview(interviewData);
export const updateInterview = (interviewId: string, updateData: any) => apiService.interviews.updateInterview(interviewId, updateData);
export const deleteInterview = (interviewId: string) => apiService.interviews.deleteInterview(interviewId);
export const getMyInterviews = () => apiService.interviews.getMyInterviews();

export const getOffers = (filters?: any) => apiService.offers.getOffers(filters);
export const getOfferById = (offerId: string) => apiService.offers.getOfferById(offerId);
export const createOffer = (offerData: any) => apiService.offers.createOffer(offerData);
export const updateOffer = (offerId: string, updateData: any) => apiService.offers.updateOffer(offerId, updateData);
export const deleteOffer = (offerId: string) => apiService.offers.deleteOffer(offerId);
export const getMyOffers = () => apiService.offers.getMyOffers();

// Export the new API service as default
export default apiService;

