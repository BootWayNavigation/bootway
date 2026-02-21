'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageContainer from '@/components/layout/PageContainer';
import { ArrowLeft, Plus, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getJobById, updateJob } from '@/lib/apiClient';

const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];

const ListItem = ({ label, items, current, setter, onAdd, onRemove }: any) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
            <Input
                placeholder={`Add ${label.toLowerCase()}`}
                value={current}
                onChange={(e) => setter(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onAdd();
                    }
                }}
            />
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAdd}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
        <div className="flex flex-wrap gap-2">
            {items.map((item: string, index: number) => (
                <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                    {item}
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="ml-1 hover:text-destructive"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export default function EditJob() {
    const router = useRouter();
    const params = useParams();
    const jobId = params?.jobId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: '',
        salary: '',
        description: '',
        skills: [] as string[],
        requirements: [] as string[],
        responsibilities: [] as string[],
        benefits: [] as string[],
    });

    const [currentSkill, setCurrentSkill] = useState("");
    const [currentRequirement, setCurrentRequirement] = useState('');
    const [currentResponsibility, setCurrentResponsibility] = useState('');
    const [currentBenefit, setCurrentBenefit] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await getJobById(jobId);
                if (response.success && response.data) {
                    const job = response.data;
                    setFormData({
                        title: job.title || '',
                        department: job.department || '',
                        location: job.location || '',
                        type: job.type || '',
                        salary: job.salary || '',
                        description: job.description || '',
                        skills: job.skills || [],
                        requirements: job.requirements || [],
                        responsibilities: job.responsibilities || [],
                        benefits: job.benefits || [],
                    });
                } else {
                    alert('Failed to fetch job details');
                    router.push('/admin/jobs');
                }
            } catch (error) {
                console.error('Error fetching job:', error);
                alert('Error loading job details');
            } finally {
                setIsLoading(false);
            }
        };

        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addItem = (listName: keyof typeof formData, item: string, setter: (prev: string) => void) => {
        if (item.trim()) {
            setFormData(prev => ({
                ...prev,
                [listName]: [...(prev[listName] as string[]), item.trim()]
            }));
            setter('');
        }
    };

    const removeItem = (listName: keyof typeof formData, index: number) => {
        setFormData(prev => ({
            ...prev,
            [listName]: (prev[listName] as string[]).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.department || !formData.location || !formData.type) {
            alert('Please fill in all required fields');
            return;
        }

        if (formData.skills.length === 0) {
            alert('Please add at least one skill');
            return;
        }

        if (formData.requirements.length === 0) {
            alert('Please add at least one requirement');
            return;
        }

        if (formData.responsibilities.length === 0) {
            alert('Please add at least one responsibility');
            return;
        }

        setIsLoading(true);

        try {
            const jobPayload = { ...formData };

            console.log('📤 Sending update payload to backend:', jobPayload);

            const result = await updateJob(jobId, jobPayload);

            console.log('✅ Job update response:', result);

            if (result.success) {
                alert('Job updated successfully!');
                router.push('/admin/jobs');
            } else {
                alert(`Failed: ${result.message || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Error updating job:', error);
            const errorMessage = error.message || 'Failed to update job. Please try again.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };



    if (isLoading && !formData.title) {
        return (
            <PageContainer>
                <div className="flex justify-center items-center h-[50vh]">
                    <p>Loading job details...</p>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <section className="bg-hero-gradient py-8 md:py-10">
                <div className="container-custom flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Edit Job
                        </h1>
                        <p className="text-white/80">
                            Update job details for {formData.title || 'this position'}
                        </p>
                    </div>
                    <Button asChild variant="secondary">
                        <Link href="/admin/jobs" className="flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="section-padding bg-muted/30">
                <div className="container-custom max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Details</CardTitle>
                            <CardDescription>
                                Update the information for this job posting.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Basic Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Job Title *</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="e.g., Senior Frontend Developer"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department *</Label>
                                            <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {departments.map(dept => (
                                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location *</Label>
                                            <Input
                                                id="location"
                                                name="location"
                                                placeholder="e.g., Bangalore, India"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="type">Job Type *</Label>
                                            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select job type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {jobTypes.map(type => (
                                                        <SelectItem key={type} value={type}>
                                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="salary">Salary (Optional)</Label>
                                            <Input
                                                id="salary"
                                                name="salary"
                                                placeholder="e.g., 18-25 LPA"
                                                value={formData.salary}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Job Description *</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Describe the role, team, and organization..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={5}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Skills & Requirements */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Skills & Requirements</h3>

                                    <ListItem
                                        label="Required Skills *"
                                        items={formData.skills}
                                        current={currentSkill}
                                        setter={setCurrentSkill}
                                        onAdd={() => addItem('skills', currentSkill, setCurrentSkill)}
                                        onRemove={(index: number) => removeItem('skills', index)}
                                    />

                                    <ListItem
                                        label="Requirements *"
                                        items={formData.requirements}
                                        current={currentRequirement}
                                        setter={setCurrentRequirement}
                                        onAdd={() => addItem('requirements', currentRequirement, setCurrentRequirement)}
                                        onRemove={(index: number) => removeItem('requirements', index)}
                                    />

                                    <ListItem
                                        label="Responsibilities *"
                                        items={formData.responsibilities}
                                        current={currentResponsibility}
                                        setter={setCurrentResponsibility}
                                        onAdd={() => addItem('responsibilities', currentResponsibility, setCurrentResponsibility)}
                                        onRemove={(index: number) => removeItem('responsibilities', index)}
                                    />

                                    <ListItem
                                        label="Benefits (Optional)"
                                        items={formData.benefits}
                                        current={currentBenefit}
                                        setter={setCurrentBenefit}
                                        onAdd={() => addItem('benefits', currentBenefit, setCurrentBenefit)}
                                        onRemove={(index: number) => removeItem('benefits', index)}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4 border-t">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Updating...' : 'Update Job'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/admin/jobs">Cancel</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PageContainer>
    );
}
