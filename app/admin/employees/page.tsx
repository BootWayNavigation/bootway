'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import { useEmployees, useDeleteEmployee, useUpdateEmployee } from '@/hooks/useApi';
import {
  ArrowLeft, Mail, Loader2, Phone, Briefcase, Calendar, Search,
  MoreVertical, Eye, Pencil, User, Trash2, Save, X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const statusOptions = ['active', 'probation', 'on-leave', 'terminated', 'resigned'];

interface EditFormState {
  department: string;
  position: string;
  status: string;
  salary_amount: string;
  salary_currency: string;
  address: string;
  dateOfBirth: string;
  emergencyContact_name: string;
  emergencyContact_phone: string;
  emergencyContact_relation: string;
}

export default function AdminEmployees() {
  const { data: employees = [], isLoading, error } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState<'view' | 'edit'>('view');
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    department: '',
    position: '',
    status: '',
    salary_amount: '',
    salary_currency: 'INR',
    address: '',
    dateOfBirth: '',
    emergencyContact_name: '',
    emergencyContact_phone: '',
    emergencyContact_relation: '',
  });

  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      employee.user?.fullName?.toLowerCase().includes(searchLower) ||
      employee.employeeId?.toLowerCase().includes(searchLower) ||
      employee.department?.toLowerCase().includes(searchLower) ||
      employee.position?.toLowerCase().includes(searchLower)
    );
  });

  const openEmployeeSheet = (employee: Employee, tab: 'view' | 'edit' = 'view') => {
    setSelectedEmployee(employee);
    setSheetTab(tab);
    setEditForm({
      department: employee.department || '',
      position: employee.position || '',
      status: employee.status || 'active',
      salary_amount: String(employee.salary?.amount || ''),
      salary_currency: employee.salary?.currency || 'INR',
      address: employee.personalDetails?.address || '',
      dateOfBirth: employee.personalDetails?.dateOfBirth
        ? new Date(employee.personalDetails.dateOfBirth).toISOString().split('T')[0]
        : '',
      emergencyContact_name: employee.personalDetails?.emergencyContact?.name || '',
      emergencyContact_phone: employee.personalDetails?.emergencyContact?.phone || '',
      emergencyContact_relation: employee.personalDetails?.emergencyContact?.relation || '',
    });
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, employee: Employee) => {
    e.stopPropagation();
    setEmployeeToDelete(employee);
  };

  const handleEditFormChange = (field: keyof EditFormState, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!selectedEmployee) return;

    const updatePayload = {
      department: editForm.department,
      position: editForm.position,
      status: editForm.status,
      salary: {
        amount: Number(editForm.salary_amount) || 0,
        currency: editForm.salary_currency,
      },
      personalDetails: {
        address: editForm.address,
        dateOfBirth: editForm.dateOfBirth || null,
        emergencyContact: {
          name: editForm.emergencyContact_name,
          phone: editForm.emergencyContact_phone,
          relation: editForm.emergencyContact_relation,
        },
      },
    };

    try {
      await updateEmployeeMutation.mutateAsync({
        id: selectedEmployee._id,
        employeeData: updatePayload,
      });
      toast({
        title: 'Profile Updated',
        description: `${selectedEmployee.user?.fullName}'s profile has been updated successfully.`,
      });
      setSheetTab('view');
    } catch {
      toast({
        title: 'Update Failed',
        description: 'Could not update employee profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteEmployeeMutation.mutateAsync(employeeToDelete._id);
      toast({
        title: 'Employee Removed',
        description: `${employeeToDelete.user?.fullName} has been removed and reverted to candidate role.`,
      });
      setEmployeeToDelete(null);
      if (selectedEmployee?._id === employeeToDelete._id) {
        setIsSheetOpen(false);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete employee. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <PageContainer>
      <section className="bg-hero-gradient py-8 md:py-10">
        <div className="container-custom flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Employees Directory
            </h1>
            <p className="text-white/80">
              View and manage employee information.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/admin/dashboard" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-custom space-y-6">
          {/* Search Filter */}
          <Card>
            <CardContent className="py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, department, or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Employees</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {filteredEmployees.length} employees
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">
                  Error loading employees. Please try again.
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No employees found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow
                          key={employee._id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openEmployeeSheet(employee, 'view')}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={employee.user?.avatar} alt={employee.user?.fullName} />
                                <AvatarFallback>{getInitials(employee.user?.fullName || 'U')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{employee.user?.fullName}</p>
                                <p className="text-xs text-muted-foreground">{employee.user?.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{employee.employeeId}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>
                            <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(employee.dateJoined).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEmployeeSheet(employee, 'view')}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEmployeeSheet(employee, 'edit')}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onClick={(e) => handleDeleteClick(e, employee)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Employee Details / Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Employee Profile</SheetTitle>
            <SheetDescription>
              {sheetTab === 'view' ? 'Viewing employee details.' : 'Editing employee profile.'}
            </SheetDescription>
          </SheetHeader>

          {selectedEmployee && (
            <Tabs value={sheetTab} onValueChange={(v) => setSheetTab(v as 'view' | 'edit')}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="view" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" /> View
                </TabsTrigger>
                <TabsTrigger value="edit" className="flex-1">
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </TabsTrigger>
              </TabsList>

              {/* ── VIEW TAB ── */}
              <TabsContent value="view" className="space-y-6">
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 pb-6 border-b">
                  <Avatar className="h-20 w-20 border-2 border-primary/10">
                    <AvatarImage src={selectedEmployee.user?.avatar} />
                    <AvatarFallback className="text-xl">
                      {getInitials(selectedEmployee.user?.fullName || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedEmployee.user?.fullName}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{selectedEmployee.user?.email}</span>
                    </div>
                    <Badge className="mt-2" variant={selectedEmployee.status === 'active' ? 'default' : 'secondary'}>
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" /> Employment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Employee ID</span>
                      <span className="font-medium font-mono">{selectedEmployee.employeeId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Date Joined</span>
                      <span className="font-medium">
                        {new Date(selectedEmployee.dateJoined).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Department</span>
                      <span className="font-medium">{selectedEmployee.department}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Position</span>
                      <span className="font-medium">{selectedEmployee.position}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Salary</span>
                      <span className="font-medium">
                        {selectedEmployee.salary?.currency || 'INR'} {selectedEmployee.salary?.amount?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Personal Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Phone</span>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span>{selectedEmployee.user?.phone || 'N/A'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Date of Birth</span>
                      <span>{selectedEmployee.personalDetails?.dateOfBirth ? new Date(selectedEmployee.personalDetails.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block mb-1">Address</span>
                      <span>{selectedEmployee.personalDetails?.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {selectedEmployee.personalDetails?.emergencyContact && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                        Emergency Contact
                      </h4>
                      <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{selectedEmployee.personalDetails.emergencyContact.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Relation:</span>
                          <span className="font-medium">{selectedEmployee.personalDetails.emergencyContact.relation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{selectedEmployee.personalDetails.emergencyContact.phone}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-2">
                  <Button onClick={() => setSheetTab('edit')} className="w-full">
                    <Pencil className="w-4 h-4 mr-2" /> Edit This Profile
                  </Button>
                </div>
              </TabsContent>

              {/* ── EDIT TAB ── */}
              <TabsContent value="edit" className="space-y-6">
                {/* Employment Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-base flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" /> Employment Details
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-department">Department</Label>
                      <Input
                        id="edit-department"
                        value={editForm.department}
                        onChange={(e) => handleEditFormChange('department', e.target.value)}
                        placeholder="e.g. Engineering"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-position">Position</Label>
                      <Input
                        id="edit-position"
                        value={editForm.position}
                        onChange={(e) => handleEditFormChange('position', e.target.value)}
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select
                        value={editForm.status}
                        onValueChange={(v) => handleEditFormChange('status', v)}
                      >
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-salary">Salary Amount</Label>
                      <Input
                        id="edit-salary"
                        type="number"
                        value={editForm.salary_amount}
                        onChange={(e) => handleEditFormChange('salary_amount', e.target.value)}
                        placeholder="e.g. 60000"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Personal Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Personal Information
                  </h4>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-address">Address</Label>
                    <Textarea
                      id="edit-address"
                      value={editForm.address}
                      onChange={(e) => handleEditFormChange('address', e.target.value)}
                      placeholder="Full address"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-dob">Date of Birth</Label>
                    <Input
                      id="edit-dob"
                      type="date"
                      value={editForm.dateOfBirth}
                      onChange={(e) => handleEditFormChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-base">Emergency Contact</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-ec-name">Name</Label>
                      <Input
                        id="edit-ec-name"
                        value={editForm.emergencyContact_name}
                        onChange={(e) => handleEditFormChange('emergencyContact_name', e.target.value)}
                        placeholder="Contact name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-ec-relation">Relation</Label>
                      <Input
                        id="edit-ec-relation"
                        value={editForm.emergencyContact_relation}
                        onChange={(e) => handleEditFormChange('emergencyContact_relation', e.target.value)}
                        placeholder="e.g. Parent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-ec-phone">Phone</Label>
                    <Input
                      id="edit-ec-phone"
                      value={editForm.emergencyContact_phone}
                      onChange={(e) => handleEditFormChange('emergencyContact_phone', e.target.value)}
                      placeholder="Contact phone number"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSheetTab('view')}
                    disabled={updateEmployeeMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSaveEdit}
                    disabled={updateEmployeeMutation.isPending}
                  >
                    {updateEmployeeMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!employeeToDelete} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{' '}
              <span className="font-bold">{employeeToDelete?.user?.fullName}</span>{' '}
              from the employee directory and revert their role to candidate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteEmployeeMutation.isPending}
            >
              {deleteEmployeeMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
              ) : (
                'Delete Employee'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
