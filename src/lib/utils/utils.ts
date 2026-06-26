// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes without conflicts
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // returns 'py-1 px-4'
 * cn('text-red-500', { 'text-blue-500': isActive }) // conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

/**
 * Formats a date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Truncates a string to a specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Generates a random ID (useful for temporary UI keys)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}