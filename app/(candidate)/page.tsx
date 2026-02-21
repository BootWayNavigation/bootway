'use client';

import { useState } from 'react';
import { Search, Filter, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageContainer from '@/components/layout/PageContainer';
import JobCard from '@/components/candidate/JobCard';
import { useJobs } from '@/hooks/useApi';
import { Job as JobType } from '@/services/apiService';

const departments = ['All Departments', 'Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'HR', 'Finance'];
const types = ['All Types', 'Full Time', 'Part Time', 'Contract', 'Internship'];
const locations = ['All Locations', 'Bangalore, India', 'Remote', 'Mumbai, India', 'Delhi, India'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [jobType, setJobType] = useState('All Types');
  const [location, setLocation] = useState('All Locations');

  // Build filters object
  const filters = {
    search: searchQuery || undefined,
    department: department === 'All Departments' ? undefined : department,
    type: jobType === 'All Types' ? undefined : jobType.toLowerCase().replace(' ', '-'),
    location: location === 'All Locations' ? undefined : location,
  };

  // Fetch jobs using React Query
  const { data: jobs = [], isLoading, error } = useJobs(filters);

  // Filter jobs on frontend for additional safety
  const filteredJobs = jobs.filter((job: JobType) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      department === 'All Departments' || job.department === department;
    const matchesType =
      jobType === 'All Types' ||
      job.type === jobType.toLowerCase().replace(' ', '-');
    const matchesLocation =
      location === 'All Locations' || job.location === location;

    return matchesSearch && matchesDepartment && matchesType && matchesLocation && job.isActive;
  });

  return (
    <PageContainer>
      {/* Header */}
      <section className="bg-hero-gradient py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-white/80 text-lg">
              Explore exciting opportunities at BootWay and take the next step in your career journey.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white dark:bg-gray-900 border-b border-border sticky top-16 z-40">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[180px] h-11">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="w-[160px] h-11">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[160px] h-11">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job: JobType) => (
                <JobCard
                  key={job._id}
                  id={job._id}
                  title={job.title}
                  department={job.department}
                  location={job.location}
                  type={job.type}
                  salary={job.salary}
                  postedAt={new Date(job.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  description={job.description}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isLoading ? 'Loading Jobs...' : error ? 'Error loading jobs' : 'No Jobs Found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isLoading ? 'Please wait while we fetch the latest opportunities.' :
                  error ? 'There was an error loading jobs. Please try again later.' :
                    'Try adjusting your search criteria to find more opportunities.'}
              </p>
              {!isLoading && !error && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setDepartment('All Departments');
                    setJobType('All Types');
                    setLocation('All Locations');
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
