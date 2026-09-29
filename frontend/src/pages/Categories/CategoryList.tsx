import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchCategories,
  deleteCategory,
  toggleCategoryStatus,
  clearError,
} from '../../store/slices/categorySlice';
import { Category } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import DataTable, { DataTableColumn } from '../../components/data/DataTable';
import Input from '../../components/common/Input';
import LoadingState from '../../components/data/LoadingState';
import EmptyState from '../../components/data/EmptyState';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const { categories, loading, error, pagination } = useAppSelector(
    (state) => state.categories
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
  });

  useEffect(() => {
    dispatch(fetchCategories(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      showToast('error', error);
      dispatch(clearError());
    }
  }, [error, showToast, dispatch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreate = () => {
    navigate('/categories/create');
  };

  const handleEdit = (category: Category) => {
    navigate(`/categories/edit/${category.id}`);
  };

  const handleDelete = async (category: Category) => {
    const confirmed = await confirm({
      title: 'Eliminar Categoría',
      message: `¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    });

    if (confirmed) {
      try {
        await dispatch(deleteCategory(category.id)).unwrap();
        showToast('success', 'Categoría eliminada exitosamente');
        dispatch(fetchCategories(filters));
      } catch (err) {
        showToast('error', 'Error al eliminar la categoría');
      }
    }
  };

  const handleToggleStatus = async (category: Category) => {
    const action = category.isActive ? 'desactivar' : 'activar';
    const confirmed = await confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Categoría`,
      message: `¿Estás seguro de que deseas ${action} la categoría "${category.name}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelText: 'Cancelar',
    });

    if (confirmed) {
      try {
        await dispatch(toggleCategoryStatus(category.id)).unwrap();
        showToast('success', `Categoría ${action}da exitosamente`);
        dispatch(fetchCategories(filters));
      } catch (err) {
        showToast('error', `Error al ${action} la categoría`);
      }
    }
  };

  const columns: DataTableColumn<Category>[] = [
    {
      id: 'id',
      header: 'ID',
      accessor: 'id',
      sortable: true,
      width: '80px',
    },
    {
      id: 'name',
      header: 'Nombre',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'description',
      header: 'Descripción',
      accessor: 'description',
      render: (value: string | undefined) => value || '-',
    },
    {
      id: 'status',
      header: 'Estado',
      width: '120px',
      render: (_: any, category: Category) => (
        <Badge variant={category.isActive ? 'success' : 'danger'}>
          {category.isActive ? 'Activa' : 'Inactiva'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      width: '150px',
      render: (_: any, category: Category) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(category)}
            aria-label="Editar categoría"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleToggleStatus(category)}
            aria-label={category.isActive ? 'Desactivar categoría' : 'Activar categoría'}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  category.isActive
                    ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                    : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                }
              />
            </svg>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(category)}
            className="text-red-600 hover:text-red-700"
            aria-label="Eliminar categoría"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      ),
    },
  ];

  if (loading && categories.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <p className="text-gray-600 mt-1">
          Gestiona las categorías de productos de tu negocio
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <Input
                type="search"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={handleCreate}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nueva Categoría
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de categorías */}
      <Card>
        {categories.length === 0 && !loading ? (
          <EmptyState
            message="No hay categorías"
            description="Comienza creando tu primera categoría de productos"
            action={{
              label: 'Crear Categoría',
              onClick: handleCreate,
            }}
          />
        ) : (
          <DataTable
            columns={columns}
            data={categories}
            keyExtractor={(category: Category) => category.id.toString()}
            loading={loading}
          />
        )}
      </Card>
    </div>
  );
};

export default CategoryList;
