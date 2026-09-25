import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';

// Páginas (se crearán después)
// import Login from './pages/auth/Login';
// import Dashboard from './pages/Dashboard';
// import Products from './pages/products/Products';
// import Sales from './pages/sales/Sales';
// import Clients from './pages/clients/Clients';
// import Portfolio from './pages/portfolio/Portfolio';

// Layout
// import MainLayout from './components/layout/MainLayout';
// import AuthLayout from './components/layout/AuthLayout';

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="App">
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="card w-full max-w-md">
                  <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
                    POS ERP System
                  </h1>
                  <p className="text-center text-gray-600">
                    Sistema de Punto de Venta y Gestión Empresarial
                  </p>
                  <div className="mt-8">
                    <p className="text-center text-sm text-gray-500">
                      Página de login en construcción...
                    </p>
                  </div>
                </div>
              </div>
            )
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="card w-full max-w-4xl">
                  <h1 className="mb-4 text-3xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Bienvenido al Sistema POS ERP
                  </p>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-primary-50 p-6">
                      <h3 className="text-lg font-semibold text-primary-900">
                        Ventas
                      </h3>
                      <p className="mt-2 text-sm text-primary-700">
                        Módulo en construcción
                      </p>
                    </div>
                    <div className="rounded-lg bg-success-50 p-6">
                      <h3 className="text-lg font-semibold text-success-900">
                        Inventario
                      </h3>
                      <p className="mt-2 text-sm text-success-700">
                        Módulo en construcción
                      </p>
                    </div>
                    <div className="rounded-lg bg-warning-50 p-6">
                      <h3 className="text-lg font-semibold text-warning-900">
                        Cartera
                      </h3>
                      <p className="mt-2 text-sm text-warning-700">
                        Módulo en construcción
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Ruta por defecto */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
          }
        />

        {/* Ruta 404 */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
              <div className="card text-center">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <p className="mt-4 text-xl text-gray-600">
                  Página no encontrada
                </p>
                <a
                  href="/"
                  className="btn btn-primary mt-8 inline-block"
                >
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
