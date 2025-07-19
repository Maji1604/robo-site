import { writable } from 'svelte/store';
import type { Employee } from '$lib/types';

const mockEmployees: Employee[] = [
	{
		id: '1',
		employeeId: 'EMP001',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@creoleap.com',
		phone: '+1234567890',
		department: 'Engineering',
		position: 'Senior Developer',
		joinDate: '2023-01-15',
		salary: 75000,
		status: 'active',
		manager: 'Jane Smith',
		team: 'Frontend Team'
	},
	{
		id: '2',
		employeeId: 'EMP002',
		firstName: 'Jane',
		lastName: 'Smith',
		email: 'jane.smith@creoleap.com',
		phone: '+1234567891',
		department: 'Engineering',
		position: 'Team Lead',
		joinDate: '2022-03-10',
		salary: 90000,
		status: 'active',
		team: 'Frontend Team'
	},
	{
		id: '3',
		employeeId: 'EMP003',
		firstName: 'Mike',
		lastName: 'Johnson',
		email: 'mike.johnson@creoleap.com',
		phone: '+1234567892',
		department: 'HR',
		position: 'HR Manager',
		joinDate: '2021-08-20',
		salary: 65000,
		status: 'active'
	}
];

export const employeeStore = writable<Employee[]>(mockEmployees);

export const employeeActions = {
	addEmployee: (employee: Omit<Employee, 'id'>) => {
		const newEmployee: Employee = {
			...employee,
			id: Math.random().toString(36).substr(2, 9)
		};
		
		employeeStore.update(employees => [...employees, newEmployee]);
		return newEmployee;
	},
	
	updateEmployee: (id: string, updates: Partial<Employee>) => {
		employeeStore.update(employees => 
			employees.map(emp => emp.id === id ? { ...emp, ...updates } : emp)
		);
	},
	
	deleteEmployee: (id: string) => {
		employeeStore.update(employees => employees.filter(emp => emp.id !== id));
	},
	
	getEmployeeById: (id: string): Employee | undefined => {
		let employee: Employee | undefined;
		employeeStore.subscribe(employees => {
			employee = employees.find(emp => emp.id === id);
		})();
		return employee;
	}
};