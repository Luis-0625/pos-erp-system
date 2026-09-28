/**
 * Date utility functions
 */

import { format, parse, parseISO, isValid, differenceInDays, differenceInMonths, differenceInYears, addDays, addMonths, addYears, subDays, subMonths, subYears, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isAfter, isBefore, isSameDay, isSameMonth, isSameYear, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT, ISO_DATE_FORMAT } from './constants';

/**
 * Format date to string
 */
export const formatDate = (date: Date | string | null | undefined, dateFormat: string = DATE_FORMAT): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, dateFormat, { locale: es });
  } catch (error) {
    return '';
  }
};

/**
 * Format datetime to string
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  return formatDate(date, DATETIME_FORMAT);
};

/**
 * Format time to string
 */
export const formatTime = (date: Date | string | null | undefined): string => {
  return formatDate(date, TIME_FORMAT);
};

/**
 * Parse string to date
 */
export const parseDate = (dateString: string, dateFormat: string = DATE_FORMAT): Date | null => {
  if (!dateString) return null;
  
  try {
    const parsed = parse(dateString, dateFormat, new Date(), { locale: es });
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
};

/**
 * Parse ISO string to date
 */
export const parseISODate = (isoString: string): Date | null => {
  if (!isoString) return null;
  
  try {
    const parsed = parseISO(isoString);
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
};

/**
 * Check if date is valid
 */
export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj);
};

/**
 * Get current date
 */
export const now = (): Date => {
  return new Date();
};

/**
 * Get today at start of day
 */
export const today = (): Date => {
  return startOfDay(new Date());
};

/**
 * Get tomorrow
 */
export const tomorrow = (): Date => {
  return addDays(today(), 1);
};

/**
 * Get yesterday
 */
export const yesterday = (): Date => {
  return subDays(today(), 1);
};

/**
 * Add days to date
 */
export const addDaysToDate = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, days);
};

/**
 * Subtract days from date
 */
export const subtractDays = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return subDays(dateObj, days);
};

/**
 * Add months to date
 */
export const addMonthsToDate = (date: Date | string, months: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addMonths(dateObj, months);
};

/**
 * Subtract months from date
 */
export const subtractMonths = (date: Date | string, months: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return subMonths(dateObj, months);
};

/**
 * Add years to date
 */
export const addYearsToDate = (date: Date | string, years: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addYears(dateObj, years);
};

/**
 * Subtract years from date
 */
export const subtractYears = (date: Date | string, years: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return subYears(dateObj, years);
};

/**
 * Get difference in days between two dates
 */
export const daysBetween = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInDays(d2, d1);
};

/**
 * Get difference in months between two dates
 */
export const monthsBetween = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInMonths(d2, d1);
};

/**
 * Get difference in years between two dates
 */
export const yearsBetween = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInYears(d2, d1);
};

/**
 * Get start of day
 */
export const getStartOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(dateObj);
};

/**
 * Get end of day
 */
export const getEndOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfDay(dateObj);
};

/**
 * Get start of week
 */
export const getStartOfWeek = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfWeek(dateObj, { locale: es });
};

/**
 * Get end of week
 */
export const getEndOfWeek = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfWeek(dateObj, { locale: es });
};

/**
 * Get start of month
 */
export const getStartOfMonth = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfMonth(dateObj);
};

/**
 * Get end of month
 */
export const getEndOfMonth = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfMonth(dateObj);
};

/**
 * Get start of year
 */
export const getStartOfYear = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfYear(dateObj);
};

/**
 * Get end of year
 */
export const getEndOfYear = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfYear(dateObj);
};

/**
 * Check if date is after another date
 */
export const isDateAfter = (date: Date | string, compareDate: Date | string): boolean => {
  const d1 = typeof date === 'string' ? parseISO(date) : date;
  const d2 = typeof compareDate === 'string' ? parseISO(compareDate) : compareDate;
  return isAfter(d1, d2);
};

/**
 * Check if date is before another date
 */
export const isDateBefore = (date: Date | string, compareDate: Date | string): boolean => {
  const d1 = typeof date === 'string' ? parseISO(date) : date;
  const d2 = typeof compareDate === 'string' ? parseISO(compareDate) : compareDate;
  return isBefore(d1, d2);
};

/**
 * Check if two dates are the same day
 */
export const isSameDayAs = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
};

/**
 * Check if two dates are in the same month
 */
export const isSameMonthAs = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameMonth(d1, d2);
};

/**
 * Check if two dates are in the same year
 */
export const isSameYearAs = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameYear(d1, d2);
};

/**
 * Check if date is within interval
 */
export const isDateWithinInterval = (
  date: Date | string,
  start: Date | string,
  end: Date | string
): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return isWithinInterval(d, { start: s, end: e });
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isSameDayAs(dateObj, new Date());
};

/**
 * Check if date is in the past
 */
export const isPast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isDateBefore(dateObj, new Date());
};

/**
 * Check if date is in the future
 */
export const isFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isDateAfter(dateObj, new Date());
};

/**
 * Get date ranges for common periods
 */
