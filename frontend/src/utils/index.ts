/**
 * Utilities Index
 *
 * Barrel export para todas las utilidades de la aplicación
 *
 * Nota: Algunas funciones tienen nombres duplicados entre módulos.
 * Se exportan con alias para evitar conflictos.
 */

// ============================================================================
// CONSTANTS
// ============================================================================
export {
  API_BASE_URL,
  API_TIMEOUT,
  TOKEN_KEY,
  USER_KEY,
  REFRESH_TOKEN_KEY,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  ROLES,
  type Role,
  PERMISSIONS,
  type Permission,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  DOCUMENT_STATUS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
  CLIENT_TYPES,
  CLIENT_TYPE_LABELS,
  INVENTORY_MOVEMENT_TYPES,
  INVENTORY_MOVEMENT_TYPE_LABELS,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  ISO_DATE_FORMAT,
  ISO_DATETIME_FORMAT,
  CURRENCY_CODE,
  CURRENCY_SYMBOL,
  DECIMAL_PLACES,
  VALIDATION_RULES,
  REGEX,
  TOAST_DURATION,
  DEBOUNCE_DELAY,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  CHART_COLORS,
  STATUS,
  STATUS_LABELS,
  STATUS_COLORS,
  STORAGE_KEYS,
  ROUTES,
  type Route,
} from './constants';

// ============================================================================
// FORMATTERS
// ============================================================================
export {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate as formatDateFormatter,
  formatDateTime as formatDateTimeFormatter,
  formatTime as formatTimeFormatter,
  formatRelativeTime,
  formatDocument,
  formatPhone,
  formatBarcode,
  formatSKU,
  capitalize,
  capitalizeWords,
  truncate as truncateFormatter,
  formatFileSize,
  formatInvoiceNumber,
  getInitials as getInitialsFormatter,
  formatFullName,
  formatAddress,
  cleanNumericValue,
  parseCurrency,
  formatDateRange as formatDateRangeFormatter,
  formatDuration,
  formatColor,
  pluralize,
  formatList,
} from './formatters';

// ============================================================================
// VALIDATORS
// ============================================================================
export {
  type ValidationResult,
  type Validator,
  required,
  minLength,
  maxLength,
  min as minValidator,
  max as maxValidator,
  pattern,
  isValidEmail,
  email,
  isValidPhone,
  phone,
  isValidNIT,
  nit,
  isValidCC,
  cc,
  PasswordStrength,
  getPasswordStrength,
  isValidPassword,
  password,
  passwordConfirmation,
  isValidNumber,
  number,
  isPositive,
  positive,
  isNonNegative,
  nonNegative,
  isInteger,
  integer,
  isValidPrice,
  price,
  isValidDate as isValidDateValidator,
  date,
  isPastDate,
  pastDate,
  isFutureDate,
  futureDate,
  dateRange,
  isValidFileSize,
  fileSize,
  isValidFileType,
  fileType,
  minItems,
  maxItems,
  custom,
  compose,
  when,
  validateObject,
  hasErrors,
} from './validators';

// ============================================================================
// HELPERS
// ============================================================================
export {
  generateId,
  generateUUID,
  sleep,
  deepClone,
  deepMerge,
  isObject,
  isEmpty,
  isNotEmpty,
  get,
  set,
  omit,
  pick,
  groupBy,
  unique,
  uniqueBy,
  sortBy,
  chunk,
  flatten,
  sum,
  average,
  min as minHelper,
  max as maxHelper,
  clamp,
  roundTo,
  percentage,
  percentageChange,
  retry,
  debounce,
  throttle,
  copyToClipboard,
  downloadBlob,
  downloadJSON,
  downloadCSV,
  parseQueryString,
  buildQueryString,
  getFileExtension,
  getFilenameWithoutExtension,
  bytesToSize,
  scrollToElement,
  scrollToTop,
  isInViewport,
  formatDocumentNumber,
  calculateDueDate,
  daysUntilDue,
  isOverdue,
  calculateTotal,
  calculateSubtotal,
  calculateTax,
  applyDiscount,
  calculateDiscount,
  isDocumentActive,
  getInitials as getInitialsHelper,
  truncate as truncateHelper,
  mask,
  sanitizeFilename,
  randomColor,
  getContrastColor,
  compare,
} from './helpers';

// ============================================================================
// DATE UTILITIES
// ============================================================================
export {
  formatDate,
  formatDateTime,
  formatTime,
  parseDate,
  parseISODate,
  isValidDate,
  now,
  today,
  tomorrow,
  yesterday,
  addDaysToDate,
  subtractDays,
  addMonthsToDate,
  subtractMonths,
  addYearsToDate,
  subtractYears,
  daysBetween,
  monthsBetween,
  yearsBetween,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  isDateAfter,
  isDateBefore,
  isSameDayAs,
  isSameMonthAs,
  isSameYearAs,
  isDateWithinInterval,
  isToday,
  isPast,
  isFuture,
  getDateRange,
  formatDateRange,
  getRelativeTime,
  getAge,
  getDaysInMonth,
  getMonthName,
  getDayName,
  toISOString,
  toISODate,
  getBusinessDaysBetween,
  isWeekend,
  isWeekday,
  getNextBusinessDay,
  getPreviousBusinessDay,
  getQuarter,
  getStartOfQuarter,
  getEndOfQuarter,
} from './date-utils';

// ============================================================================
// STORAGE UTILITIES
// ============================================================================
export {
  type StorageType,
  StorageManager,
  localStorage,
  sessionStorage,
  setLocal,
  getLocal,
  removeLocal,
  clearLocal,
  hasLocal,
  setSession,
  getSession,
  removeSession,
  clearSession,
  hasSession,
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  saveUserData,
  getUserData,
  removeUserData,
  clearAuthData,
  saveTheme,
  getTheme,
  saveSidebarState,
  getSidebarState,
  saveCart,
  getCart,
  clearCart,
  saveDraftSale,
  getDraftSales,
  clearDraftSales,
  saveTablePreferences,
  getTablePreferences,
  saveSearchHistory,
  getSearchHistory,
  clearSearchHistory,
} from './storage';

// ============================================================================
// RE-EXPORTS WITH RECOMMENDED NAMING
// ============================================================================

/**
 * Funciones con nombres preferidos (aliases recomendados)
 */

// Formatters (para UI/Display)
export { formatDate as formatDateUI } from './formatters';
export { formatDateTime as formatDateTimeUI } from './formatters';
export { formatTime as formatTimeUI } from './formatters';
export { formatDateRange as formatDateRangeUI } from './formatters';
export { getInitials as getInitialsUI } from './formatters';
export { truncate as truncateUI } from './formatters';

// Date-utils (para manipulación de fechas)
export { formatDate as formatDateUtil } from './date-utils';
export { formatDateTime as formatDateTimeUtil } from './date-utils';
export { formatTime as formatTimeUtil } from './date-utils';
export { formatDateRange as formatDateRangeUtil } from './date-utils';

// Validators (para validación)
export { min as validateMin } from './validators';
export { max as validateMax } from './validators';
export { isValidDate as validateDate } from './validators';

// Helpers (para cálculos/lógica)
export { min as minValue } from './helpers';
export { max as maxValue } from './helpers';
export { getInitials as initials } from './helpers';
export { truncate as truncateText } from './helpers';

// Default exports
export { default as storage } from './storage';
