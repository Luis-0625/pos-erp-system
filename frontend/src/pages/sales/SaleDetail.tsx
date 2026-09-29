import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiDownload,
  FiPrinter,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiPackage,
  FiCreditCard,
  FiAlertCircle,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getSaleById } from '../../store/slices/salesSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PaymentStatus, PaymentMethod } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingState from '../../components/data/LoadingState';
import EmptyState from '../../components/data/EmptyState';
import Modal from '../../components/feedback/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import { useToast } from '../../hooks/useToast';

const SaleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const { currentSale, loading, error } = useAppSelector((state) => state.sales);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getSaleById(Number(id)));
    }
  }, [dispatch, id]);

  const getStatusBadge = (status: PaymentStatus) => {
    const statusConfig: Record<
      PaymentStatus,
      { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'gray' }
    > = {
      [PaymentStatus.PAID]: { label: 'Pagado', variant: 'success' },
      [PaymentStatus.PARTIAL]: { label: 'Parcial', variant: 'warning' },
      [PaymentStatus.PENDING]: { label: 'Pendiente', variant: 'danger' },
      [PaymentStatus.OVERDUE]: { label: 'Vencido', variant: 'danger' },
      [PaymentStatus.CANCELLED]: { label: 'Cancelado', variant: 'gray' },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    const labels: Record<PaymentMethod, string> = {
      [PaymentMethod.CASH]: 'Efectivo',
      [PaymentMethod.CARD]: 'Tarjeta',
      [PaymentMethod.TRANSFER]: 'Transferencia',
      [PaymentMethod.CHECK]: 'Cheque',
      [PaymentMethod.CREDIT]: 'Crédito',
    };
    return labels[method];
  };

  const handleDownloadInvoice = () => {
    showToast('info', 'Descargando factura...');
    // TODO: Implement invoice download
  };

  const handlePrintInvoice = () => {
    showToast('info', 'Imprimiendo factura...');
    // TODO: Implement invoice printing
  };

  const handleOpenPaymentModal = () => {
    if (currentSale && currentSale.remainingBalance > 0) {
      setPaymentAmount(currentSale.remainingBalance.toString());
      setShowPaymentModal(true);
    }
  };

  const handleRecordPayment = async () => {
    if (!currentSale) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('error', 'Ingrese un monto válido');
      return;
    }

    if (amount > currentSale.remainingBalance) {
      showToast('error', 'El monto excede el saldo pendiente');
      return;
    }

    setProcessingPayment(true);
    try {
      // TODO: Implement payment recording via API
      showToast('success', 'Pago registrado correctamente');
      setShowPaymentModal(false);
      setPaymentAmount('');
      setPaymentReference('');
      setPaymentNotes('');
      
      // Refresh sale data
      if (id) {
        dispatch(getSaleById(Number(id)));
      }
    } catch (error) {
      showToast('error', 'Error al registrar el pago');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState text="Cargando detalle de venta..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          message="Error al cargar la venta"
          description={error}
          icon={<FiAlertCircle className="w-12 h-12" />}
          action={{
            label: 'Volver a intentar',
            onClick: () => id && dispatch(getSaleById(Number(id))),
            variant: 'primary' as const,
          }}
        />
      </div>
    );
  }

  if (!currentSale) {
    return (
      <div className="p-6">
        <EmptyState
          message="Venta no encontrada"
          description="La venta que buscas no existe o fue eliminada"
          icon={<FiDollarSign className="w-12 h-12" />}
          action={{
            label: 'Volver a ventas',
            onClick: () => navigate('/sales'),
            variant: 'primary' as const,
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/sales')}
            leftIcon={<FiArrowLeft />}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Venta #{currentSale.invoiceNumber}
            </h1>
            <p className="text-sm text-gray-500">
              {formatDate(currentSale.createdAt)}
            </p>
          </div>
          {getStatusBadge(currentSale.paymentStatus)}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            leftIcon={<FiDownload />}
            onClick={handleDownloadInvoice}
          >
            Descargar
          </Button>
          <Button
            variant="ghost"
            leftIcon={<FiPrinter />}
            onClick={handlePrintInvoice}
          >
            Imprimir
          </Button>
          {currentSale.remainingBalance > 0 && (
            <Button
              variant="primary"
              leftIcon={<FiCreditCard />}
              onClick={handleOpenPaymentModal}
            >
              Registrar Pago
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Información del Cliente
                </h2>
              </div>
              {currentSale.client ? (
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Nombre:</span>
                    <p className="font-medium text-gray-900">
                      {currentSale.client.businessName ||
                        `${currentSale.client.firstName} ${currentSale.client.lastName}`}
                    </p>
                  </div>
                  {currentSale.client.email && (
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900">
                        {currentSale.client.email}
                      </p>
                    </div>
                  )}
                  {currentSale.client.phone && (
                    <div>
                      <span className="text-sm text-gray-500">Teléfono:</span>
                      <p className="font-medium text-gray-900">
                        {currentSale.client.phone}
                      </p>
                    </div>
                  )}
                  {currentSale.client.documentNumber && (
                    <div>
                      <span className="text-sm text-gray-500">Documento:</span>
                      <p className="font-medium text-gray-900">
                        {currentSale.client.documentNumber}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Cliente genérico</p>
              )}
            </div>
          </Card>

          {/* Sale Items */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiPackage className="text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Productos
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Producto
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                        Precio
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                        Cantidad
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                        Descuento
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSale.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.product?.name || 'Producto'}
                            </p>
                            {item.product?.sku && (
                              <p className="text-sm text-gray-500">
                                {item.product.sku}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-gray-900">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-900">
                          {item.discount > 0 ? formatCurrency(item.discount) : '-'}
                        </td>
                        <td className="text-right py-3 px-4 font-medium text-gray-900">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Payment History */}
          {currentSale.payments && currentSale.payments.length > 0 && (
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiCreditCard className="text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Historial de Pagos
                  </h2>
                </div>
                <div className="space-y-3">
                  {currentSale.payments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FiCalendar className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getPaymentMethodLabel(payment.paymentMethod)} -{' '}
                            {formatDate(currentSale.createdAt)}
                          </p>
                          {payment.reference && (
                            <p className="text-sm text-gray-500">
                              Ref: {payment.reference}
                            </p>
                          )}
                        </div>
                      </div>
                      {payment.notes && (
                        <p className="text-sm text-gray-500 italic">
                          {payment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Notes */}
          {currentSale.notes && (
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Notas
                </h2>
                <p className="text-gray-700">{currentSale.notes}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(currentSale.subtotal)}
                  </span>
                </div>
                {currentSale.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Descuento:</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(currentSale.discount)}
                    </span>
                  </div>
                )}
                {currentSale.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">IVA:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(currentSale.tax)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-semibold text-gray-900 text-lg">
                      {formatCurrency(currentSale.total)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pagado:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(currentSale.paidAmount)}
                  </span>
                </div>
                {currentSale.remainingBalance > 0 && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Saldo:</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(currentSale.remainingBalance)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Account Receivable Warning */}
          {currentSale.accountReceivableId && currentSale.remainingBalance > 0 && (
            <Card>
              <div className="p-6 bg-yellow-50">
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Cuenta por Cobrar
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Esta venta tiene un saldo pendiente de{' '}
                      {formatCurrency(currentSale.remainingBalance)} en cartera.
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-2 text-yellow-700 hover:text-yellow-800"
                      onClick={() =>
                        navigate(`/portfolio/${currentSale.accountReceivableId}`)
                      }
                    >
                      Ver en Cartera →
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Sale Details */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Número de Factura:</span>
                  <p className="font-medium text-gray-900">
                    {currentSale.invoiceNumber}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Fecha de Creación:</span>
                  <p className="font-medium text-gray-900">
                    {formatDate(currentSale.createdAt)}
                  </p>
                </div>
                {currentSale.user && (
                  <div>
                    <span className="text-sm text-gray-500">Vendedor:</span>
                    <p className="font-medium text-gray-900">
                      {currentSale.user.firstName} {currentSale.user.lastName}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">Estado:</span>
                  <div className="mt-1">
                    {getStatusBadge(currentSale.paymentStatus)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Registrar Pago"
        size="medium"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              Saldo pendiente:{' '}
              <span className="font-semibold">
                {formatCurrency(currentSale.remainingBalance)}
              </span>
            </p>
          </div>

          <Input
            label="Monto del Pago"
            type="number"
            value={paymentAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />

          <Select
            label="Método de Pago"
            value={paymentMethod}
            onChange={(value: string) => setPaymentMethod(value as PaymentMethod)}
            options={[
              { value: PaymentMethod.CASH, label: 'Efectivo' },
              { value: PaymentMethod.CARD, label: 'Tarjeta' },
              { value: PaymentMethod.TRANSFER, label: 'Transferencia' },
              { value: PaymentMethod.CHECK, label: 'Cheque' },
            ]}
            required
          />

          <Input
            label="Referencia (Opcional)"
            type="text"
            value={paymentReference}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentReference(e.target.value)}
            placeholder="Número de transacción, cheque, etc."
          />

          <Input
            label="Notas (Opcional)"
            type="text"
            value={paymentNotes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentNotes(e.target.value)}
            placeholder="Notas adicionales sobre el pago"
          />

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowPaymentModal(false)}
              disabled={processingPayment}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRecordPayment}
              isLoading={processingPayment}
            >
              Registrar Pago
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SaleDetail;
