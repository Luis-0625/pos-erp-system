import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  createCategory,
  fetchActiveCategories,
  clearError,
} from '../../store/slices/categorySlice';
import { Category } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';

interface FormData {
  name: string;
  description: string;
  parentId: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  parentId?: string;
}

const CategoryCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const { loading, error } = useAppSelector((state) => state.categories);
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    parentId: '',
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Cargar categorías activas para el selector de categoría padre
    const loadActiveCategories = async () => {
      try {
        const result = await dispatch(fetchActiveCategories()).unwrap();
        setActiveCategories(result);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };

    loadActiveCategories();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast('error', error);
      dispatch(clearError());
    }
  }, [error, showToast, dispatch]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (formData.description && formData.description.trim().length > 500) {
      errors.description = 'La descripción no puede exceder 500 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryData: Partial<Category> = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        parentId: formData.parentId ? parseInt(formData.parentId, 10) : undefined,
        isActive: formData.isActive,
      };

      await dispatch(createCategory(categoryData)).unwrap();
      showToast('success', 'Categoría creada exitosamente');
      navigate('/categories');
    } catch (err: any) {
      showToast('error', err.message || 'Error al crear la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Categoría</h1>
        <p className="text-gray-600 mt-1">
          Crea una nueva categoría de productos
        </p>
      </div>

      {/* Formulario */}
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Información Básica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Electrónica, Alimentos, Ropa, etc."
                  className={formErrors.name ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción opcional de la categoría"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Categoría Padre */}
              <div>
                <label
                  htmlFor="parentId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Categoría Padre
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="">Sin categoría padre</option>
                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-sm mt-1">
                  Opcional: Selecciona una categoría padre para crear una subcategoría
                </p>
              </div>

              {/* Estado */}
              <div>
                <label
                  htmlFor="isActive"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estado
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Categoría activa
                  </label>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Las categorías inactivas no se mostrarán en el sistema
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Creando...' : 'Crear Categoría'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CategoryCreate;
