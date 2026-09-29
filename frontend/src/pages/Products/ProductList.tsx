import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import {
  fetchProducts,
  deleteProduct,
  toggleProductStatus,
} from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import DataTable from '../../components/data/DataTable';
import LoadingState from '../../components/data/LoadingState';
import EmptyState from '../../components/data/EmptyState';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const { products, loading, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch();
    } else {
      loadProducts();
    }
  }, [debouncedSearch]);

  const loadProducts = () => {
    dispatch(fetchProducts({}));
  };

  const loadCategories = () => {
    dispatch(fetchCategories({}));
  };

  const handleSearch = () => {
    // La búsqueda se maneja en el filtrado local
    // En producción, esto debería hacer una llamada al API con parámetros de búsqueda
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: '¿Eliminar producto?',
      message: 'Esta acción no se puede deshacer. El producto será eliminado permanentemente.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
    });

    if (confirmed) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        showToast('success', 'Producto eliminado exitosamente');
        loadProducts();
      } catch (error) {
        showToast('error', 'Error al eliminar el producto');
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await dispatch(toggleProductStatus(id)).unwrap();
      showToast(
        'success',
        `Producto ${currentStatus ? 'desactivado' : 'activado'} exitosamente`
      );
      loadProducts();
    } catch (error) {
      showToast('error', 'Error al cambiar el estado del producto');
    }
  };

  const getStockStatus = (product: Product): 'success' | 'warning' | 'danger' => {
    if (product.stock === 0) return 'danger';
    if (product.stock <= product.minStock) return 'warning';
    return 'success';
  };

  const getStockLabel = (product: Product): string => {
    if (product.stock === 0) return 'Sin stock';
    if (product.stock <= product.minStock) return 'Stock bajo';
    return 'En stock';
  };

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    // Filtro de búsqueda
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.barcode?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro de categoría
    if (categoryFilter && product.categoryId !== parseInt(categoryFilter, 10)) {
      return false;
    }

    // Filtro de estado
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && !product.isActive) return false;
      if (statusFilter === 'inactive' && product.isActive) return false;
    }

    // Filtro de stock
    if (stockFilter !== 'all') {
      if (stockFilter === 'out' && product.stock > 0) return false;
      if (stockFilter === 'low' && (product.stock === 0 || product.stock > product.minStock))
        return false;
      if (stockFilter === 'normal' && (product.stock === 0 || product.stock <= product.minStock))
        return false;
    }

    return true;
  });

  const columns = [
    {
      id: 'image',
      header: 'Imagen',
      cell: (product: Product) => (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">Sin img</span>
          )}
        </div>
      ),
    },
    {
      id: 'sku',
      header: 'SKU',
      cell: (product: Product) => (
        <span className="font-mono text-sm">{product.sku}</span>
      ),
    },
    {
      id: 'name',
      header: 'Nombre',
      cell: (product: Product) => (
        <div>
          <div className="font-medium">{product.name}</div>
          {product.category && (
            <div className="text-sm text-gray-500">{product.category.name}</div>
          )}
        </div>
      ),
    },
    {
      id: 'barcode',
      header: 'Código de barras',
      cell: (product: Product) => (
        <span className="font-mono text-sm">{product.barcode || '-'}</span>
      ),
    },
    {
      id: 'price',
      header: 'Precio',
      cell: (product: Product) => (
        <span className="font-medium">{formatCurrency(product.price)}</span>
      ),
    },
    {
      id: 'cost',
      header: 'Costo',
      cell: (product: Product) => (
        <span className="text-gray-600">{formatCurrency(product.cost)}</span>
      ),
    },
    {
      id: 'stock',
      header: 'Stock',
      cell: (product: Product) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{product.stock}</span>
          <Badge variant={getStockStatus(product)}>{getStockLabel(product)}</Badge>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Estado',
      cell: (product: Product) => (
        <Badge variant={product.isActive ? 'success' : 'danger'}>
          {product.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: (product: Product) => (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            Ver
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/products/${product.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant={product.isActive ? 'warning' : 'success'}
            size="sm"
            onClick={() => handleToggleStatus(product.id, product.isActive)}
          >
            {product.isActive ? 'Desactivar' : 'Activar'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(product.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <PageContainer
        title="Productos"
        breadcrumbs={[
          { label: 'Inicio', path: '/' },
          { label: 'Productos' },
        ]}
      >
        <LoadingState text="Cargando productos..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Productos"
        breadcrumbs={[
          { label: 'Inicio', path: '/' },
          { label: 'Productos' },
        ]}
      >
        <Card>
          <div className="p-6 text-center text-red-600">
            Error al cargar productos: {error}
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Productos"
      breadcrumbs={[
        { label: 'Inicio', path: '/' },
        { label: 'Productos' },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/inventory')}>
            Inventario
          </Button>
          <Button variant="primary" onClick={() => navigate('/products/new')}>
            Nuevo Producto
          </Button>
        </div>
      }
    >
      {/* Filtros */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, SKU o código de barras..."
            />
            <Select
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value as string)}
              options={[
                { value: '', label: 'Todas las categorías' },
                ...categories.map((category) => ({
                  value: category.id.toString(),
                  label: category.name
                }))
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as string)}
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'active', label: 'Activos' },
                { value: 'inactive', label: 'Inactivos' }
              ]}
            />
            <Select
              value={stockFilter}
              onChange={(value) => setStockFilter(value as string)}
              options={[
                { value: 'all', label: 'Todo el stock' },
                { value: 'normal', label: 'Stock normal' },
                { value: 'low', label: 'Stock bajo' },
                { value: 'out', label: 'Sin stock' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-1">Total Productos</div>
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-1">Valor Total</div>
            <div className="text-2xl font-bold">
              {formatCurrency(
                filteredProducts.reduce(
                  (sum, p) => sum + p.price * p.stock,
                  0
                )
              )}
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-1">Stock Bajo</div>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredProducts.filter((p) => p.stock > 0 && p.stock <= p.minStock).length}
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-1">Sin Stock</div>
            <div className="text-2xl font-bold text-red-600">
              {filteredProducts.filter((p) => p.stock === 0).length}
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de productos */}
      <Card>
        {filteredProducts.length === 0 ? (
          <EmptyState
            message="No hay productos"
            description={
              debouncedSearch || categoryFilter || statusFilter !== 'all' || stockFilter !== 'all'
                ? 'No se encontraron productos con los filtros aplicados'
                : 'Comienza creando tu primer producto'
            }
            action={
              debouncedSearch || categoryFilter || statusFilter !== 'all' || stockFilter !== 'all'
                ? {
                    label: 'Limpiar filtros',
                    onClick: () => {
                      setSearchTerm('');
                      setCategoryFilter('');
                      setStatusFilter('all');
                      setStockFilter('all');
                    },
                    variant: 'secondary' as const
                  }
                : {
                    label: 'Crear Producto',
                    onClick: () => navigate('/products/new'),
                    variant: 'primary' as const
                  }
            }
          />
        ) : (
          <DataTable columns={columns} data={filteredProducts} />
        )}
      </Card>
    </PageContainer>
  );
};

export default ProductList;
