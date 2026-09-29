import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { formatDate } from '../../../utils/date-utils';

interface RecentSale {
  id: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

/**
 * RecentSales - Componente para mostrar ventas recientes
 * Muestra las últimas 5 ventas registradas en el sistema
 */
const RecentSales: React.FC = () => {
  // TODO: Integrar con datos reales del store cuando se implemente recentSales
  const sales: RecentSale[] = [
    {
      id: '1',
      clientName: 'Juan Pérez',
      amount: 125000,
      date: new Date().toISOString(),
      status: 'completed',
    },
    {
      id: '2',
      clientName: 'María García',
      amount: 89500,
      date: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed',
    },
    {
      id: '3',
      clientName: 'Carlos López',
      amount: 234800,
      date: new Date(Date.now() - 7200000).toISOString(),
      status: 'pending',
    },
    {
      id: '4',
      clientName: 'Ana Martínez',
      amount: 67300,
      date: new Date(Date.now() - 10800000).toISOString(),
      status: 'completed',
    },
    {
      id: '5',
      clientName: 'Pedro Rodríguez',
      amount: 156900,
      date: new Date(Date.now() - 14400000).toISOString(),
      status: 'completed',
    },
  ];

  const statusColors: Record<RecentSale['status'], string> = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<RecentSale['status'], string> = {
    completed: 'Completada',
    pending: 'Pendiente',
    cancelled: 'Cancelada',
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Ventas Recientes</h3>
        <div className="mt-6 flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {sales.map((sale: RecentSale) => (
              <li key={sale.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {sale.clientName}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {formatDate(sale.date, 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(sale.amount)}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[sale.status]
                      }`}
                    >
                      {statusLabels[sale.status]}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <a
            href="/ventas"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Ver todas las ventas
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
