/**
 * MainLayout Component
 * 
 * Componente principal de layout que integra Header, Sidebar, PageContainer y Footer
 * en una estructura completa de aplicación. Maneja el estado de apertura/cierre del
 * sidebar y proporciona un layout responsive para toda la aplicación.
 * 
 * Features:
 * - Integración de todos los componentes de layout
 * - Sidebar colapsable con estado persistente
 * - Comportamiento responsive (mobile/tablet/desktop)
 * - Overlay para mobile cuando sidebar está abierto
 * - Transiciones suaves
 * - Áreas de contenido flexible
 * - Footer sticky opcional
 * 
 * @author Sistema POS-ERP
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// Props del componente MainLayout
export interface MainLayoutProps {
  children?: React.ReactNode;
  showFooter?: boolean;
  stickyFooter?: boolean;
  className?: string;
  initialSidebarOpen?: boolean;
  persistSidebarState?: boolean;
  sidebarStorageKey?: string;
}

/**
 * MainLayout Component
 * 
 * Layout principal de la aplicación que compone Header, Sidebar, Footer y área de contenido
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showFooter = true,
  stickyFooter = false,
  className = '',
  initialSidebarOpen = true,
  persistSidebarState = true,
  sidebarStorageKey = 'sidebar-open',
}) => {
  // Estado del sidebar (abierto/cerrado)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    // Si se debe persistir el estado, intentar cargar desde localStorage
    if (persistSidebarState) {
      try {
        const stored = localStorage.getItem(sidebarStorageKey);
        if (stored !== null) {
          return stored === 'true';
        }
      } catch (error) {
        console.error('Error al cargar el estado del sidebar:', error);
      }
    }
    return initialSidebarOpen;
  });

  // Estado para detectar si estamos en mobile
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Efecto para detectar el tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Verificar al montar
    checkMobile();

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Efecto para persistir el estado del sidebar
  useEffect(() => {
    if (persistSidebarState) {
      try {
        localStorage.setItem(sidebarStorageKey, String(sidebarOpen));
      } catch (error) {
        console.error('Error al guardar el estado del sidebar:', error);
      }
    }
  }, [sidebarOpen, persistSidebarState, sidebarStorageKey]);

  // Cerrar sidebar automáticamente en mobile cuando se abre
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      // En mobile, cerrar el sidebar después de hacer clic en un enlace
      // Esto se maneja mejor dentro del Sidebar, pero aquí podemos
      // cerrar el sidebar automáticamente al cambiar el tamaño a mobile
    }
  }, [isMobile]);

  // Handler para toggle del sidebar
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handler para cerrar el sidebar (usado en mobile cuando se hace clic en el overlay)
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Calcular el ancho del sidebar para el margen del contenido
  const sidebarWidth = sidebarOpen ? '16rem' : '4rem'; // w-64 : w-16

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      {/* Header - Fixed en la parte superior */}
      <Header
        onMenuClick={handleSidebarToggle}
        isSidebarCollapsed={!sidebarOpen}
      />

      {/* Contenedor principal con sidebar y contenido */}
      <div className="flex flex-1 pt-16 relative">
        {/* Sidebar - Fixed en el lado izquierdo */}
        <Sidebar
          isCollapsed={!sidebarOpen && !isMobile}
          isMobileOpen={sidebarOpen && isMobile}
          onClose={handleSidebarClose}
        />

        {/* Overlay para mobile cuando el sidebar está abierto */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
            onClick={handleSidebarClose}
            aria-hidden="true"
          />
        )}

        {/* Contenedor de contenido principal */}
        <main
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-16'}
            min-h-[calc(100vh-4rem)]
            ${showFooter && stickyFooter ? 'pb-0' : 'pb-6'}
          `}
          style={{
            // Asegurar que el contenido no se superponga con el sidebar en desktop
            minWidth: isMobile ? '100%' : 'calc(100% - ' + sidebarWidth + ')',
          }}
        >
          {/* Contenido de la página */}
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Footer - Opcional, puede ser sticky o no */}
      {showFooter && (
        <div
          className={`
            ${stickyFooter ? 'sticky bottom-0' : ''}
            ${isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-16'}
            transition-all duration-300 ease-in-out
            z-10
          `}
        >
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
