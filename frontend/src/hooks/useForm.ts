import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validate?: (value: T) => boolean | string;
}

export interface FieldConfig {
  value: any;
  rules?: ValidationRule;
}

export interface FormConfig {
  [key: string]: FieldConfig;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  touched: { [key: string]: boolean };
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => string;
  validateForm: () => boolean;
}

/**
 * Custom hook para gestionar formularios con validación
 * Proporciona manejo de estado, validación y eventos de formulario
 */
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule>> = {},
  onSubmit: (values: T) => void | Promise<void>
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Valida un campo individual según sus reglas
   */
  const validateField = useCallback(
    (field: keyof T): string => {
      const value = values[field];
      const rules = validationRules[field];

      if (!rules) return '';

      // Required
      if (rules.required && !value) {
        return 'Este campo es requerido';
      }

      // Skip other validations if empty and not required
      if (!value) return '';

      // MinLength
      if (rules.minLength && String(value).length < rules.minLength) {
        return `Mínimo ${rules.minLength} caracteres`;
      }

      // MaxLength
      if (rules.maxLength && String(value).length > rules.maxLength) {
        return `Máximo ${rules.maxLength} caracteres`;
      }

      // Min (for numbers)
      if (rules.min !== undefined && Number(value) < rules.min) {
        return `El valor mínimo es ${rules.min}`;
      }

      // Max (for numbers)
      if (rules.max !== undefined && Number(value) > rules.max) {
        return `El valor máximo es ${rules.max}`;
      }

      // Pattern
      if (rules.pattern && !rules.pattern.test(String(value))) {
        return 'Formato inválido';
      }

      // Custom validation
      if (rules.validate) {
        const result = rules.validate(value);
        if (typeof result === 'string') return result;
        if (!result) return 'Validación fallida';
      }

      return '';
    },
    [values, validationRules]
  );

  /**
   * Valida todos los campos del formulario
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field as keyof T);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, validationRules]);

  /**
   * Maneja cambios en los campos del formulario
   */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      
      let fieldValue: any = value;
      
      // Handle checkbox
      if (type === 'checkbox') {
        fieldValue = (e.target as HTMLInputElement).checked;
      }
      
      // Handle number inputs
      if (type === 'number') {
        fieldValue = value === '' ? '' : Number(value);
      }

      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  /**
   * Maneja el evento blur para validación al salir del campo
   */
  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name as keyof T);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField]
  );

  /**
   * Establece el valor de un campo específico
   */
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * Establece el error de un campo específico
   */
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field as string]: error,
    }));
  }, []);

  /**
   * Marca un campo como tocado o no
   */
  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched((prev) => ({
      ...prev,
      [field as string]: isTouched,
    }));
  }, []);

  /**
   * Resetea el formulario a los valores iniciales
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Marca todos los campos como tocados
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Valida el formulario
      const isValid = validateForm();

      if (!isValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  // Verifica si el formulario es válido
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm,
  };
};
