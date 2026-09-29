import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiShoppingCart,
  FiSearch,
  FiX,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { AppDispatch, RootState } from '../../store';
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemDiscount,
  clearCart,
  setSelectedClient,
  addPayment,
  removePayment,
  updatePayment,
  clearPayments,
  setCartDiscount,
  calculateCartTotals,
  createSale,
} from '../../store/slices';
import { searchProducts } from '../../store/slices/productSlice';
import { searchClients } from '../../store/slices/clientSlice';
import { PaymentMethod, PaymentStatus, SalePayment, Client } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/feedback/Modal';
import Badge from '../../components/common/Badge';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * POS - Punto de Venta con soporte para pagos mixtos
 * Permite crear ventas con múltiples métodos de pago y crear cuentas por cobrar automáticamente
 */
const POS: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Redux State
  const {
    cart,
    selectedClient,
    payments,
    cartDiscount,
    cartSubtotal,
    cartTax,
    cartTotal,
    loading,
  } = useSelector((state: RootState) => state.sales);

  const { products, loading: productsLoading } = useSelector(
    (state: RootState) => state.products
  );

  const { clients, loading: clientsLoading } = useSelector(
    (state: RootState) => state.clients
  );

  // Local State
  const [productSearch, setProductSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);
  const [paymentForm, setPaymentForm] = useState<SalePayment>({
    amount: 0,
    paymentMethod: PaymentMethod.CASH,
    reference: '',
    notes: '',
  });

  // Debounced search
  const debouncedProductSearch = useDebounce(productSearch, 300);
  const debouncedClientSearch = useDebounce(clientSearch, 300);

  // Obtener objeto completo del cliente seleccionado
  const selectedClientObj = useMemo(() => {
    if (!selectedClient) return null;
    return clients.find(c => c.id === selectedClient) || null;
  }, [selectedClient, clients]);

  // Helper function to get client display name
  const getClientName = (client: Client): string => {
    if (client.type === 'business') {
      return client.businessName || 'Sin nombre';
    }
    return `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Sin nombre';
  };

  // Search products
  useEffect(() => {
    if (debouncedProductSearch.length >= 2) {
      dispatch(searchProducts(debouncedProductSearch));
    }
  }, [debouncedProductSearch, dispatch]);

  // Search clients
  useEffect(() => {
    if (debouncedClientSearch.length >= 2) {
      dispatch(searchClients(debouncedClientSearch));
    }
  }, [debouncedClientSearch, dispatch]);

  // Calculate totals when cart or payments change
  useEffect(() => {
    dispatch(calculateCartTotals());
  }, [cart, cartDiscount, dispatch]);

  // Calcular monto total pagado
  const totalPaid = useMemo((): number => {
    return payments.reduce((sum: number, payment: SalePayment) => sum + payment.amount, 0);
  }, [payments]);

  // Calcular saldo pendiente
  const remainingBalance = useMemo((): number => {
    return Math.max(0, cartTotal - totalPaid);
  }, [cartTotal, totalPaid]);

  // Determinar estado del pago
  const paymentStatus = useMemo((): PaymentStatus => {
    if (totalPaid === 0) return PaymentStatus.PENDING;
    if (totalPaid >= cartTotal) return PaymentStatus.PAID;
    return PaymentStatus.PARTIAL;
  }, [totalPaid, cartTotal]);

  /**
   * Agregar producto al carrito
   */
  const handleAddProduct = (productId: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    // Verificar stock
    const cartItem = cart.find((item) => item.productId === productId);
    const currentQuantity = cartItem?.quantity || 0;

    if (currentQuantity >= product.stock) {
      showToast('error', 'Stock insuficiente');
      return;
    }

    dispatch(
      addToCart({
        id: Date.now(),
        productId: product.id!,
        productName: product.name,
        productBarcode: product.barcode || '',
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        subtotal: product.price,
        total: product.price,
        tax: 0,
        currentStock: product.stock,
      })
    );

    setProductSearch('');
  };

  /**
   * Actualizar cantidad del producto en el carrito
   */
  const handleUpdateQuantity = (index: number, quantity: number) => {
    const item = cart[index];
    
    if (quantity <= 0) {
      dispatch(removeFromCart(index));
      return;
    }

    if (quantity > item.currentStock) {
      showToast('error', 'Stock insuficiente');
      return;
    }

    dispatch(updateCartItemQuantity({ productId: item.productId, quantity }));
  };

  /**
   * Actualizar descuento del producto
   */
  const handleUpdateItemDiscount = (index: number, discount: number) => {
    const item = cart[index];
    
    if (discount < 0 || discount > 100) {
      showToast('error', 'Descuento inválido (0-100%)');
      return;
    }

    dispatch(updateCartItemDiscount({ productId: item.productId, discount }));
  };

  /**
   * Seleccionar cliente
   */
  const handleSelectClient = (clientId: number) => {
    dispatch(setSelectedClient(clientId));
    setShowClientModal(false);
    setClientSearch('');
  };

  /**
   * Abrir modal para agregar pago
   */
  const handleOpenPaymentModal = () => {
    const suggestedAmount = remainingBalance > 0 ? remainingBalance : cartTotal;
    
    setPaymentForm({
      amount: suggestedAmount,
      paymentMethod: PaymentMethod.CASH,
      reference: '',
      notes: '',
    });
    setEditingPaymentIndex(null);
    setShowPaymentModal(true);
  };

  /**
   * Abrir modal para editar pago
   */
  const handleEditPayment = (index: number) => {
    setPaymentForm({ ...payments[index] });
    setEditingPaymentIndex(index);
    setShowPaymentModal(true);
  };

  /**
   * Guardar pago
   */
  const handleSavePayment = () => {
    if (paymentForm.amount <= 0) {
      showToast('error', 'El monto debe ser mayor a 0');
      return;
    }

    // Validar que el total de pagos no exceda el total de la venta
    const currentTotal = payments.reduce((sum: number, p: SalePayment, idx: number) => {
      if (idx === editingPaymentIndex) return sum;
      return sum + p.amount;
    }, 0);

    if (currentTotal + paymentForm.amount > cartTotal) {
      showToast('error', 'El total de pagos excede el total de la venta');
      return;
    }

    if (editingPaymentIndex !== null) {
      dispatch(updatePayment({ index: editingPaymentIndex, payment: paymentForm }));
    } else {
      dispatch(addPayment(paymentForm));
    }

    setShowPaymentModal(false);
  };

  /**
   * Eliminar pago
   */
  const handleRemovePayment = (index: number) => {
    dispatch(removePayment(index));
  };

  /**
   * Procesar venta
   */
  const handleProcessSale = async () => {
    // Validaciones
    if (cart.length === 0) {
      showToast('error', 'Agrega productos al carrito');
      return;
    }

    if (payments.length === 0) {
      showToast('error', 'Agrega al menos un método de pago');
      return;
    }

    if (totalPaid === 0) {
      showToast('error', 'El monto pagado debe ser mayor a 0');
      return;
    }

    // Si hay saldo pendiente, debe haber un cliente seleccionado
    if (remainingBalance > 0 && !selectedClient) {
      showToast('error', 'Selecciona un cliente para crear la cuenta por cobrar');
      return;
    }

    try {
      // Crear venta
      const saleData = {
        clientId: selectedClient || undefined,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
        })),
        payments: payments,
        paymentStatus: paymentStatus,
        discount: cartDiscount,
        notes: remainingBalance > 0 
          ? `Pago parcial. Saldo pendiente: ${formatCurrency(remainingBalance)}`
          : undefined,
      };

      await dispatch(createSale(saleData)).unwrap();

      showToast(
        'success',
        remainingBalance > 0
          ? 'Venta creada. Cuenta por cobrar generada automáticamente'
          : 'Venta procesada exitosamente'
      );

      // Limpiar formulario
      dispatch(clearCart());
      dispatch(clearPayments());
      dispatch(setSelectedClient(null));
      dispatch(setCartDiscount(0));

      // Navegar a lista de ventas
      navigate('/sales');
    } catch (error: any) {
      showToast(error.message || 'Error al procesar la venta', 'error');
    }
  };

  /**
   * Cancelar venta
   */
  const handleCancelSale = () => {
    if (cart.length > 0 || payments.length > 0) {
      if (window.confirm('¿Deseas cancelar esta venta?')) {
        dispatch(clearCart());
        dispatch(clearPayments());
        dispatch(setSelectedClient(null));
        dispatch(setCartDiscount(0));
      }
    }
  };

  return (
    <PageContainer
      title="Punto de Venta (POS)"
      subtitle="Sistema de ventas con soporte para pagos mixtos"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo - Búsqueda y Productos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Búsqueda de productos */}
          <Card>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar producto por nombre o código de barras..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Resultados de búsqueda */}
            {productSearch.length >= 2 && (
              <div className="mt-4 max-h-60 overflow-y-auto">
                {productsLoading ? (
                  <div className="text-center py-4 text-gray-500">Buscando...</div>
                ) : products.length > 0 ? (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleAddProduct(product.id!)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        disabled={product.stock === 0}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.barcode} • Stock: {product.stock}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-indigo-600">
                            {formatCurrency(product.price)}
                          </div>
                          {product.stock === 0 && (
                            <Badge variant="danger" size="sm">
                              Sin stock
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No se encontraron productos
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Carrito de compras */}
          <Card title="Carrito de compras">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiShoppingCart className="mx-auto text-6xl mb-4 text-gray-300" />
                <p>El carrito está vacío</p>
                <p className="text-sm mt-2">Busca productos para agregarlos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-gray-500">{item.productBarcode}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {formatCurrency(item.unitPrice)} × {item.quantity} ={' '}
                        <span className="font-semibold">
                          {formatCurrency(
                            item.unitPrice * item.quantity * (1 - item.discount / 100)
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(index, parseInt(e.target.value) || 0)
                        }
                        className="w-20 text-center"
                        min={1}
                        max={item.currentStock}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                        disabled={item.quantity >= item.currentStock}
                      >
                        <FiPlus />
                      </Button>
                    </div>

                    {/* Descuento */}
                    <div className="w-24">
                      <Input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          handleUpdateItemDiscount(index, parseFloat(e.target.value) || 0)
                        }
                        placeholder="% desc"
                        min={0}
                        max={100}
                        step={0.01}
                      />
                    </div>

                    {/* Eliminar */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dispatch(removeFromCart(index))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Panel Derecho - Resumen y Pago */}
        <div className="space-y-6">
          {/* Cliente */}
          <Card title="Cliente">
            {selectedClientObj ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{getClientName(selectedClientObj)}</div>
                    <div className="text-sm text-gray-500">
                      {selectedClientObj.documentType}: {selectedClientObj.documentNumber}
                    </div>
                    {selectedClientObj.email && (
                      <div className="text-sm text-gray-500">{selectedClientObj.email}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(setSelectedClient(null))}
                  >
                    <FiX />
                  </Button>
                </div>
                {selectedClientObj.creditLimit > 0 && (
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Límite de crédito:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedClientObj.creditLimit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saldo actual:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedClientObj.currentBalance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disponible:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(
                          selectedClientObj.creditLimit - selectedClientObj.currentBalance
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowClientModal(true)}
              >
                <FiUser className="mr-2" />
                Seleccionar Cliente
              </Button>
            )}
          </Card>

          {/* Métodos de Pago */}
          <Card title="Métodos de Pago">
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {payment.paymentMethod === PaymentMethod.CASH && 'Efectivo'}
                      {payment.paymentMethod === PaymentMethod.CARD && 'Tarjeta'}
                      {payment.paymentMethod === PaymentMethod.TRANSFER && 'Transferencia'}
                      {payment.paymentMethod === PaymentMethod.CHECK && 'Cheque'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(payment.amount)}
                      {payment.reference && ` • ${payment.reference}`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPayment(index)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePayment(index)}
                      className="text-red-600"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="secondary"
                className="w-full"
                onClick={handleOpenPaymentModal}
                disabled={cart.length === 0}
              >
                <FiPlus className="mr-2" />
                Agregar Pago
              </Button>
            </div>
          </Card>

          {/* Resumen */}
          <Card title="Resumen">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Descuento:</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(cartDiscount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA:</span>
                <span className="font-medium">{formatCurrency(cartTax)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>

              {/* Estado de pagos */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total pagado:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Saldo pendiente:</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(remainingBalance)}
                  </span>
                </div>

                {/* Indicador de estado */}
                {paymentStatus === PaymentStatus.PAID && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <FiCheckCircle />
                    <span>Pago completo</span>
                  </div>
                )}
                {paymentStatus === PaymentStatus.PARTIAL && (
                  <div className="flex items-center gap-2 text-orange-600 text-sm">
                    <FiAlertCircle />
                    <span>Pago parcial - Se creará cuenta por cobrar</span>
                  </div>
                )}
                {paymentStatus === PaymentStatus.PENDING && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FiAlertCircle />
                    <span>Sin pagos registrados</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Acciones */}
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleProcessSale}
              disabled={cart.length === 0 || payments.length === 0 || loading}
              isLoading={loading}
            >
              <FiCheckCircle className="mr-2" />
              Procesar Venta
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleCancelSale}
              disabled={loading}
            >
              <FiX className="mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de selección de cliente */}
      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title="Seleccionar Cliente"
      >
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar cliente..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {clientsLoading ? (
              <div className="text-center py-4 text-gray-500">Buscando...</div>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleSelectClient(client.id!)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div>
                    <div className="font-medium">{getClientName(client)}</div>
                    <div className="text-sm text-gray-500">
                      {client.documentType}: {client.documentNumber}
                    </div>
                  </div>
                  {client.creditLimit > 0 && (
                    <Badge variant="info" size="sm">
                      Crédito disponible
                    </Badge>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                {clientSearch.length >= 2
                  ? 'No se encontraron clientes'
                  : 'Escribe para buscar clientes'}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal de pago */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={editingPaymentIndex !== null ? 'Editar Pago' : 'Agregar Pago'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <Select
              value={paymentForm.paymentMethod}
              onChange={(value) =>
                setPaymentForm({ ...paymentForm, paymentMethod: value as PaymentMethod })
              }
              options={[
                { value: PaymentMethod.CASH, label: 'Efectivo' },
                { value: PaymentMethod.CARD, label: 'Tarjeta' },
                { value: PaymentMethod.TRANSFER, label: 'Transferencia' },
                { value: PaymentMethod.CHECK, label: 'Cheque' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <Input
              type="number"
              value={paymentForm.amount}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })
              }
              min={0}
              step={0.01}
            />
            <div className="text-sm text-gray-500 mt-1">
              Saldo pendiente: {formatCurrency(remainingBalance)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referencia (opcional)
            </label>
            <Input
              type="text"
              value={paymentForm.reference}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, reference: e.target.value })
              }
              placeholder="Ej: Número de transacción, cheque, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas (opcional)
            </label>
            <Input
              type="text"
              value={paymentForm.notes}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, notes: e.target.value })
              }
              placeholder="Notas adicionales"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSavePayment} className="flex-1">
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default POS;
