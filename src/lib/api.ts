// API Configuration and Setup
// This file centralizes all API configurations and provides a robust API client

// Helper to resolve Base URL
const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    // If no explicit API URL, dynamically build it based on the environment
    if (typeof window !== 'undefined') {
      // Browser can use relative paths
      url = '/api';
    } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      // Vercel Serverless Functions need absolute URLs
      url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`;
    } else {
      // Local development fallback
      url = 'http://localhost:3000/api';
    }
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Ensure we append /api if it isn't already pointing directly to the api endpoint
  if (!url.endsWith('/api') && typeof window === 'undefined') {
    url += '/api';
  }
  return url;
};

// API Base Configuration
export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  API_ENDPOINT: '',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Full API URL
export const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINT}`;

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PASSWORD: '/auth/updatePassword',
    FORGOT_PASSWORD: '/auth/forgotpassword',
    RESET_PASSWORD: (token: string) => `/auth/resetpassword/${token}`,
  },

  // Jobs
  JOBS: {
    LIST: '/jobs',
    DETAIL: (id: string) => `/jobs/${id}`,
    CREATE: '/jobs',
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    TOGGLE_STATUS: (id: string) => `/jobs/${id}/toggle`,
  },

  // Applications
  APPLICATIONS: {
    LIST: '/applications',
    DETAIL: (id: string) => `/applications/${id}`,
    CREATE: '/applications',
    UPDATE: (id: string) => `/applications/${id}`,
    DELETE: (id: string) => `/applications/${id}`,
    BY_JOB: (jobId: string) => `/applications/job/${jobId}`,
    MY_APPLICATIONS: '/applications/candidate/my-applications',
  },

  // Interviews
  INTERVIEWS: {
    LIST: '/interviews',
    DETAIL: (id: string) => `/interviews/${id}`,
    CREATE: '/interviews',
    UPDATE: (id: string) => `/interviews/${id}`,
    DELETE: (id: string) => `/interviews/${id}`,
    MY_INTERVIEWS: '/interviews/candidate/my-interviews',
  },

  // Offers
  OFFERS: {
    LIST: '/offers',
    DETAIL: (id: string) => `/offers/${id}`,
    CREATE: '/offers',
    UPDATE: (id: string) => `/offers/${id}`,
    DELETE: (id: string) => `/offers/${id}`,
    MY_OFFERS: '/offers/candidate/my-offers',
  },

  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  // Employees
  EMPLOYEES: {
    LIST: '/employees',
    DETAIL: (id: string) => `/employees/${id}`,
    UPDATE: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`,
  },

  // Health Check
  HEALTH: '/health',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Error Types
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Token Management
export const TokenManager = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Get token payload (decoded without verification)
  getTokenPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired(): boolean {
    const payload = this.getTokenPayload();
    if (!payload) return true;

    return payload.exp * 1000 < Date.now();
  },
};

// Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

// Authentication Response Type (has token at root level)
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: any;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  code?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  department?: string;
  type?: string;
  location?: string;
  role?: string;
}

// Request Builder
class RequestBuilder {
  private url: string;
  private options: RequestInit = {};
  private params: Record<string, any> = {};

  constructor(url: string) {
    this.url = url;
  }

  method(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'): this {
    this.options.method = method;
    return this;
  }

  body(data: any): this {
    this.options.body = JSON.stringify(data);
    return this;
  }

  headers(headers: Record<string, string>): this {
    this.options.headers = { ...this.options.headers, ...headers };
    return this;
  }

  query(params: Record<string, any>): this {
    this.params = { ...this.params, ...params };
    return this;
  }

  auth(token?: string): this {
    const authToken = token || TokenManager.getToken();
    if (authToken) {
      this.options.headers = {
        ...this.options.headers,
        Authorization: `Bearer ${authToken}`,
      };
    }
    return this;
  }

  build(): { url: string; options: RequestInit } {
    const queryString = new URLSearchParams(
      Object.entries(this.params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const finalUrl = queryString ? `${this.url}?${queryString}` : this.url;

    return {
      url: finalUrl,
      options: {
        ...this.options,
        headers: {
          'Content-Type': 'application/json',
          ...this.options.headers,
        },
      },
    };
  }
}

// Main API Client Class
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    endpoint: string,
    options?: RequestInit & { params?: Record<string, any> }
  ): Promise<ApiResponse<T>> {
    const builder = new RequestBuilder(`${this.baseURL}${endpoint}`);

    // Set method
    if (options?.method) {
      builder.method(options.method as any);
    }

    // Set body
    if (options?.body) {
      builder.body(options.body);
    }

    // Set headers
    if (options?.headers) {
      builder.headers(options.headers as Record<string, string>);
    }

    // Set query params
    if (options?.params) {
      builder.query(options.params);
    }

    // Set auth token
    builder.auth();

    const { url, options: finalOptions } = builder.build();

    try {
      console.log(`🌐 API Request: ${finalOptions.method} ${url}`);

      const response = await fetch(url, {
        ...finalOptions,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      const responseText = await response.text();
      let responseData: ApiResponse<T> | ApiError;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = {
          success: false,
          message: 'Invalid JSON response from server',
        };
      }

      if (!response.ok) {
        throw new APIError(
          responseData.message || `HTTP ${response.status}`,
          response.status,
          (responseData as ApiError).code,
          responseData
        );
      }

      console.log(`✅ API Response: ${response.status}`, responseData);
      return responseData as ApiResponse<T>;

    } catch (error) {
      console.error(`❌ API Error:`, error);

      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIError('Request timeout', HTTP_STATUS.INTERNAL_SERVER_ERROR, 'TIMEOUT');
        }
        throw new APIError(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'NETWORK_ERROR');
      }

      throw new APIError('Unknown error occurred', HTTP_STATUS.INTERNAL_SERVER_ERROR, 'UNKNOWN');
    }
  }

  // HTTP Methods
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body: data });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body: data });
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body: data });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.get(API_ENDPOINTS.HEALTH);
  }
}

// Create and export default API client instance
export const apiClient = new ApiClient();

// Export convenience functions for common operations
export const api = {
  // GET requests
  get: <T = any>(endpoint: string, params?: Record<string, any>) =>
    apiClient.get<T>(endpoint, params),

  // POST requests
  post: <T = any>(endpoint: string, data?: any) =>
    apiClient.post<T>(endpoint, data),

  // PUT requests
  put: <T = any>(endpoint: string, data?: any) =>
    apiClient.put<T>(endpoint, data),

  // PATCH requests
  patch: <T = any>(endpoint: string, data?: any) =>
    apiClient.patch<T>(endpoint, data),

  // DELETE requests
  delete: <T = any>(endpoint: string) =>
    apiClient.delete<T>(endpoint),

  // Health check
  health: () => apiClient.healthCheck(),
};

// Export for use in components
export default api;
