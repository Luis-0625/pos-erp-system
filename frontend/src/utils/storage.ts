/**
 * Storage Utilities
 * 
 * Utilidades para trabajar con localStorage y sessionStorage de manera segura
 * Incluye manejo de errores, serialización automática y tipado
 */

/**
 * Tipos de storage disponibles
 */
export type StorageType = 'local' | 'session';

/**
 * Opciones para almacenamiento con expiración
 */
interface StorageOptions {
  expiresIn?: number; // Tiempo de expiración en milisegundos
}

/**
 * Estructura para datos con expiración
 */
interface StorageItem<T> {
  value: T;
  expiresAt?: number;
}

/**
 * Clase base para manejo de storage
 */
class StorageManager {
  private storage: Storage;

  constructor(storageType: StorageType = 'local') {
    this.storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
  }

  /**
   * Verifica si el storage está disponible
   */
  private isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Guarda un valor en el storage
   */
  set<T>(key: string, value: T, options?: StorageOptions): boolean {
    if (!this.isAvailable()) {
      console.warn('Storage no está disponible');
      return false;
    }

    try {
      const item: StorageItem<T> = {
        value,
        expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : undefined,
      };

      const serializedValue = JSON.stringify(item);
      this.storage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error al guardar en storage: ${error}`);
      return false;
    }
  }

  /**
   * Obtiene un valor del storage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) {
      return defaultValue ?? null;
    }

    try {
      const serializedValue = this.storage.getItem(key);

      if (serializedValue === null) {
        return defaultValue ?? null;
      }

      const item: StorageItem<T> = JSON.parse(serializedValue);

      // Verificar expiración
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.remove(key);
        return defaultValue ?? null;
      }

      return item.value;
    } catch (error) {
      console.error(`Error al leer del storage: ${error}`);
      return defaultValue ?? null;
    }
  }

  /**
   * Elimina un valor del storage
   */
  remove(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error al eliminar del storage: ${error}`);
      return false;
    }
  }

  /**
   * Limpia todo el storage
   */
  clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error(`Error al limpiar el storage: ${error}`);
      return false;
    }
  }

  /**
   * Verifica si una clave existe en el storage
   */
  has(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    return this.storage.getItem(key) !== null;
  }

  /**
   * Obtiene todas las claves del storage
   */
  keys(): string[] {
    if (!this.isAvailable()) {
      return [];
    }

    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Obtiene el tamaño del storage en bytes (aproximado)
   */
  size(): number {
    if (!this.isAvailable()) {
      return 0;
    }

    let size = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        const value = this.storage.getItem(key);
        size += key.length + (value?.length || 0);
      }
    }
    return size;
  }

  /**
   * Obtiene el tamaño del storage en formato legible
   */
  sizeFormatted(): string {
    const bytes = this.size();
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Obtiene todos los items del storage
   */
  getAll(): Record<string, any> {
    if (!this.isAvailable()) {
      return {};
    }

    const items: Record<string, any> = {};
    const keys = this.keys();

    keys.forEach((key) => {
      items[key] = this.get(key);
    });

    return items;
  }

  /**
   * Establece múltiples valores a la vez
   */
  setMultiple(items: Record<string, any>, options?: StorageOptions): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      Object.entries(items).forEach(([key, value]) => {
        this.set(key, value, options);
      });
      return true;
    } catch (error) {
      console.error(`Error al guardar múltiples items: ${error}`);
      return false;
    }
  }

  /**
   * Elimina múltiples claves a la vez
   */
  removeMultiple(keys: string[]): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      keys.forEach((key) => {
        this.remove(key);
      });
      return true;
    } catch (error) {
      console.error(`Error al eliminar múltiples items: ${error}`);
      return false;
    }
  }

  /**
   * Elimina items expirados
   */
  clearExpired(): number {
    if (!this.isAvailable()) {
      return 0;
    }

    const keys = this.keys();
    let cleared = 0;

    keys.forEach((key) => {
      try {
        const serializedValue = this.storage.getItem(key);
        if (serializedValue) {
          const item: StorageItem<any> = JSON.parse(serializedValue);
          if (item.expiresAt && Date.now() > item.expiresAt) {
            this.remove(key);
            cleared++;
          }
        }
      } catch (error) {
        // Ignorar errores de parseo
      }
    });

    return cleared;
  }
}

