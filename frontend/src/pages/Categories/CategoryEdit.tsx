import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchCategoryById,
  updateCategory,
  fetchActiveCategories,
  clearError,
  clearCurrentCategory,
} from '../../store/slices/categorySlice';
import { Category } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import LoadingState from '../../components/data/LoadingState';
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

const CategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const { currentCategory, loading, error } = useAppSelector(
    (state) => state.categories
  );
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    parentId: '',
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        showToast('error', 'ID de categoría no válido');
        navigate('/categories');
        return;
      }

      try {
        // Cargar categoría actual
        const category = await dispatch(fetchCategoryById(parseInt(id, 10))).unwrap();
        
        // Cargar categorías activas para el selector (excluyendo la actual)
        const categories = await dispatch(fetchActiveCategories()).unwrap();
        setActiveCategories(categories.filter((c) => c.id !== category.id));

        // Llenar formulario
        setFormData({
          name: category.name,
          description: category.description || '',
          parentId: category.parentId?.toString() || '',
          isActive: category.isActive,
        });
      } catch (err: any) {
        showToast('error', err.message || 'Error al cargar la categoría');
        navigate('/categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      dispatch(clearCurrentCategory());
    };
  }, [id, dispatch, navigate, showToast]);

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

    // Validar que no se seleccione a sí misma como padre
    if (formData.parentId && id && formData.parentId === id) {
      errors.parentId = 'Una categoría no puede ser su propia categoría padre';
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

    if (!validateForm() || !id) {
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

      await dispatch(
        updateCategory({ id: parseInt(id, 10), data: categoryData })
      ).unwrap();
      
      showToast('success', 'Categoría actualizada exitosamente');
      navigate('/categories');
    } catch (err: any) {
      showToast('error', err.message || 'Error al actualizar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!currentCategory) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Categoría</h1>
        <p className="text-gray-600 mt-1">
          Modifica la información de la categoría
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.parentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Sin categoría padre</option>
                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.parentId && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.parentId}</p>
                )}
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
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CategoryEdit;
