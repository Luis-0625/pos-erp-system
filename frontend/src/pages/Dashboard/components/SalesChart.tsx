import React from 'react';

interface ChartDataPoint {
  date: string;
  amount: number;
}

/**
 * SalesChart - Componente para mostrar gráfico de ventas
 * Muestra las ventas de los últimos 7 días en formato de barras
 */
const SalesChart: React.FC = () => {
  // Por ahora usamos datos de ejemplo
  // TODO: Integrar con datos reales del store cuando se implemente chartData
  const salesData: ChartDataPoint[] = [
    { date: 'Lun', amount: 12500 },
    { date: 'Mar', amount: 15800 },
    { date: 'Mié', amount: 11200 },
    { date: 'Jue', amount: 18900 },
    { date: 'Vie', amount: 21400 },
    { date: 'Sáb', amount: 25600 },
    { date: 'Dom', amount: 19300 },
  ];

  const maxAmount = Math.max(...salesData.map((d: ChartDataPoint) => d.amount));

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Ventas de los Últimos 7 Días</h3>
        <div className="mt-6">
          <div className="flex items-end justify-between space-x-4" style={{ height: '200px' }}>
            {salesData.map((day: ChartDataPoint, index: number) => {
              const barHeight = (day.amount / maxAmount) * 100;
              return (
                <div key={index} className="flex flex-1 flex-col items-center">
                  <div className="relative w-full" style={{ height: '160px' }}>
                    <div className="absolute bottom-0 w-full">
                      <div
                        className="rounded-t-md bg-blue-600 transition-all hover:bg-blue-700"
                        style={{ height: `${barHeight}%` }}
                        title={`$${day.amount.toLocaleString()}`}
                      >
                        <div className="flex h-full items-end justify-center pb-2">
                          <span className="text-xs font-medium text-white">
                            ${(day.amount / 1000).toFixed(1)}k
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-700">{day.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
