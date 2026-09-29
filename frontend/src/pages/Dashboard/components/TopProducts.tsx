import React from 'react';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

interface TopProduct {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

/**
 * TopProducts - Componente para mostrar productos más vendidos
 * Muestra los 5 productos con mayor cantidad de ventas
 */
const TopProducts: React.FC = () => {
  // Por ahora usamos datos de ejemplo
  // TODO: Integrar con datos reales del store cuando se implemente topProducts
  const products: TopProduct[] = [
    {
      id: '1',
      name: 'Laptop Dell Inspiron 15',
      unitsSold: 45,
      revenue: 67500000,
    },
    {
      id: '2',
      name: 'Mouse Logitech MX Master 3',
      unitsSold: 128,
      revenue: 25600000,
    },
    {
      id: '3',
      name: 'Teclado Mecánico Corsair K95',
      unitsSold: 87,
      revenue: 43500000,
    },
    {
      id: '4',
      name: 'Monitor Samsung 27" 4K',
      unitsSold: 56,
      revenue: 56000000,
    },
    {
      id: '5',
      name: 'Auriculares Sony WH-1000XM4',
      unitsSold: 94,
      revenue: 37600000,
    },
  ];

  // Calcular el máximo para las barras de progreso
  const maxUnits = Math.max(...products.map((p: TopProduct) => p.unitsSold));

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Productos Más Vendidos</h3>
        <div className="mt-6 space-y-4">
          {products.map((product: TopProduct, index: number) => {
            const percentage = (product.unitsSold / maxUnits) * 100;
            return (
              <div key={product.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatNumber(product.unitsSold)} unidades
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <a
            href="/productos"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Ver todos los productos
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
