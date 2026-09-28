import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-danger-100">
            <svg
              className="h-12 w-12 text-danger-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Acceso Denegado
        </h1>
        <p className="mb-2 text-lg text-gray-600">
          No tienes permisos para acceder a esta página
        </p>
        <p className="mb-8 text-sm text-gray-500">
          {location.state?.from?.pathname || 'Ruta solicitada'} requiere permisos adicionales
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
          >
            Volver
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-md bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
