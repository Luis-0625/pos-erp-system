import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiEye,
  FiDownload,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiDollarSign,
} from 'react-icons/fi';
import { AppDispatch, RootState } from '../../store';
import { fetchSales } from '../../store/slices/saleSlice';
import { PaymentStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import DataTable from '../../components/data/DataTable';
import Pagination from '../../components/data/Pagination';
import EmptyState from '../../components/data/EmptyState';
import LoadingState from '../../components/data/LoadingState';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * SalesList - Lista de ventas con filtros y búsqueda
 * Muestra todas las ventas realizadas con opciones de filtrado por estado, fecha y cliente
 */
const SalesList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { sales, loading, pagination } = useSelector((state: RootState) => state.sales);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Cargar ventas al montar y cuando cambien los filtros
  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: 20,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (statusFilter !== 'ALL') {
      params.status = statusFilter;
    }

    if (dateFromFilter) {
      params.dateFrom = dateFromFilter;
    }

    if (dateToFilter) {
      params.dateTo = dateToFilter;
    }

    dispatch(fetchSales(params));
  }, [dispatch, currentPage, debouncedSearch, statusFilter, dateFromFilter, dateToFilter]);

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setDateFromFilter('');
    setDateToFilter('');
    setCurrentPage(1);
  };

  // Ver detalle de venta
  const handleViewSale = (saleId: number) => {
    navigate(`/sales/${saleId}`);
  };

  // Descargar factura
  const handleDownloadInvoice = (saleId: number) => {
    // TODO: Implementar descarga de factura
    console.log('Descargar factura:', saleId);
  };

  // Obtener color del badge según el estado de pago
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      [PaymentStatus.PAID]: { label: 'Pagado', variant: 'success' as const },
      [PaymentStatus.PENDING]: { label: 'Pendiente', variant: 'warning' as const },
      [PaymentStatus.PARTIAL]: { label: 'Parcial', variant: 'info' as const },
      [PaymentStatus.OVERDUE]: { label: 'Vencido', variant: 'danger' as const },
      [PaymentStatus.CANCELLED]: { label: 'Cancelado', variant: 'secondary' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Columnas de la tabla
  const columns = [
    {
      id: 'invoiceNumber',
      header: 'Factura',
      render: (sale: any) => (
        <span className="font-medium text-gray-900">{sale.invoiceNumber}</span>
      ),
    },
    {
      id: 'date',
      header: 'Fecha',
      render: (sale: any) => formatDate(sale.saleDate),
    },
    {
      id: 'client',
      header: 'Cliente',
      render: (sale: any) => sale.client?.businessName || sale.client?.firstName + ' ' + sale.client?.lastName || 'Cliente Genérico',
    },
    {
      id: 'total',
      header: 'Total',
      render: (sale: any) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(sale.total)}
        </span>
      ),
    },
    {
      id: 'paymentStatus',
      header: 'Estado Pago',
      render: (sale: any) => getPaymentStatusBadge(sale.paymentStatus),
    },
    {
      id: 'actions',
      header: 'Acciones',
      render: (sale: any) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewSale(sale.id)}
          >
            <FiEye className="mr-1" />
            Ver
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownloadInvoice(sale.id)}
          >
            <FiDownload className="mr-1" />
            Factura
          </Button>
        </div>
      ),
    },
  ];

  if (loading && sales.length === 0) {
    return (
      <PageContainer
        title="Ventas"
        breadcrumbs={[
          { label: 'Inicio', path: '/' },
          { label: 'Ventas', path: '/sales' },
        ]}
      >
        <LoadingState text="Cargando ventas..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Ventas"
      breadcrumbs={[
        { label: 'Inicio', path: '/' },
        { label: 'Ventas', path: '/sales' },
      ]}
      actions={
        <Button variant="primary" onClick={() => navigate('/sales/pos')}>
          <FiDollarSign className="mr-2" />
          Nueva Venta
        </Button>
      }
    >
      {/* Filtros */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar por factura o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filtro de estado */}
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as PaymentStatus | 'ALL')}
            options={[
              { value: 'ALL', label: 'Todos los estados' },
              { value: PaymentStatus.PAID, label: 'Pagado' },
              { value: PaymentStatus.PARTIAL, label: 'Parcial' },
              { value: PaymentStatus.PENDING, label: 'Pendiente' },
            ]}
          />

          {/* Fecha desde */}
          <div className="relative">
            <Input
              type="date"
              placeholder="Fecha desde"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="pl-10"
            />
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Fecha hasta */}
          <div className="relative">
            <Input
              type="date"
              placeholder="Fecha hasta"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="pl-10"
            />
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {(searchTerm || statusFilter !== 'ALL' || dateFromFilter || dateToFilter) && (
          <div className="mt-4">
            <Button variant="secondary" onClick={handleClearFilters}>
              <FiFilter className="mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        )}
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Total Ventas</div>
          <div className="text-2xl font-bold text-gray-900">
            {pagination?.total || 0}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Monto Total</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(
              sales.reduce((sum, sale) => sum + sale.total, 0)
            )}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Pendiente de Cobro</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(
              sales
                .filter((s) => s.paymentStatus !== PaymentStatus.PAID)
                .reduce((sum, sale) => sum + (sale.total - sale.paidAmount), 0)
            )}
          </div>
        </Card>
      </div>

      {/* Tabla de ventas */}
      <Card>
        {sales.length === 0 ? (
          <EmptyState
            message="No hay ventas"
            description="No se encontraron ventas con los filtros seleccionados"
            icon={<FiDollarSign className="w-12 h-12" />}
            action={{
              label: 'Crear Primera Venta',
              onClick: () => navigate('/sales/pos'),
              variant: 'primary' as const,
            }}
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={sales}
              loading={loading}
            />
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  pageSize={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </PageContainer>
  );
};

export default SalesList;
