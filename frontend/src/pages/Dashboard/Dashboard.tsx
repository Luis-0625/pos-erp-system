import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchSaleStats } from '../../store/slices/saleSlice';
import { fetchPurchaseStats } from '../../store/slices/purchaseSlice';
import { fetchClientStats } from '../../store/slices/clientSlice';
import { fetchPortfolioStats } from '../../store/slices/portfolioSlice';
import { formatCurrency } from '../../utils/formatters';
import LoadingState from '../../components/data/LoadingState';
import StatsCard from './components/StatsCard';
import SalesChart from './components/SalesChart';
import RecentSales from './components/RecentSales';
import TopProducts from './components/TopProducts';
import PendingPayments from './components/PendingPayments';

/**
 * Dashboard - Página principal del sistema POS-ERP
 * Muestra estadísticas generales, gráficos y actividad reciente
 */
const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  // Seleccionar datos del store
  const { stats: saleStats, loading: salesLoading } = useAppSelector((state) => state.sales);
  const { stats: purchaseStats, loading: purchasesLoading } = useAppSelector((state) => state.purchases);
  const { stats: clientStats, loading: clientsLoading } = useAppSelector((state) => state.clients);
  const { stats: portfolioStats, loading: portfolioLoading } = useAppSelector((state) => state.portfolio);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    dispatch(fetchSaleStats());
    dispatch(fetchPurchaseStats());
    dispatch(fetchClientStats());
    dispatch(fetchPortfolioStats());
  }, [dispatch]);

  const loading = salesLoading || purchasesLoading || clientsLoading || portfolioLoading;

  if (loading) {
    return <LoadingState text="Cargando estadísticas del dashboard..." overlay />;
  }

  // Calcular margen de utilidad
  const totalRevenue = saleStats?.totalAmount || 0;
  const totalCost = purchaseStats?.totalAmount || 0;
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bienvenido al sistema POS-ERP. Aquí tienes un resumen de tu negocio.
        </p>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ventas del Mes"
          value={formatCurrency(saleStats?.totalAmount || 0)}
          change={0}
          icon="sales"
          trend="neutral"
          subtitle={`${saleStats?.totalSales || 0} ventas realizadas`}
        />

        <StatsCard
          title="Compras del Mes"
          value={formatCurrency(purchaseStats?.totalAmount || 0)}
          change={0}
          icon="purchases"
          trend="neutral"
          subtitle={`${purchaseStats?.totalPurchases || 0} compras registradas`}
        />

        <StatsCard
          title="Clientes Activos"
          value={clientStats?.totalClients?.toString() || '0'}
          change={0}
          icon="clients"
          trend="neutral"
          subtitle={`${clientStats?.clientsWithDebt || 0} con deuda`}
        />

        <StatsCard
          title="Margen de Utilidad"
          value={`${profitMargin.toFixed(1)}%`}
          change={0}
          icon="profit"
          trend="neutral"
          subtitle="Basado en ventas y compras"
        />
      </div>

      {/* Estadísticas de cartera */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Cuentas por Cobrar"
          value={formatCurrency(portfolioStats?.receivables.pending || 0)}
          subtitle={`${portfolioStats?.receivables.overdue || 0} vencidas`}
          icon="receivable"
          variant="info"
        />

        <StatsCard
          title="Cuentas por Pagar"
          value={formatCurrency(portfolioStats?.payables.pending || 0)}
          subtitle={`${portfolioStats?.payables.overdue || 0} vencidas`}
          icon="payable"
          variant="warning"
        />

        <StatsCard
          title="Flujo de Efectivo"
          value={formatCurrency(portfolioStats?.netPosition || 0)}
          subtitle="Balance neto"
          icon="cashflow"
          variant={
            (portfolioStats?.netPosition || 0) >= 0
              ? 'success'
              : 'danger'
          }
        />
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de ventas */}
        <div className="col-span-1 lg:col-span-2">
          <SalesChart />
        </div>

        {/* Productos más vendidos */}
        <div>
          <TopProducts />
        </div>

        {/* Ventas recientes */}
        <div>
          <RecentSales />
        </div>

        {/* Pagos pendientes */}
        <div className="col-span-1 lg:col-span-2">
          <PendingPayments />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
