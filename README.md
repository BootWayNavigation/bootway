# Career Compass - HR Recruitment Portal

## Project Overview

Career Compass is a modern HR recruitment portal built with Next.js 15, TypeScript, and Tailwind CSS. It provides a seamless platform for job seekers to explore opportunities and apply for positions, while giving HR teams powerful tools to manage the entire recruitment workflow.

## Features

### For Candidates
- Browse job listings with detailed descriptions
- Submit job applications with a streamlined form
- Track application status in real-time
- View interview schedules and receive offer details
- Fully responsive design for mobile and desktop

### For HR Teams
- Dashboard with recruitment analytics
- Manage job postings and candidates
- Schedule and track interviews
- Generate and manage job offers
- Employee directory and management

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form + Zod
- **Package Manager**: Bun
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **API Integration**: Custom API client with React Query

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm or Bun package manager
- MongoDB database (for backend)
- Backend API server running

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to frontend directory
cd frontend

# Install dependencies
bun install
# or
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
bun dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`

### Backend Setup

Ensure the backend API is running:

```bash
# In backend directory
cd ../backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start backend server
npm run dev
```

The backend API will be available at `http://localhost:5000`

## API Integration

This frontend is fully integrated with the backend API through a comprehensive API architecture:

### API Architecture Layers

1. **API Configuration** (`src/lib/api.ts`) - Core API client and configuration
2. **API Services** (`src/services/apiService.ts`) - Service layer for all API operations
3. **React Query Hooks** (`src/hooks/useApi.ts`) - React Query hooks for state management
4. **Authentication Context** (`src/contexts/AuthContext.tsx`) - Global auth state management

### Environment Configuration

Create `.env.local` in the frontend root:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

### Usage Examples

```typescript
// Using API services
import { apiService } from '@/services/apiService';

// Fetch jobs
const jobs = await apiService.jobs.getJobs({ status: 'active' });

// Submit application
await apiService.applications.applyForJob(applicationData);

// Using React Query hooks
import { useJobs, useAuth } from '@/hooks/useApi';

function JobsList() {
  const { data: jobs, isLoading } = useJobs({ status: 'active' });
  const { user, login } = useAuth();
  
  // Component logic
}
```

## Available Scripts

```bash
bun dev      # Start development server
bun build    # Build for production
bun start    # Run production build
bun lint     # Run ESLint
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── (candidate)/       # Candidate routes
│   │   ├── page.tsx       # Landing page
│   │   └── careers/       # Job listings
│   ├── admin/             # Admin routes
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── jobs/          # Job management
│   │   ├── applications/  # Application management
│   │   ├── interviews/    # Interview scheduling
│   │   └── offers/        # Offer management
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── admin/        # Admin-specific components
│   │   ├── candidate/    # Candidate-specific components
│   │   ├── auth/         # Authentication components
│   │   └── common/       # Shared components
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/             # Custom React hooks
│   │   └── useApi.ts     # React Query hooks
│   ├── lib/               # Utility functions
│   │   ├── api.ts        # Core API client
│   │   └── utils.ts      # General utilities
│   ├── services/          # API service layer
│   │   └── apiService.ts # API services
│   └── data/              # Mock data and types
├── public/                # Static assets
└── package.json           # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatePassword` - Update password

### Jobs
- `GET /api/jobs` - List jobs with filters
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (HR/Admin)
- `PUT /api/jobs/:id` - Update job (HR/Admin)
- `DELETE /api/jobs/:id` - Delete job (HR/Admin)

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id` - Update application
- `GET /api/applications/candidate/my-applications` - Get my applications

### Interviews
- `GET /api/interviews` - List interviews
- `POST /api/interviews` - Schedule interview
- `PUT /api/interviews/:id` - Update interview

### Offers
- `GET /api/offers` - List offers
- `POST /api/offers` - Create offer
- `PUT /api/offers/:id` - Update offer

## Configuration Files

- `tsconfig.json` - TypeScript configuration with path aliases
- `tailwind.config.ts` - Tailwind CSS customization
- `next.config.js` - Next.js configuration
- `eslint.config.js` - Linting rules
- `.env.example` - Environment variables template

## Development

The project uses TypeScript for type safety and ESLint for code quality. Both are configured in the respective config files.

### Code Style
- TypeScript for static typing
- Tailwind CSS for styling
- Component-based architecture
- API-first development with React Query

### API Integration Features
- Automatic JWT token management
- Request/response caching with React Query
- Error handling and retry logic
- Type-safe API interfaces
- Real-time data synchronization

## Testing

### Running Tests
```bash
bun test      # Run unit tests
bun test:watch # Run tests in watch mode
```

### API Testing
The project includes comprehensive API testing with:
- Mock data for development
- React Query DevTools for debugging
- Error boundary testing
- Loading state testing

## Deployment

The project can be deployed to various platforms that support Next.js:
- Vercel (recommended)
- Netlify
- AWS
- Docker containers

### Environment Variables for Production
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NODE_ENV=production
```

## API Documentation

For detailed API integration documentation, see:
- `API_INTEGRATION_GUIDE.md` - Comprehensive API integration guide
- `src/lib/api.ts` - Core API client documentation
- `src/services/apiService.ts` - Service layer documentation

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for your frontend domain
2. **Authentication Issues**: Check token storage and API headers
3. **Network Errors**: Verify API URL and backend connectivity
4. **Type Errors**: Ensure TypeScript interfaces match API responses

### Debug Steps

1. Check browser network tab for failed requests
2. Verify environment variables are set correctly
3. Check backend logs for API errors
4. Use React Query DevTools to inspect cache state

## Contributing

Contributions are welcome! Please ensure that:
1. Code follows the existing style
2. Components are properly typed with TypeScript
3. API integrations use the service layer
4. Changes are tested locally
5. Documentation is updated

## License

This project is proprietary software.
