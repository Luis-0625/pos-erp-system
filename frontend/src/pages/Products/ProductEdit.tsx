import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProductById, updateProduct } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import { useToast } from '../../hooks/useToast';
import { Product } from '../../types';

type UpdateProductDto = Omit<Product, 'createdAt' | 'updatedAt' | 'category'>;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { categories } = useAppSelector((state) => state.categories);
  const { currentProduct, loading } = useAppSelector((state) => state.products);

  const [formData, setFormData] = useState<UpdateProductDto>({
    id: 0,
    sku: '',
    name: '',
    description: '',
    categoryId: 0,
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 0,
    maxStock: 0,
    barcode: '',
    image: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchCategories({}));
    if (id) {
      dispatch(fetchProductById(parseInt(id, 10)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        id: currentProduct.id,
        sku: currentProduct.sku,
        name: currentProduct.name,
        description: currentProduct.description || '',
        categoryId: currentProduct.categoryId,
        price: currentProduct.price,
        cost: currentProduct.cost,
        stock: currentProduct.stock,
        minStock: currentProduct.minStock,
        maxStock: currentProduct.maxStock,
        barcode: currentProduct.barcode || '',
        image: currentProduct.image || '',
        isActive: currentProduct.isActive,
      });
    }
  }, [currentProduct]);

  const handleChange = (field: keyof UpdateProductDto, value: any) => {
    setFormData((prev: UpdateProductDto) => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    const errorField = field as string;
    if (errors[errorField]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorField];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.categoryId === 0) {
      newErrors.categoryId = 'La categoría es requerida';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (formData.cost < 0) {
      newErrors.cost = 'El costo no puede ser negativo';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (formData.minStock < 0) {
      newErrors.minStock = 'El stock mínimo no puede ser negativo';
    }

    if (formData.maxStock < 0) {
      newErrors.maxStock = 'El stock máximo no puede ser negativo';
    }

    if (formData.minStock > formData.maxStock) {
      newErrors.maxStock = 'El stock máximo debe ser mayor o igual al stock mínimo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('error', 'Por favor corrija los errores del formulario');
      return;
    }

    try {
      await dispatch(updateProduct({ id: formData.id, data: formData })).unwrap();
      showToast('success', 'Producto actualizado exitosamente');
      navigate('/products');
    } catch (error: any) {
      showToast('error', error || 'Error al actualizar el producto');
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (loading && !currentProduct) {
    return (
      <PageContainer title="Editar Producto">
        <LoadingState message="Cargando producto..." />
      </PageContainer>
    );
  }

  if (!currentProduct && !loading) {
    return (
      <PageContainer title="Editar Producto">
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-600">Producto no encontrado</p>
            <Button onClick={handleCancel} className="mt-4">
              Volver a Productos
            </Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Editar Producto"
      breadcrumbs={[
        { label: 'Productos', path: '/products' },
        { label: 'Editar' },
      ]}
    >
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Información del Producto
            </h2>

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="SKU"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                error={errors.sku}
                placeholder="SKU único del producto"
                isRequired
              />

              <Input
                label="Código de Barras"
                value={formData.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
                error={errors.barcode}
                placeholder="Código de barras"
              />

              <div className="md:col-span-2">
                <Input
                  label="Nombre"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  placeholder="Nombre del producto"
                  isRequired
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descripción detallada del producto"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <Select
                label="Categoría"
                value={formData.categoryId.toString()}
                onChange={(value) => handleChange('categoryId', parseInt(value as string, 10))}
                error={errors.categoryId}
                isRequired
                options={[
                  { value: '0', label: 'Seleccione una categoría' },
                  ...categories.map((cat) => ({
                    value: cat.id.toString(),
                    label: cat.name,
                  })),
                ]}
              />

              <Input
                label="URL de Imagen"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                error={errors.image}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            {/* Precios y costos */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Precios y Costos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Precio de Venta"
                  type="number"
                  value={formData.price.toString()}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  error={errors.price}
                  placeholder="0.00"
                  isRequired
                />

                <Input
                  label="Costo"
                  type="number"
                  value={formData.cost.toString()}
                  onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
                  error={errors.cost}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Inventario */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Control de Inventario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Stock Actual"
                  type="number"
                  value={formData.stock.toString()}
                  onChange={(e) => handleChange('stock', parseInt(e.target.value, 10) || 0)}
                  error={errors.stock}
                  placeholder="0"
                />

                <Input
                  label="Stock Mínimo"
                  type="number"
                  value={formData.minStock.toString()}
                  onChange={(e) => handleChange('minStock', parseInt(e.target.value, 10) || 0)}
                  error={errors.minStock}
                  placeholder="0"
                />

                <Input
                  label="Stock Máximo"
                  type="number"
                  value={formData.maxStock.toString()}
                  onChange={(e) => handleChange('maxStock', parseInt(e.target.value, 10) || 0)}
                  error={errors.maxStock}
                  placeholder="0"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                El sistema alertará cuando el stock esté por debajo del mínimo
              </p>
            </div>

            {/* Estado */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado</h3>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Producto activo
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Los productos inactivos no estarán disponibles para venta
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Button variant="ghost" onClick={handleCancel} type="button">
              Cancelar
            </Button>
            <Button type="submit" isLoading={loading}>
              Actualizar Producto
            </Button>
          </div>
        </Card>
      </form>
    </PageContainer>
  );
};

export default ProductEdit;
