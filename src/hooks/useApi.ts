// React Query Hooks for API Services
// This file provides React Query hooks for all API operations with caching and state management

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiService, User, Job, Application, Interview, Offer, Employee } from '@/services/apiService';
import { APIError } from '@/lib/api';

// Query keys factory
export const queryKeys = {
  // Auth queries
  auth: {
    current: ['auth', 'current'] as const,
  },

  // Jobs queries
  jobs: {
    all: ['jobs'] as const,
    lists: () => [...queryKeys.jobs.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.jobs.lists(), filters] as const,
    details: () => [...queryKeys.jobs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.jobs.details(), id] as const,
  },

  // Applications queries
  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.applications.lists(), filters] as const,
    details: () => [...queryKeys.applications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.applications.details(), id] as const,
    my: () => [...queryKeys.applications.all, 'my'] as const,
    byJob: (jobId: string) => [...queryKeys.applications.all, 'job', jobId] as const,
  },

  // Interviews queries
  interviews: {
    all: ['interviews'] as const,
    lists: () => [...queryKeys.interviews.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.interviews.lists(), filters] as const,
    details: () => [...queryKeys.interviews.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.interviews.details(), id] as const,
    my: () => [...queryKeys.interviews.all, 'my'] as const,
  },

  // Offers queries
  offers: {
    all: ['offers'] as const,
    lists: () => [...queryKeys.offers.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.offers.lists(), filters] as const,
    details: () => [...queryKeys.offers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.offers.details(), id] as const,
    my: () => [...queryKeys.offers.all, 'my'] as const,
  },

  // Users queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
} as const;

// Default query options
const defaultQueryOptions = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 10, // 10 minutes
  retry: (failureCount: number, error: APIError) => {
    // Don't retry on authentication errors
    if (error.status === 401 || error.status === 403) return false;
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// Default mutation options
const defaultMutationOptions = {
  retry: 1,
  onError: (error: APIError) => {
    console.error('Mutation error:', error);
  },
};

// Auth Hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  const getCurrentUserQuery = useQuery<User, APIError>({
    queryKey: queryKeys.auth.current,
    queryFn: () => apiService.auth.getCurrentUser().then(res => res.data),
    enabled: apiService.auth.isAuthenticated(),
    ...defaultQueryOptions,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.auth.login(email, password),
    onSuccess: () => {
      // Invalidate current user query to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.current });
    },
    ...defaultMutationOptions,
  });

  const registerMutation = useMutation({
    mutationFn: (userData: any) => apiService.auth.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.current });
    },
    ...defaultMutationOptions,
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (passwordData: any) => apiService.auth.updatePassword(passwordData),
    ...defaultMutationOptions,
  });

  const logout = () => {
    apiService.auth.logout();
    queryClient.setQueryData(queryKeys.auth.current, null);
    queryClient.clear();
  };

  return {
    user: getCurrentUserQuery.data,
    isLoading: getCurrentUserQuery.isLoading,
    error: getCurrentUserQuery.error,
    isAuthenticated: !!getCurrentUserQuery.data,
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    registerLoading: registerMutation.isPending,
    updatePassword: updatePasswordMutation.mutateAsync,
    updatePasswordLoading: updatePasswordMutation.isPending,
    logout,
  };
};

// Jobs Hooks
export const useJobs = (filters?: any, options?: UseQueryOptions<Job[], APIError>) => {
  return useQuery<Job[], APIError>({
    queryKey: queryKeys.jobs.list(filters || {}),
    queryFn: () => apiService.jobs.getJobs(filters).then(res => res.data),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useJob = (id: string, options?: UseQueryOptions<Job, APIError>) => {
  return useQuery<Job, APIError>({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => apiService.jobs.getJobById(id).then(res => res.data),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobData: any) => apiService.jobs.createJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
    ...defaultMutationOptions,
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, jobData }: { id: string; jobData: any }) =>
      apiService.jobs.updateJob(id, jobData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(id) });
    },
    ...defaultMutationOptions,
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.jobs.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
    ...defaultMutationOptions,
  });
};

export const useToggleJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.jobs.toggleJobStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(id) });
    },
    ...defaultMutationOptions,
  });
};