// Instancias singleton
const localStorage = new StorageManager('local');
const sessionStorage = new StorageManager('session');

// Exportar instancias
export { localStorage, sessionStorage };

/**
 * Funciones de conveniencia para localStorage
 */

export const setLocal = <T>(key: string, value: T, options?: StorageOptions): boolean => {
  return localStorage.set(key, value, options);
};

export const getLocal = <T>(key: string, defaultValue?: T): T | null => {
  return localStorage.get<T>(key, defaultValue);
};

export const removeLocal = (key: string): boolean => {
  return localStorage.remove(key);
};

export const clearLocal = (): boolean => {
  return localStorage.clear();
};

export const hasLocal = (key: string): boolean => {
  return localStorage.has(key);
};

/**
 * Funciones de conveniencia para sessionStorage
 */

export const setSession = <T>(key: string, value: T, options?: StorageOptions): boolean => {
  return sessionStorage.set(key, value, options);
};

export const getSession = <T>(key: string, defaultValue?: T): T | null => {
  return sessionStorage.get<T>(key, defaultValue);
};

export const removeSession = (key: string): boolean => {
  return sessionStorage.remove(key);
};

export const clearSession = (): boolean => {
  return sessionStorage.clear();
};

export const hasSession = (key: string): boolean => {
  return sessionStorage.has(key);
};

/**
 * Constantes para claves de storage comunes
 */
export const STORAGE_KEYS = {
  // Auth
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  REMEMBER_ME: 'remember_me',
  LAST_LOGIN: 'last_login',

  // UI State
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  TABLE_PREFERENCES: 'table_preferences',
  DASHBOARD_LAYOUT: 'dashboard_layout',

  // App State
  ACTIVE_COMPANY: 'active_company',
  LAST_ROUTE: 'last_route',
  CART: 'cart',
  DRAFT_SALES: 'draft_sales',
  DRAFT_PURCHASES: 'draft_purchases',
  FILTERS: 'filters',
  SEARCH_HISTORY: 'search_history',

  // Settings
  NOTIFICATION_SETTINGS: 'notification_settings',
  DISPLAY_SETTINGS: 'display_settings',
  PRINT_SETTINGS: 'print_settings',

  // Cache
  PRODUCTS_CACHE: 'products_cache',
  CATEGORIES_CACHE: 'categories_cache',
  CLIENTS_CACHE: 'clients_cache',
  SUPPLIERS_CACHE: 'suppliers_cache',
} as const;

/**
 * Funciones específicas de la aplicación
 */

/**
 * Guarda el token de autenticación
 */
export const saveAuthToken = (token: string, rememberMe: boolean = false): void => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Obtiene el token de autenticación
 */
export const getAuthToken = (): string | null => {
  return (
    localStorage.get<string>(STORAGE_KEYS.AUTH_TOKEN) ||
    sessionStorage.get<string>(STORAGE_KEYS.AUTH_TOKEN)
  );
};

/**
 * Elimina el token de autenticación
 */
export const removeAuthToken = (): void => {
  localStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
  sessionStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Guarda datos del usuario
 */
export const saveUserData = (user: any, rememberMe: boolean = false): void => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.set(STORAGE_KEYS.USER_DATA, user);
};

/**
 * Obtiene datos del usuario
 */
export const getUserData = <T = any>(): T | null => {
  return (
    localStorage.get<T>(STORAGE_KEYS.USER_DATA) ||
    sessionStorage.get<T>(STORAGE_KEYS.USER_DATA)
  );
};

/**
 * Elimina datos del usuario
 */
export const removeUserData = (): void => {
  localStorage.remove(STORAGE_KEYS.USER_DATA);
  sessionStorage.remove(STORAGE_KEYS.USER_DATA);
};

/**
 * Limpia todos los datos de autenticación
 */
export const clearAuthData = (): void => {
  removeAuthToken();
  removeUserData();
  localStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.remove(STORAGE_KEYS.REMEMBER_ME);
};

