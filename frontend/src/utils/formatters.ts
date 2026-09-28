/**
 * Utilidades de formateo
 */

import { CURRENCY_SYMBOL, DECIMAL_PLACES, DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from './constants';

/**
 * Formatea un número como moneda
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return `${CURRENCY_SYMBOL}0`;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return `${CURRENCY_SYMBOL}0`;
  
  return `${CURRENCY_SYMBOL}${numValue.toLocaleString('es-CO', {
    minimumFractionDigits: DECIMAL_PLACES,
    maximumFractionDigits: DECIMAL_PLACES,
  })}`;
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (value: number | string | null | undefined, decimals: number = 0): string => {
  if (value === null || value === undefined || value === '') return '0';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  return numValue.toLocaleString('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number | string | null | undefined, decimals: number = 2): string => {
  if (value === null || value === undefined || value === '') return '0%';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0%';
  
  return `${numValue.toFixed(decimals)}%`;
};

/**
 * Formatea una fecha
 */
export const formatDate = (date: string | Date | null | undefined, format: string = DATE_FORMAT): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Formatea una fecha y hora
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, DATETIME_FORMAT);
};

/**
 * Formatea solo la hora
 */
export const formatTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, TIME_FORMAT);
};

/**
 * Formatea fecha relativa (hace X tiempo)
 */
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSeconds < 60) return 'Hace un momento';
  if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 30) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  if (diffMonths < 12) return `Hace ${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
  return `Hace ${diffYears} año${diffYears > 1 ? 's' : ''}`;
};

/**
 * Formatea un documento (NIT, CC, etc)
 */
export const formatDocument = (value: string | null | undefined, type: 'NIT' | 'CC' | 'OTHER' = 'OTHER'): string => {
  if (!value) return '';
  
  const cleanValue = value.replace(/\D/g, '');
  
  if (type === 'NIT' && cleanValue.length >= 9) {
    const mainPart = cleanValue.slice(0, -1);
    const checkDigit = cleanValue.slice(-1);
    return `${mainPart}-${checkDigit}`;
  }
  
  if (type === 'CC') {
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  return cleanValue;
};

/**
 * Formatea un número de teléfono
 */
export const formatPhone = (value: string | null | undefined): string => {
  if (!value) return '';
  
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length === 7) {
    return cleanValue.replace(/(\d{3})(\d{4})/, '$1-$2');
  }
  
  if (cleanValue.length === 10) {
    return cleanValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  
  return cleanValue;
};

/**
 * Formatea un código de barras
 */
export const formatBarcode = (value: string | null | undefined): string => {
  if (!value) return '';
  
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length === 13) {
    return cleanValue.replace(/(\d{1})(\d{6})(\d{6})/, '$1-$2-$3');
  }
  
  return cleanValue;
};

/**
 * Formatea un SKU
 */
export const formatSKU = (value: string | null | undefined): string => {
  if (!value) return '';
  return value.toUpperCase();
};

/**
 * Capitaliza la primera letra
 */
export const capitalize = (value: string | null | undefined): string => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

/**
 * Capitaliza todas las palabras
 */
export const capitalizeWords = (value: string | null | undefined): string => {
  if (!value) return '';
  return value
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Trunca un texto
 */
export const truncate = (value: string | null | undefined, maxLength: number = 50, suffix: string = '...'): string => {
  if (!value) return '';
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Formatea un tamaño de archivo
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formatea un número de factura con ceros a la izquierda
 */
export const formatInvoiceNumber = (prefix: string, number: number, padding: number = 6): string => {
  return `${prefix}${String(number).padStart(padding, '0')}`;
};

/**
 * Obtiene las iniciales de un nombre
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return '';
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Formatea un nombre completo
 */
export const formatFullName = (firstName: string | null | undefined, lastName: string | null | undefined): string => {
  const parts = [firstName, lastName].filter(part => part && part.trim().length > 0);
  return capitalizeWords(parts.join(' '));
};

/**
 * Formatea una dirección
 */
export const formatAddress = (address: string | null | undefined, city?: string | null, state?: string | null): string => {
  const parts = [address, city, state].filter(part => part && part.trim().length > 0);
  return parts.join(', ');
};

/**
 * Limpia un valor numérico de caracteres no numéricos
 */
export const cleanNumericValue = (value: string): string => {
  return value.replace(/[^\d.-]/g, '');
};

/**
 * Parsea un valor de moneda a número
 */
export const parseCurrency = (value: string): number => {
  const cleaned = cleanNumericValue(value);
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formatea un rango de fechas
 */
export const formatDateRange = (startDate: string | Date | null | undefined, endDate: string | Date | null | undefined): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (!start && !end) return '';
  if (!start) return `Hasta ${end}`;
  if (!end) return `Desde ${start}`;
  
  return `${start} - ${end}`;
};

/**
 * Formatea duración en minutos a horas y minutos
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) return `${hours}h`;
  
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Formatea un color hexadecimal
 */
export const formatColor = (color: string | null | undefined): string => {
  if (!color) return '#000000';
  
  const cleaned = color.replace('#', '');
  
  if (cleaned.length === 3) {
    return `#${cleaned.split('').map(c => c + c).join('')}`;
  }
  
  if (cleaned.length === 6) {
    return `#${cleaned}`;
  }
  
  return '#000000';
};

/**
 * Pluraliza una palabra
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

/**
 * Formatea una lista de items
 */
export const formatList = (items: string[], conjunction: 'y' | 'o' = 'y'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  
  return `${otherItems.join(', ')} ${conjunction} ${lastItem}`;
};