export const getDateRange = (period: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'last7Days' | 'last30Days' | 'last90Days'): { start: Date; end: Date } => {
  const now = new Date();
  
  switch (period) {
    case 'today':
      return {
        start: getStartOfDay(now),
        end: getEndOfDay(now),
      };
    
    case 'yesterday':
      return {
        start: getStartOfDay(subDays(now, 1)),
        end: getEndOfDay(subDays(now, 1)),
      };
    
    case 'thisWeek':
      return {
        start: getStartOfWeek(now),
        end: getEndOfWeek(now),
      };
    
    case 'lastWeek':
      const lastWeek = subDays(now, 7);
      return {
        start: getStartOfWeek(lastWeek),
        end: getEndOfWeek(lastWeek),
      };
    
    case 'thisMonth':
      return {
        start: getStartOfMonth(now),
        end: getEndOfMonth(now),
      };
    
    case 'lastMonth':
      const lastMonth = subMonths(now, 1);
      return {
        start: getStartOfMonth(lastMonth),
        end: getEndOfMonth(lastMonth),
      };
    
    case 'thisYear':
      return {
        start: getStartOfYear(now),
        end: getEndOfYear(now),
      };
    
    case 'lastYear':
      const lastYear = subYears(now, 1);
      return {
        start: getStartOfYear(lastYear),
        end: getEndOfYear(lastYear),
      };
    
    case 'last7Days':
      return {
        start: getStartOfDay(subDays(now, 6)),
        end: getEndOfDay(now),
      };
    
    case 'last30Days':
      return {
        start: getStartOfDay(subDays(now, 29)),
        end: getEndOfDay(now),
      };
    
    case 'last90Days':
      return {
        start: getStartOfDay(subDays(now, 89)),
        end: getEndOfDay(now),
      };
    
    default:
      return {
        start: getStartOfDay(now),
        end: getEndOfDay(now),
      };
  }
};

/**
 * Format date range
 */
export const formatDateRange = (start: Date | string, end: Date | string): string => {
  const startFormatted = formatDate(start);
  const endFormatted = formatDate(end);
  
  if (isSameDayAs(start, end)) {
    return startFormatted;
  }
  
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Get relative time string (e.g., "hace 2 horas", "en 3 días")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Future dates
  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds);
    
    if (absDiff < 60) return 'en unos segundos';
    if (absDiff < 3600) return `en ${Math.floor(absDiff / 60)} minutos`;
    if (absDiff < 86400) return `en ${Math.floor(absDiff / 3600)} horas`;
    if (absDiff < 604800) return `en ${Math.floor(absDiff / 86400)} días`;
    if (absDiff < 2592000) return `en ${Math.floor(absDiff / 604800)} semanas`;
    if (absDiff < 31536000) return `en ${Math.floor(absDiff / 2592000)} meses`;
    return `en ${Math.floor(absDiff / 31536000)} años`;
  }
  
  // Past dates
  if (diffInSeconds < 60) return 'hace unos segundos';
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 604800)} semanas`;
  if (diffInSeconds < 31536000) return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  return `hace ${Math.floor(diffInSeconds / 31536000)} años`;
};

/**
 * Get age from birthdate
 */
export const getAge = (birthdate: Date | string): number => {
  return yearsBetween(birthdate, new Date());
};

/**
 * Get days in month
 */
export const getDaysInMonth = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const lastDay = getEndOfMonth(dateObj);
  return lastDay.getDate();
};

/**
 * Get month name
 */
export const getMonthName = (date: Date | string, short: boolean = false): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, short ? 'MMM' : 'MMMM', { locale: es });
};

/**
 * Get day name
 */
export const getDayName = (date: Date | string, short: boolean = false): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, short ? 'EEE' : 'EEEE', { locale: es });
};

/**
 * Convert date to ISO string
 */
export const toISOString = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.toISOString();
};

/**
 * Convert date to ISO date string (YYYY-MM-DD)
 */
export const toISODate = (date: Date | string): string => {
  return formatDate(date, ISO_DATE_FORMAT);
};

/**
 * Get business days between two dates (excluding weekends)
 */
export const getBusinessDaysBetween = (start: Date | string, end: Date | string): number => {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  
  let count = 0;
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return count;
};

/**
 * Check if date is a weekend
 */
export const isWeekend = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const dayOfWeek = dateObj.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

/**
 * Check if date is a weekday
 */
export const isWeekday = (date: Date | string): boolean => {
  return !isWeekend(date);
};

/**
 * Get next business day (excluding weekends)
 */
export const getNextBusinessDay = (date: Date | string): Date => {
  let nextDay = addDays(date, 1);
  while (isWeekend(nextDay)) {
    nextDay = addDays(nextDay, 1);
  }
  return nextDay;
};

/**
 * Get previous business day (excluding weekends)
 */
export const getPreviousBusinessDay = (date: Date | string): Date => {
  let prevDay = subDays(date, 1);
  while (isWeekend(prevDay)) {
    prevDay = subDays(prevDay, 1);
  }
  return prevDay;
};

/**
 * Get quarter of year (1-4)
 */
export const getQuarter = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const month = dateObj.getMonth();
  return Math.floor(month / 3) + 1;
};

/**
 * Get start of quarter
 */
export const getStartOfQuarter = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const quarter = getQuarter(dateObj);
  const year = dateObj.getFullYear();
  const month = (quarter - 1) * 3;
  return new Date(year, month, 1);
};

/**
 * Get end of quarter
 */
export const getEndOfQuarter = (date: Date | string): Date => {
  const startDate = getStartOfQuarter(date);
  return getEndOfMonth(addMonths(startDate, 2));
};
