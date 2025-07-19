import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
	}).format(amount);
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	
	switch (format) {
		case 'long':
			return dateObj.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		case 'time':
			return dateObj.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
			});
		default:
			return dateObj.toLocaleDateString('en-US');
	}
}

export function generateId(): string {
	return Math.random().toString(36).substr(2, 9);
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
}

export function calculateWorkingHours(startTime: string, endTime: string): number {
	const start = new Date(`1970-01-01T${startTime}`);
	const end = new Date(`1970-01-01T${endTime}`);
	const diffMs = end.getTime() - start.getTime();
	return diffMs / (1000 * 60 * 60); // Convert to hours
}