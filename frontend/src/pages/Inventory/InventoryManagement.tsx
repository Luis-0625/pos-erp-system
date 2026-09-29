import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import {
  fetchProducts,
  fetchLowStockProducts,
  updateProductStock,
} from '../../store/slices/productSlice';
import { Product } from '../../types';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import DataTable, { DataTableColumn } from '../../components/data/DataTable';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingState from '../../components/data/LoadingState';
import Modal from '../../components/feedback/Modal';
import { formatCurrency } from '../../utils/formatters';

const InventoryManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { products, loading } = useAppSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentError, setAdjustmentError] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    loadInventory();
  }, [filterType, debouncedSearch]);

  const loadInventory = async () => {
    try {
      if (filterType === 'low') {
        await dispatch(fetchLowStockProducts()).unwrap();
      } else {
        await dispatch(
          fetchProducts({
            page: 1,
            limit: 100,
            search: debouncedSearch || undefined,
          })
        ).unwrap();
      }
    } catch (error) {
      showToast('error', 'Error al cargar el inventario');
    }
  };

  const getFilteredProducts = () => {
    if (filterType === 'out') {
      return products.filter((p) => p.stock === 0);
    }
    return products;
  };

  const getStockStatus = (product: Product): 'success' | 'warning' | 'danger' => {
    if (product.stock === 0) return 'danger';
    if (product.stock <= product.minStock) return 'warning';
    return 'success';
  };

  const getStockLabel = (product: Product): string => {
    if (product.stock === 0) return 'Sin Stock';
    if (product.stock <= product.minStock) return 'Stock Bajo';
    return 'Stock Normal';
  };

  const handleOpenAdjustModal = (product: Product, type: 'add' | 'subtract') => {
    setSelectedProduct(product);
    setAdjustmentType(type);
    setAdjustmentQuantity('');
    setAdjustmentReason('');
    setAdjustmentError('');
    setShowAdjustModal(true);
  };

  const handleCloseAdjustModal = () => {
    setShowAdjustModal(false);
    setSelectedProduct(null);
    setAdjustmentQuantity('');
    setAdjustmentReason('');
    setAdjustmentError('');
  };

  const validateAdjustment = (): boolean => {
    setAdjustmentError('');

    const quantity = parseInt(adjustmentQuantity, 10);
    
    if (!adjustmentQuantity || isNaN(quantity) || quantity <= 0) {
      setAdjustmentError('Ingrese una cantidad válida mayor a 0');
      return false;
    }

    if (adjustmentType === 'subtract' && selectedProduct && quantity > selectedProduct.stock) {
      setAdjustmentError(`No puede restar más de ${selectedProduct.stock} unidades`);
      return false;
    }

    if (!adjustmentReason.trim()) {
      setAdjustmentError('Ingrese un motivo para el ajuste');
      return false;
    }

    return true;
  };

  const handleAdjustStock = async () => {
    if (!selectedProduct || !validateAdjustment()) return;

    try {
      const quantity = parseInt(adjustmentQuantity, 10);
      
      await dispatch(
        updateProductStock({
          id: selectedProduct.id,
          quantity,
          type: adjustmentType,
        })
      ).unwrap();

      showToast(
        'success',
        `Stock ${adjustmentType === 'add' ? 'incrementado' : 'reducido'} exitosamente`
      );
      handleCloseAdjustModal();
      loadInventory();
    } catch (error) {
      showToast('error', 'Error al ajustar el stock');
    }
  };

  const columns: DataTableColumn<Product>[] = [
    {
      id: 'sku',
      header: 'SKU',
      accessor: 'sku',
      sortable: true,
      width: '120px',
    },
    {
      id: 'name',
      header: 'Producto',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'stock',
      header: 'Stock Actual',
      accessor: 'stock',
      sortable: true,
      width: '120px',
      render: (value: number) => (
        <span className="font-semibold">{value}</span>
      ),
    },
    {
      id: 'minStock',
      header: 'Stock Mínimo',
      accessor: 'minStock',
      sortable: true,
      width: '120px',
    },
    {
      id: 'maxStock',
      header: 'Stock Máximo',
      accessor: 'maxStock',
      sortable: true,
      width: '120px',
    },
    {
      id: 'status',
      header: 'Estado',
      width: '140px',
      render: (_: any, product: Product) => (
        <Badge variant={getStockStatus(product)}>
          {getStockLabel(product)}
        </Badge>
      ),
    },
    {
      id: 'cost',
      header: 'Costo',
      accessor: 'cost',
      width: '120px',
      render: (value: number) => formatCurrency(value),
    },
    {
      id: 'value',
      header: 'Valor Total',
      width: '140px',
      render: (_: any, product: Product) => (
        <span className="font-semibold">
          {formatCurrency(product.cost * product.stock)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Ajustes',
      width: '180px',
      render: (_: any, product: Product) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenAdjustModal(product, 'add')}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Incrementar stock"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            onClick={() => handleOpenAdjustModal(product, 'subtract')}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Reducir stock"
            disabled={product.stock === 0}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const filteredProducts = getFilteredProducts();

  const totalValue = filteredProducts.reduce(
    (sum, product) => sum + product.cost * product.stock,
    0
  );

  const lowStockCount = filteredProducts.filter(
    (p) => p.stock > 0 && p.stock <= p.minStock
  ).length;

  const outOfStockCount = filteredProducts.filter((p) => p.stock === 0).length;

  if (loading && products.length === 0) {
    return <LoadingState text="Cargando inventario..." />;
  }

  return (
    <PageContainer
      title="Gestión de Inventario"
      subtitle="Administra el stock de tus productos"
    >
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Productos</div>
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Valor Total</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalValue)}
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Stock Bajo</div>
            <div className="text-2xl font-bold text-yellow-600">
              {lowStockCount}
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Sin Stock</div>
            <div className="text-2xl font-bold text-red-600">
              {outOfStockCount}
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o SKU..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'primary' : 'secondary'}
                onClick={() => setFilterType('all')}
              >
                Todos
              </Button>
              <Button
                variant={filterType === 'low' ? 'primary' : 'secondary'}
                onClick={() => setFilterType('low')}
              >
                Stock Bajo
              </Button>
              <Button
                variant={filterType === 'out' ? 'primary' : 'secondary'}
                onClick={() => setFilterType('out')}
              >
                Sin Stock
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de inventario */}
      <Card>
        <DataTable columns={columns} data={filteredProducts} />
      </Card>

      {/* Modal de ajuste de stock */}
      <Modal
        isOpen={showAdjustModal}
        onClose={handleCloseAdjustModal}
        title={`${adjustmentType === 'add' ? 'Incrementar' : 'Reducir'} Stock`}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Producto</div>
              <div className="font-semibold">{selectedProduct.name}</div>
              <div className="text-sm text-gray-600 mt-2">Stock actual</div>
              <div className="text-lg font-bold">{selectedProduct.stock} unidades</div>
            </div>

            <Input
              label="Cantidad"
              type="number"
              value={adjustmentQuantity}
              onChange={(e) => setAdjustmentQuantity(e.target.value)}
              placeholder="Ingrese la cantidad"
              min="1"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del ajuste *
              </label>
              <textarea
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Ingrese el motivo del ajuste..."
              />
            </div>

            {adjustmentError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {adjustmentError}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleCloseAdjustModal}>
                Cancelar
              </Button>
              <Button
                variant={adjustmentType === 'add' ? 'primary' : 'danger'}
                onClick={handleAdjustStock}
              >
                {adjustmentType === 'add' ? 'Incrementar' : 'Reducir'} Stock
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default InventoryManagement;
