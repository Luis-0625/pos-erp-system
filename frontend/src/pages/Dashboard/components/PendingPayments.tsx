import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { formatDate } from '../../../utils/date-utils';

interface PendingPayment {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  type: 'receivable' | 'payable';
}

/**
 * PendingPayments - Componente para mostrar pagos pendientes
 * Muestra cuentas por cobrar y por pagar que están próximas o vencidas
 */
const PendingPayments: React.FC = () => {
  // Por ahora usamos datos de ejemplo
  // TODO: Integrar con datos reales del store cuando se implemente pendingPayments
  const payments: PendingPayment[] = [
    {
      id: '1',
      clientName: 'Comercial López SAS',
      amount: 2450000,
      dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      daysOverdue: 5,
      type: 'receivable',
    },
    {
      id: '2',
      clientName: 'Distribuidora García',
      amount: 1890000,
      dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      daysOverdue: 2,
      type: 'receivable',
    },
    {
      id: '3',
      clientName: 'Proveedor Tech SA',
      amount: 3200000,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      daysOverdue: 0,
      type: 'payable',
    },
    {
      id: '4',
      clientName: 'Almacén Central',
      amount: 980000,
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      daysOverdue: 1,
      type: 'receivable',
    },
    {
      id: '5',
      clientName: 'Importadora Global',
      amount: 5600000,
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      daysOverdue: 0,
      type: 'payable',
    },
  ];

  const getStatusBadge = (payment: PendingPayment) => {
    if (payment.daysOverdue > 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          Vencido {payment.daysOverdue} {payment.daysOverdue === 1 ? 'día' : 'días'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        Pendiente
      </span>
    );
  };

  const getTypeIcon = (type: PendingPayment['type']) => {
    if (type === 'receivable') {
      return (
        <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
        </div>
      );
    }
    return (
      <div className="flex-shrink-0 rounded-full bg-red-100 p-2">
        <svg
          className="h-5 w-5 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 13l-5 5m0 0l-5-5m5 5V6"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Pagos Pendientes</h3>
          <span className="text-sm text-gray-500">
            {payments.filter((p: PendingPayment) => p.daysOverdue > 0).length} vencidos
          </span>
        </div>
        <div className="mt-6">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {payments.map((payment: PendingPayment) => (
                <li key={payment.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    {getTypeIcon(payment.type)}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {payment.clientName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">
                          Vence: {formatDate(payment.dueDate, 'dd/MM/yyyy')}
                        </p>
                        {getStatusBadge(payment)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.type === 'receivable' ? 'Por cobrar' : 'Por pagar'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <a
            href="/cartera/cuentas-por-cobrar"
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Ver por cobrar
          </a>
          <a
            href="/cartera/cuentas-por-pagar"
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Ver por pagar
          </a>
        </div>
      </div>
    </div>
  );
};

export default PendingPayments;
