export interface Employee {
	id: string;
	employeeId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	department: string;
	position: string;
	joinDate: string;
	salary: number;
	status: 'active' | 'inactive' | 'terminated';
	avatar?: string;
	manager?: string;
	team?: string;
}

export interface Department {
	id: string;
	name: string;
	description: string;
	managerId: string;
	employeeCount: number;
	budget: number;
	createdAt: string;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	assigneeId: string;
	assignerId: string;
	projectId?: string;
	status: 'todo' | 'in-progress' | 'review' | 'completed';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	dueDate: string;
	createdAt: string;
	updatedAt: string;
	estimatedHours?: number;
	actualHours?: number;
	tags?: string[];
}

export interface Project {
	id: string;
	name: string;
	description: string;
	managerId: string;
	teamMembers: string[];
	status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
	startDate: string;
	endDate: string;
	budget: number;
	progress: number;
}

export interface AttendanceRecord {
	id: string;
	employeeId: string;
	date: string;
	clockIn: string;
	clockOut?: string;
	breakDuration: number;
	workingHours: number;
	status: 'present' | 'absent' | 'late' | 'half-day';
	notes?: string;
}

export interface LeaveRequest {
	id: string;
	employeeId: string;
	leaveType: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
	startDate: string;
	endDate: string;
	reason: string;
	status: 'pending' | 'approved' | 'rejected';
	approverId?: string;
	appliedAt: string;
	reviewedAt?: string;
	days: number;
}

export interface Payslip {
	id: string;
	employeeId: string;
	month: number;
	year: number;
	basicSalary: number;
	allowances: number;
	deductions: number;
	tax: number;
	netSalary: number;
	generatedAt: string;
	status: 'draft' | 'sent' | 'acknowledged';
}

export interface User {
	id: string;
	email: string;
	role: 'admin' | 'hr' | 'manager' | 'employee';
	permissions: string[];
	lastLogin?: string;
	isActive: boolean;
}

export interface Notification {
	id: string;
	userId: string;
	title: string;
	message: string;
	type: 'info' | 'success' | 'warning' | 'error';
	read: boolean;
	createdAt: string;
	actionUrl?: string;
}