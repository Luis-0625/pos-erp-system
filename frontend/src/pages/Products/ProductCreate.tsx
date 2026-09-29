import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createProduct } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import { Product } from '../../types';

type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>;

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { categories } = useAppSelector((state) => state.categories);
  const { loading } = useAppSelector((state) => state.products);

  const [formData, setFormData] = useState<CreateProductDto>({
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
  }, [dispatch]);

  const handleChange = (field: keyof CreateProductDto, value: any) => {
    setFormData((prev: CreateProductDto) => ({ ...prev, [field]: value }));
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

    if (formData.maxStock > 0 && formData.minStock > formData.maxStock) {
      newErrors.minStock = 'El stock mínimo no puede ser mayor al máximo';
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
      await dispatch(createProduct(formData)).unwrap();
      showToast('success', 'Producto creado exitosamente');
      navigate('/products');
    } catch (error: any) {
      showToast('error', error || 'Error al crear el producto');
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <PageContainer
      title="Crear Producto"
      breadcrumbs={[
        { label: 'Productos', path: '/products' },
        { label: 'Crear', path: '/products/new' },
      ]}
    >
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="p-6 space-y-6">
            {/* Información básica */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  error={errors.sku}
                  placeholder="Ej: PROD-001"
                  isRequired
                />

                <Input
                  label="Código de Barras"
                  value={formData.barcode}
                  onChange={(e) => handleChange('barcode', e.target.value)}
                  error={errors.barcode}
                  placeholder="Ej: 7501234567890"
                />

                <div className="md:col-span-2">
                  <Input
                    label="Nombre"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    placeholder="Ej: Laptop HP 15"
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
                  options={[
                    { value: '0', label: 'Seleccione una categoría' },
                    ...categories.map((cat) => ({
                      value: cat.id.toString(),
                      label: cat.name,
                    })),
                  ]}
                  isRequired
                />

                <Input
                  label="Imagen URL"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  error={errors.image}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            {/* Precios y costos */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Precios y Costos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Precio de Venta"
                  value={formData.price.toString()}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  error={errors.price}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  isRequired
                />

                <Input
                  type="number"
                  label="Costo"
                  value={formData.cost.toString()}
                  onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
                  error={errors.cost}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />

                <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Margen de Ganancia:</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formData.cost > 0
                        ? `${(((formData.price - formData.cost) / formData.cost) * 100).toFixed(2)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Utilidad por Unidad:</span>
                    <span className="text-lg font-semibold text-blue-600">
                      ${(formData.price - formData.cost).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventario */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Inventario</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="Stock Inicial"
                  value={formData.stock.toString()}
                  onChange={(e) => handleChange('stock', parseInt(e.target.value, 10) || 0)}
                  error={errors.stock}
                  placeholder="0"
                  min="0"
                />

                <Input
                  type="number"
                  label="Stock Mínimo"
                  value={formData.minStock.toString()}
                  onChange={(e) => handleChange('minStock', parseInt(e.target.value, 10) || 0)}
                  error={errors.minStock}
                  placeholder="0"
                  min="0"
                  helperText="Alerta cuando el stock llegue a este nivel"
                />

                <Input
                  type="number"
                  label="Stock Máximo"
                  value={formData.maxStock.toString()}
                  onChange={(e) => handleChange('maxStock', parseInt(e.target.value, 10) || 0)}
                  error={errors.maxStock}
                  placeholder="0"
                  min="0"
                  helperText="Stock objetivo para mantener"
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Estado</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
              Crear Producto
            </Button>
          </div>
        </Card>
      </form>
    </PageContainer>
  );
};

export default ProductCreate;
