import { writable } from 'svelte/store';
import type { User } from '$lib/types';

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	loading: false
};

export const authStore = writable<AuthState>(initialState);

export const authActions = {
	login: async (email: string, password: string) => {
		authStore.update(state => ({ ...state, loading: true }));
		
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// Mock successful login
		const mockUser: User = {
			id: '1',
			email: email,
			role: 'admin',
			permissions: ['all'],
			isActive: true,
			lastLogin: new Date().toISOString()
		};
		
		authStore.update(state => ({
			...state,
			user: mockUser,
			isAuthenticated: true,
			loading: false
		}));
		
		return { success: true };
	},
	
	logout: () => {
		authStore.set(initialState);
	},
	
	checkAuth: () => {
		// Check if user is authenticated (e.g., from localStorage or cookies)
		const stored = localStorage.getItem('auth');
		if (stored) {
			const authData = JSON.parse(stored);
			authStore.update(state => ({
				...state,
				user: authData.user,
				isAuthenticated: true
			}));
		}
	}
};