/**
 * Barrel export para componentes de feedback
 * 
 * Este archivo centraliza las exportaciones de todos los componentes
 * de feedback del sistema, facilitando las importaciones en otros módulos.
 * 
 * @module components/feedback
 */

// Modal Component
export { default as Modal } from './Modal';
export type { ModalProps } from './Modal';

// Toast Component y Provider
export { default as Toast, ToastProvider, useToast } from './Toast';
export type { ToastProps, ToastType, ToastPosition } from './Toast';

// ConfirmDialog Component y Provider
export {
  default as ConfirmDialog,
  ConfirmDialogProvider,
  useConfirmDialog,
  useConfirm,
  createConfirmDialog
} from './ConfirmDialog';
export type {
  ConfirmDialogOptions,
  ConfirmDialogType
} from './ConfirmDialog';

// ErrorBoundary Component
export { 
  default as ErrorBoundary, 
  useErrorHandler, 
  withErrorBoundary 
} from './ErrorBoundary';
export type { ErrorBoundaryProps } from './ErrorBoundary';