/**
 * Guarda el tema de la aplicación
 */
export const saveTheme = (theme: 'light' | 'dark'): void => {
  localStorage.set(STORAGE_KEYS.THEME, theme);
};

/**
 * Obtiene el tema de la aplicación
 */
export const getTheme = (): 'light' | 'dark' | null => {
  return localStorage.get<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light');
};

/**
 * Guarda el estado del sidebar
 */
export const saveSidebarState = (collapsed: boolean): void => {
  localStorage.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed);
};

/**
 * Obtiene el estado del sidebar
 */
export const getSidebarState = (): boolean => {
  return localStorage.get<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED, false) ?? false;
};

/**
 * Guarda el carrito de compras (para POS)
 */
export const saveCart = (cart: any): void => {
  localStorage.set(STORAGE_KEYS.CART, cart);
};

/**
 * Obtiene el carrito de compras
 */
export const getCart = <T = any>(): T | null => {
  return localStorage.get<T>(STORAGE_KEYS.CART);
};

/**
 * Limpia el carrito de compras
 */
export const clearCart = (): void => {
  localStorage.remove(STORAGE_KEYS.CART);
};

/**
 * Guarda un borrador de venta
 */
export const saveDraftSale = (draft: any): void => {
  const drafts = localStorage.get<any[]>(STORAGE_KEYS.DRAFT_SALES, []) || [];
  drafts.push(draft);
  localStorage.set(STORAGE_KEYS.DRAFT_SALES, drafts);
};

/**
 * Obtiene borradores de ventas
 */
export const getDraftSales = <T = any>(): T[] => {
  return localStorage.get<T[]>(STORAGE_KEYS.DRAFT_SALES, []) || [];
};

/**
 * Limpia borradores de ventas
 */
export const clearDraftSales = (): void => {
  localStorage.remove(STORAGE_KEYS.DRAFT_SALES);
};

/**
 * Guarda preferencias de tabla
 */
export const saveTablePreferences = (tableId: string, preferences: any): void => {
  const allPreferences = localStorage.get<Record<string, any>>(STORAGE_KEYS.TABLE_PREFERENCES, {}) || {};
  allPreferences[tableId] = preferences;
  localStorage.set(STORAGE_KEYS.TABLE_PREFERENCES, allPreferences);
};

/**
 * Obtiene preferencias de tabla
 */
export const getTablePreferences = <T = any>(tableId: string): T | null => {
  const allPreferences = localStorage.get<Record<string, any>>(STORAGE_KEYS.TABLE_PREFERENCES, {}) || {};
  return allPreferences[tableId] || null;
};

/**
 * Guarda historial de búsqueda
 */
export const saveSearchHistory = (module: string, term: string, maxItems: number = 10): void => {
  const history = localStorage.get<Record<string, string[]>>(STORAGE_KEYS.SEARCH_HISTORY, {}) || {};
  
  if (!history[module]) {
    history[module] = [];
  }

  // Eliminar si ya existe
  history[module] = history[module].filter((item) => item !== term);
  
  // Agregar al inicio
  history[module].unshift(term);
  
  // Limitar cantidad
  history[module] = history[module].slice(0, maxItems);
  
  localStorage.set(STORAGE_KEYS.SEARCH_HISTORY, history);
};

/**
 * Obtiene historial de búsqueda
 */
export const getSearchHistory = (module: string): string[] => {
  const history = localStorage.get<Record<string, string[]>>(STORAGE_KEYS.SEARCH_HISTORY, {}) || {};
  return history[module] || [];
};

/**
 * Limpia historial de búsqueda
 */
export const clearSearchHistory = (module?: string): void => {
  if (module) {
    const history = localStorage.get<Record<string, string[]>>(STORAGE_KEYS.SEARCH_HISTORY, {}) || {};
    delete history[module];
    localStorage.set(STORAGE_KEYS.SEARCH_HISTORY, history);
  } else {
    localStorage.remove(STORAGE_KEYS.SEARCH_HISTORY);
  }
};

/**
 * Exportar clase StorageManager para uso avanzado
 */
export { StorageManager };
export default localStorage;
