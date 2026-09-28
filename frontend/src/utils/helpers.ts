/**
 * General helper utilities
 */

import { PAYMENT_STATUS, DOCUMENT_STATUS } from './constants';

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a UUID v4
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Sleep/delay utility
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }
  
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
};

/**
 * Deep merge two objects
 */
export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const output = { ...target } as any;
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject((source as any)[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: (source as any)[key] });
        } else {
          output[key] = deepMerge((target as any)[key], (source as any)[key]);
        }
      } else {
        Object.assign(output, { [key]: (source as any)[key] });
      }
    });
  }
  
  return output;
};

/**
 * Check if value is an object
 */
export const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Check if value is not empty
 */
export const isNotEmpty = (value: any): boolean => {
  return !isEmpty(value);
};

/**
 * Get nested object property by path
 * Example: get(obj, 'user.address.city')
 */
export const get = <T = any>(obj: any, path: string, defaultValue?: T): T => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue as T;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : (defaultValue as T);
};

/**
 * Set nested object property by path
 * Example: set(obj, 'user.address.city', 'Bogotá')
 */
export const set = (obj: any, path: string, value: any): void => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
};

/**
 * Omit properties from object
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

/**
 * Pick properties from object
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Group array items by key
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Remove duplicates from array
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Remove duplicates from array of objects by key
 */
export const uniqueBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Sort array of objects by key
 */
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Flatten nested arrays
 */
export const flatten = <T>(array: any[]): T[] => {
  return array.reduce(
    (acc, val) => (Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val)),
    []
  );
};

/**
 * Calculate sum of array numbers or object property
 */
export const sum = <T extends Record<string, any>>(
  array: T[] | number[],
  key?: keyof T
): number => {
  if (array.length === 0) return 0;
  
  if (typeof array[0] === 'number') {
    return (array as number[]).reduce((acc, val) => acc + val, 0);
  }
  
  if (key) {
    return (array as T[]).reduce((acc, item) => {
      const value = Number(item[key]) || 0;
      return acc + value;
    }, 0);
  }
  
  return 0;
};

/**
 * Calculate average of array numbers or object property
 */
export const average = <T extends Record<string, any>>(
  array: T[] | number[],
  key?: keyof T
): number => {
  if (array.length === 0) return 0;
  return sum(array, key) / array.length;
};

/**
 * Find min value in array
 */
export const min = <T extends Record<string, any>>(
  array: T[] | number[],
  key?: keyof T
): number => {
  if (array.length === 0) return 0;
  
  if (typeof array[0] === 'number') {
    return Math.min(...(array as number[]));
  }
  
  if (key) {
    return Math.min(...(array as T[]).map((item) => Number(item[key]) || 0));
  }
  
  return 0;
};

/**
 * Find max value in array
 */
export const max = <T extends Record<string, any>>(
  array: T[] | number[],
  key?: keyof T
): number => {
  if (array.length === 0) return 0;
  
  if (typeof array[0] === 'number') {
    return Math.max(...(array as number[]));
  }
  
  if (key) {
    return Math.max(...(array as T[]).map((item) => Number(item[key]) || 0));
  }
  
  return 0;
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, minVal: number, maxVal: number): number => {
  return Math.min(Math.max(value, minVal), maxVal);
};

/**
 * Round number to specified decimal places
 */
export const roundTo = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Calculate percentage
 */
export const percentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Calculate percentage change
 */
export const percentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Retry a function with exponential backoff
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    backoff?: boolean;
  } = {}
): Promise<T> => {
  const { maxAttempts = 3, delayMs = 1000, backoff = true } = options;
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxAttempts) {
        const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs;
        await sleep(delay);
      }
    }
  }
  
  throw lastError!;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Download file from blob
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Download JSON as file
 */
export const downloadJSON = (data: any, filename: string): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, filename);
};

/**
 * Download CSV from array of objects
 */
export const downloadCSV = (data: Record<string, any>[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? '' : String(value);
        // Escape quotes and wrap in quotes if contains comma
        return stringValue.includes(',') || stringValue.includes('"')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      }).join(',')
    ),
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Parse query string to object
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
};

/**
 * Get filename without extension
 */
export const getFilenameWithoutExtension = (filename: string): string => {
  const parts = filename.split('.');
  if (parts.length > 1) {
    parts.pop();
  }
  return parts.join('.');
};

/**
 * Convert bytes to human readable size
 */
export const bytesToSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

/**
 * Scroll to element smoothly
 */
export const scrollToElement = (
  elementId: string,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView(options);
  }
};

/**
 * Scroll to top of page
 */
export const scrollToTop = (smooth: boolean = true): void => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Format document number based on type
 */
export const formatDocumentNumber = (
  number: string,
  type: 'invoice' | 'purchase' | 'receipt' = 'invoice',
  prefix?: string
): string => {
  const prefixes = {
    invoice: prefix || 'FAC',
    purchase: prefix || 'COM',
    receipt: prefix || 'REC',
  };
  
  return `${prefixes[type]}-${number.padStart(6, '0')}`;
};

/**
 * Calculate due date based on payment terms
 */
export const calculateDueDate = (
  issueDate: Date | string,
  paymentTermDays: number
): Date => {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + paymentTermDays);
  return date;
};

/**
 * Calculate days until due date
 */
export const daysUntilDue = (dueDate: Date | string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if payment is overdue
 */
export const isOverdue = (
  dueDate: Date | string,
  paymentStatus: string
): boolean => {
  if (paymentStatus === PAYMENT_STATUS.PAID || paymentStatus === PAYMENT_STATUS.CANCELLED) {
    return false;
  }
  
  return daysUntilDue(dueDate) < 0;
};

/**
 * Calculate total from items array
 */
export const calculateTotal = <T extends { quantity: number; unitPrice: number }>(
  items: T[]
): number => {
  return items.reduce((total, item) => {
    return total + item.quantity * item.unitPrice;
  }, 0);
};

/**
 * Calculate subtotal (total before tax)
 */
export const calculateSubtotal = (total: number, taxRate: number): number => {
  return total / (1 + taxRate / 100);
};

/**
 * Calculate tax amount
 */
export const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100);
};

/**
 * Apply discount to amount
 */
export const applyDiscount = (
  amount: number,
  discount: number,
  isPercentage: boolean = true
): number => {
  if (isPercentage) {
    return amount * (1 - discount / 100);
  }
  return amount - discount;
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (
  amount: number,
  discount: number,
  isPercentage: boolean = true
): number => {
  if (isPercentage) {
    return amount * (discount / 100);
  }
  return discount;
};

/**
 * Check if document is active (not cancelled or refunded)
 */
export const isDocumentActive = (status: string): boolean => {
  return status === DOCUMENT_STATUS.ACTIVE || status === DOCUMENT_STATUS.DRAFT;
};

/**
 * Get initials from full name
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return '';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate random color
 */
export const randomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Get contrast color (black or white) for a background color
 */
export const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const color = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (
  str: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Mask sensitive information (e.g., credit card numbers)
 */
export const mask = (
  value: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string => {
  if (value.length <= visibleChars) return value;
  const masked = maskChar.repeat(value.length - visibleChars);
  return masked + value.slice(-visibleChars);
};

/**
 * Compare two values for sorting
 */
export const compare = (a: any, b: any, order: 'asc' | 'desc' = 'asc'): number => {
  if (a === b) return 0;
  
  const result = a < b ? -1 : 1;
  return order === 'asc' ? result : -result;
};