// Applications Hooks
export const useApplications = (filters?: any, options?: UseQueryOptions<Application[], APIError>) => {
  return useQuery<Application[], APIError>({
    queryKey: queryKeys.applications.list(filters || {}),
    queryFn: () => apiService.applications.getApplications(filters).then(res => res.data),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useApplication = (id: string, options?: UseQueryOptions<Application, APIError>) => {
  return useQuery<Application, APIError>({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => apiService.applications.getApplicationById(id).then(res => res.data),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useMyApplications = (options?: UseQueryOptions<Application[], APIError>) => {
  const { isAuthenticated } = useAuth();
  return useQuery<Application[], APIError>({
    queryKey: queryKeys.applications.my(),
    queryFn: () => apiService.applications.getMyApplications().then(res => res.data),
    enabled: isAuthenticated,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useJobApplications = (jobId: string, options?: UseQueryOptions<Application[], APIError>) => {
  return useQuery<Application[], APIError>({
    queryKey: queryKeys.applications.byJob(jobId),
    queryFn: () => apiService.applications.getJobApplications(jobId).then(res => res.data),
    enabled: !!jobId,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useApplyForJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationData: any) => apiService.applications.applyForJob(applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.my() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
    ...defaultMutationOptions,
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: any }) =>
      apiService.applications.updateApplication(id, updateData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.my() });
    },
    ...defaultMutationOptions,
  });
};

// Interviews Hooks
export const useInterviews = (filters?: any, options?: UseQueryOptions<Interview[], APIError>) => {
  return useQuery<Interview[], APIError>({
    queryKey: queryKeys.interviews.list(filters || {}),
    queryFn: () => apiService.interviews.getInterviews(filters).then(res => res.data),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useInterview = (id: string, options?: UseQueryOptions<Interview, APIError>) => {
  return useQuery<Interview, APIError>({
    queryKey: queryKeys.interviews.detail(id),
    queryFn: () => apiService.interviews.getInterviewById(id).then(res => res.data),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useMyInterviews = (options?: UseQueryOptions<Interview[], APIError>) => {
  return useQuery<Interview[], APIError>({
    queryKey: queryKeys.interviews.my(),
    queryFn: () => apiService.interviews.getMyInterviews().then(res => res.data),
    enabled: apiService.auth.isAuthenticated(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interviewData: any) => apiService.interviews.scheduleInterview(interviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
    },
    ...defaultMutationOptions,
  });
};

export const useUpdateInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: any }) =>
      apiService.interviews.updateInterview(id, updateData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.my() });
    },
    ...defaultMutationOptions,
  });
};

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.interviews.deleteInterview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.my() });
    },
    ...defaultMutationOptions,
  });
};

// Offers Hooks
export const useOffers = (filters?: any, options?: UseQueryOptions<Offer[], APIError>) => {
  return useQuery<Offer[], APIError>({
    queryKey: queryKeys.offers.list(filters || {}),
    queryFn: () => apiService.offers.getOffers(filters).then(res => res.data),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useOffer = (id: string, options?: UseQueryOptions<Offer, APIError>) => {
  return useQuery<Offer, APIError>({
    queryKey: queryKeys.offers.detail(id),
    queryFn: () => apiService.offers.getOfferById(id).then(res => res.data),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useMyOffers = (options?: UseQueryOptions<Offer[], APIError>) => {
  return useQuery<Offer[], APIError>({
    queryKey: queryKeys.offers.my(),
    queryFn: () => apiService.offers.getMyOffers().then(res => res.data),
    enabled: apiService.auth.isAuthenticated(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerData: any) => apiService.offers.createOffer(offerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
    },
    ...defaultMutationOptions,
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: any }) =>
      apiService.offers.updateOffer(id, updateData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.my() });
    },
    ...defaultMutationOptions,
  });
};

// Employees Hooks
export const useEmployees = (filters?: any, options?: UseQueryOptions<Employee[], APIError>) => {
  return useQuery<Employee[], APIError>({
    queryKey: ['employees', 'list', filters],
    queryFn: () => apiService.employees.getEmployees(filters).then(res => res.data),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useEmployee = (id: string, options?: UseQueryOptions<Employee, APIError>) => {
  return useQuery<Employee, APIError>({
    queryKey: ['employees', 'detail', id],
    queryFn: () => apiService.employees.getEmployeeById(id).then(res => res.data),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, employeeData }: { id: string; employeeData: any }) =>
      apiService.employees.updateEmployee(id, employeeData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    ...defaultMutationOptions,
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.employees.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    ...defaultMutationOptions,
  });
};

// Users Hooks
export const useUsers = (filters?: any, options?: UseQueryOptions<User[], APIError>) => {
  return useQuery<User[], APIError>({
    queryKey: queryKeys.users.list(filters || {}),
    queryFn: () => apiService.users.getAllUsers(filters).then(res => res.data),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useUser = (id: string, options?: UseQueryOptions<User, APIError>) => {
  return useQuery<User, APIError>({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => apiService.users.getUserById(id).then(res => res.data),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: any) => apiService.users.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
    ...defaultMutationOptions,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: any }) =>
      apiService.users.updateUser(id, userData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.current });
    },
    ...defaultMutationOptions,
  });
};

// System Hooks
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: () => apiService.system.healthCheck(),
    retry: false,
    refetchInterval: 1000 * 60 * 5, // Check every 5 minutes
  });
};

const apiHooks = {
  // Auth
  useAuth,

  // Jobs
  useJobs,
  useJob,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useToggleJobStatus,

  // Applications
  useApplications,
  useApplication,
  useMyApplications,
  useJobApplications,
  useApplyForJob,
  useUpdateApplication,

  // Interviews
  useInterviews,
  useInterview,
  useMyInterviews,
  useScheduleInterview,
  useUpdateInterview,
  useDeleteInterview,

  // Offers
  useOffers,
  useOffer,
  useMyOffers,
  useCreateOffer,
  useUpdateOffer,

  // Employees Hooks
  useEmployees,
  useEmployee,
  useUpdateEmployee,
  useDeleteEmployee,

  // Users
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,

  // System
  useHealthCheck,
};

export default apiHooks;
