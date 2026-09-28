import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Página No Encontrada
        </h2>
        <p className="mb-2 text-lg text-gray-600">
          La página que buscas no existe
        </p>
        <p className="mb-8 text-sm text-gray-500">
          {location.pathname}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
          >
            Volver
          </button>
          <button
            onClick={() => navigate('/')}
            className="rounded-md bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
