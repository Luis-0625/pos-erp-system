/**
 * Validation utilities for form inputs and data validation
 */

import { REGEX, VALIDATION_RULES } from './constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Generic validator function type
 */
export type Validator<T = any> = (value: T) => ValidationResult;

/**
 * Validation helper
 */
const createValidationResult = (isValid: boolean, error?: string): ValidationResult => ({
  isValid,
  error,
});

// ============================================================================
// BASIC VALIDATORS
// ============================================================================

/**
 * Check if value is required (not empty)
 */
export const required = (message: string = 'Este campo es requerido'): Validator => {
  return (value: any): ValidationResult => {
    if (value === null || value === undefined) {
      return createValidationResult(false, message);
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return createValidationResult(false, message);
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check minimum length
 */
export const minLength = (min: number, message?: string): Validator<string> => {
  return (value: string): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    const length = value.length;
    if (length < min) {
      return createValidationResult(
        false,
        message || `Debe tener al menos ${min} caracteres`
      );
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check maximum length
 */
export const maxLength = (max: number, message?: string): Validator<string> => {
  return (value: string): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    const length = value.length;
    if (length > max) {
      return createValidationResult(
        false,
        message || `No debe exceder ${max} caracteres`
      );
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check minimum numeric value
 */
export const min = (minValue: number, message?: string): Validator<number> => {
  return (value: number): ValidationResult => {
    if (value === null || value === undefined) return createValidationResult(true);
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue) || numValue < minValue) {
      return createValidationResult(
        false,
        message || `El valor mínimo es ${minValue}`
      );
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check maximum numeric value
 */
export const max = (maxValue: number, message?: string): Validator<number> => {
  return (value: number): ValidationResult => {
    if (value === null || value === undefined) return createValidationResult(true);
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue) || numValue > maxValue) {
      return createValidationResult(
        false,
        message || `El valor máximo es ${maxValue}`
      );
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check if value matches a regular expression
 */
export const pattern = (regex: RegExp, message: string = 'Formato inválido'): Validator<string> => {
  return (value: string): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!regex.test(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

// ============================================================================
// EMAIL & CONTACT VALIDATORS
// ============================================================================

/**
 * Validate email address
 */
export const isValidEmail = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return REGEX.EMAIL.test(value);
};

/**
 * Email validator for forms
 */
export const email = (message: string = 'Email inválido'): Validator<string> => {
  return (value: string): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!isValidEmail(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Validate phone number
 */
export const isValidPhone = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return REGEX.PHONE.test(value);
};

/**
 * Phone validator for forms
 */
export const phone = (message: string = 'Teléfono inválido'): Validator<string> => {
  return (value: string): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!isValidPhone(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

// ============================================================================
// DOCUMENT VALIDATORS
// ============================================================================

/**
 * Validate NIT (Número de Identificación Tributaria)
 */
export const isValidNIT = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return REGEX.NIT.test(value);
};

/**
 * NIT validator for forms
 */
export const nit = (message: string = 'NIT inválido. Formato: 123456789-0'): Validator<string> => {
  return (value: string): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!isValidNIT(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Validate Colombian ID (Cédula de Ciudadanía)
 */
export const isValidCC = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return REGEX.DOCUMENT.test(value);
};

/**
 * Colombian ID validator for forms
 */
export const cc = (message: string = 'Cédula inválida. Solo números'): Validator<string> => {
  return (value: string): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!isValidCC(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

// ============================================================================
// PASSWORD VALIDATORS
// ============================================================================

/**
 * Password strength levels
 */
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong',
}

/**
 * Calculate password strength
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password || password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    return PasswordStrength.WEAK;
  }
  
  let score = 0;
  
  // Length
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) score++;
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) score++;
  
  // Contains numbers
  if (/[0-9]/.test(password)) score++;
  
  // Contains special characters
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) return PasswordStrength.WEAK;
  if (score <= 4) return PasswordStrength.MEDIUM;
  if (score <= 5) return PasswordStrength.STRONG;
  return PasswordStrength.VERY_STRONG;
};

/**
 * Check if password meets minimum requirements
 */
export const isValidPassword = (password: string): boolean => {
  if (!password) return false;
  
  // Minimum length
  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) return false;
  
  // Maximum length
  if (password.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH) return false;
  
  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Must contain at least one number
  if (!/[0-9]/.test(password)) return false;
  
  return true;
};

/**
 * Password validator for forms
 */
export const password = (message?: string): Validator<string> => {
  return (value: string): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!isValidPassword(value)) {
      return createValidationResult(
        false,
        message || `La contraseña debe tener al menos ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} caracteres, mayúsculas, minúsculas y números`
      );
    }
    
    return createValidationResult(true);
  };
};

/**
 * Password confirmation validator
 */
export const passwordConfirmation = (passwordValue: string, message: string = 'Las contraseñas no coinciden'): Validator<string> => {
  return (value: string): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (value !== passwordValue) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

// ============================================================================
// NUMERIC VALIDATORS
// ============================================================================

/**
 * Check if value is a valid number
 */
export const isValidNumber = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return false;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && isFinite(num);
};

/**
 * Number validator for forms
 */
export const number = (message: string = 'Debe ser un número válido'): Validator => {
  return (value: any): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return createValidationResult(true);
    }
    
    if (!isValidNumber(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check if value is a positive number
 */
export const isPositive = (value: number): boolean => {
  return isValidNumber(value) && value > 0;
};

/**
 * Positive number validator
 */
export const positive = (message: string = 'Debe ser un número positivo'): Validator<number> => {
  return (value: number): ValidationResult => {
    if (value === null || value === undefined) return createValidationResult(true);
    
    if (!isPositive(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check if value is a non-negative number (including zero)
 */
export const isNonNegative = (value: number): boolean => {
  return isValidNumber(value) && value >= 0;
};

/**
 * Non-negative number validator
 */
export const nonNegative = (message: string = 'No puede ser negativo'): Validator<number> => {
  return (value: number): ValidationResult => {
    if (value === null || value === undefined) return createValidationResult(true);
    
    if (!isNonNegative(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check if value is an integer
 */
export const isInteger = (value: any): boolean => {
  if (!isValidNumber(value)) return false;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isInteger(num);
};

/**
 * Integer validator
 */
export const integer = (message: string = 'Debe ser un número entero'): Validator => {
  return (value: any): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return createValidationResult(true);
    }
    
    if (!isInteger(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

// ============================================================================
// CURRENCY & PRICE VALIDATORS
// ============================================================================

/**
 * Check if value is a valid price (max 2 decimals)
 */
export const isValidPrice = (value: number): boolean => {
  if (!isValidNumber(value)) return false;
  
  // Check if has more than 2 decimal places
  const decimal = value.toString().split('.')[1];
  if (decimal && decimal.length > 2) return false;
  
  return value >= 0;
};

/**
 * Price validator
 */
export const price = (message: string = 'Precio inválido'): Validator<number> => {
  return (value: number): ValidationResult => {
    if (value === null || value === undefined) return createValidationResult(true);
    
    if (!isValidPrice(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

// ============================================================================
// DATE VALIDATORS
// ============================================================================

/**
 * Check if value is a valid date
 */
export const isValidDate = (value: any): boolean => {
  if (!value) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Date validator
 */
export const date = (message: string = 'Fecha inválida'): Validator => {
  return (value: any): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!isValidDate(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check if date is in the past
 */
export const isPastDate = (value: Date | string): boolean => {
  if (!isValidDate(value)) return false;
  const date = new Date(value);
  return date < new Date();
};

/**
 * Past date validator
 */
export const pastDate = (message: string = 'La fecha debe ser anterior a hoy'): Validator => {
  return (value: any): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!isPastDate(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (value: Date | string): boolean => {
  if (!isValidDate(value)) return false;
  const date = new Date(value);
  return date > new Date();
};

/**
 * Future date validator
 */
export const futureDate = (message: string = 'La fecha debe ser posterior a hoy'): Validator => {
  return (value: any): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!isFutureDate(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Date range validator
 */
export const dateRange = (startDate: Date | string, endDate: Date | string, message: string = 'Rango de fechas inválido'): Validator => {
  return (value: any): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!isValidDate(value)) {
      return createValidationResult(false, 'Fecha inválida');
    }
    
    const date = new Date(value);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (date < start || date > end) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

// ============================================================================
// FILE VALIDATORS
// ============================================================================

/**
 * Check file size
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  if (!file) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * File size validator
 */
export const fileSize = (maxSizeInMB: number, message?: string): Validator<File> => {
  return (file: File): ValidationResult => {
    if (!file) return createValidationResult(true);
    
    if (!isValidFileSize(file, maxSizeInMB)) {
      return createValidationResult(
        false,
        message || `El archivo no debe exceder ${maxSizeInMB}MB`
      );
    }
    
    return createValidationResult(true);
  };
};

/**
 * Check file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  if (!file) return false;
  return allowedTypes.some(type => {
    if (type.includes('*')) {
      const category = type.split('/')[0];
      return file.type.startsWith(category);
    }
    return file.type === type;
  });
};

/**
 * File type validator
 */
export const fileType = (allowedTypes: string[], message?: string): Validator<File> => {
  return (file: File): ValidationResult => {
    if (!file) return createValidationResult(true);
    
    if (!isValidFileType(file, allowedTypes)) {
      return createValidationResult(
        false,
        message || `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`
      );
    }
    
    return createValidationResult(true);
  };
};

// ============================================================================
// ARRAY VALIDATORS
// ============================================================================

/**
 * Minimum array length validator
 */
export const minItems = (min: number, message?: string): Validator<any[]> => {
  return (value: any[]): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!Array.isArray(value) || value.length < min) {
      return createValidationResult(
        false,
        message || `Debe seleccionar al menos ${min} elemento(s)`
      );
    }
    
    return createValidationResult(true);
  };
};

/**
 * Maximum array length validator
 */
export const maxItems = (max: number, message?: string): Validator<any[]> => {
  return (value: any[]): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!Array.isArray(value) || value.length > max) {
      return createValidationResult(
        false,
        message || `No puede seleccionar más de ${max} elemento(s)`
      );
    }
    
    return createValidationResult(true);
  };
};

// ============================================================================
// CUSTOM VALIDATORS
// ============================================================================

/**
 * Custom validator
 */
export const custom = (
  validatorFn: (value: any) => boolean,
  message: string = 'Valor inválido'
): Validator => {
  return (value: any): ValidationResult => {
    if (!value) return createValidationResult(true);
    
    if (!validatorFn(value)) {
      return createValidationResult(false, message);
    }
    
    return createValidationResult(true);
  };
};

/**
 * Async validator wrapper
 * Note: This returns a function that returns a Promise<ValidationResult>
 * Use it separately from synchronous validators
 */
export const asyncValidator = (
  validatorFn: (value: any) => Promise<boolean>,
  message: string = 'Validación fallida'
) => {
  return async (value: any): Promise<ValidationResult> => {
    if (!value) return createValidationResult(true);
    
    try {
      const isValid = await validatorFn(value);
      if (!isValid) {
        return createValidationResult(false, message);
      }
      return createValidationResult(true);
    } catch (error) {
      return createValidationResult(false, message);
    }
  };
};

// ============================================================================
// COMPOSITE VALIDATORS
// ============================================================================

/**
 * Combine multiple validators
 */
export const compose = (...validators: Validator[]): Validator => {
  return (value: any): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return createValidationResult(true);
  };
};

/**
 * Conditional validator - only validate if condition is met
 */
export const when = (
  condition: (value: any) => boolean,
  validator: Validator
): Validator => {
  return (value: any): ValidationResult => {
    if (!condition(value)) {
      return createValidationResult(true);
    }
    return validator(value);
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate an object against a schema
 */
export const validateObject = (
  obj: Record<string, any>,
  schema: Record<string, Validator | Validator[]>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  for (const [field, validators] of Object.entries(schema)) {
    const value = obj[field];
    const validatorArray = Array.isArray(validators) ? validators : [validators];
    
    for (const validator of validatorArray) {
      const result = validator(value);
      if (!result.isValid) {
        errors[field] = result.error!;
        break; // Stop at first error for this field
      }
    }
  }
  
  return errors;
};

/**
 * Check if validation errors object is empty
 */
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};
