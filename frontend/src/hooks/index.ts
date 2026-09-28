/**
 * Custom Hooks - Barrel Export
 * Exporta todos los custom hooks para facilitar su importación
 */

export { useAuth } from './useAuth';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { usePagination } from './usePagination';
export type { PaginationOptions, PaginationResult } from './usePagination';
export { usePermissions } from './usePermissions';
export { useForm } from './useForm';
export type { 
  ValidationRule, 
  FieldConfig, 
  FormConfig, 
  FormErrors, 
  UseFormReturn 
} from './useForm';
export { useToast } from './useToast';
export type { Toast, ToastType, UseToastReturn } from './useToast';
export { useConfirm } from './useConfirm';
export type { 
  ConfirmOptions, 
  ConfirmState, 
  UseConfirmReturn 
} from './useConfirm';
