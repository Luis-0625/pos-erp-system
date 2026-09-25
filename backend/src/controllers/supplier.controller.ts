import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import supplierService from '../services/supplier.service';

class SupplierController {
  /**
   * Crear un nuevo proveedor
   */
  async createSupplier(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        documentType,
        documentNumber,
        businessName,
        contactName,
        email,
        phone,
        mobile,
        address,
        city,
        state,
        postalCode,
        country,
        creditLimit,
        paymentTerms,
        notes,
      } = req.body;

      // Validar campos requeridos
      if (!documentType || !documentNumber || !businessName) {
        res.status(400).json({
          success: false,
          message: 'Campos requeridos: documentType, documentNumber, businessName',
        });
        return;
      }

      const supplier = await supplierService.createSupplier({
        documentType,
        documentNumber,
        businessName,
        contactName,
        email,
        phone,
        mobile,
        address,
        city,
        state,
        postalCode,
        country,
        creditLimit,
        paymentTerms,
        notes,
      });

      res.status(201).json({
        success: true,
        message: 'Proveedor creado exitosamente',
        data: supplier,
      });
    } catch (error: any) {
      console.error('Error al crear proveedor:', error);

      if (error.message === 'DOCUMENT_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'Ya existe un proveedor con este número de documento',
        });
        return;
      }

      if (error.message === 'BUSINESS_NAME_REQUIRED') {
        res.status(400).json({
          success: false,
          message: 'El nombre comercial es requerido',
        });
        return;
      }

      if (error.message === 'INVALID_EMAIL') {
        res.status(400).json({
          success: false,
          message: 'El email proporcionado no es válido',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al crear proveedor',
      });
    }
  }

  /**
   * Obtener todos los proveedores con filtros
   */
  async listSuppliers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        search,
        isActive,
        hasDebt,
        city,
        state,
        page,
        limit,
        sortBy,
        sortOrder,
      } = req.query;

      const result = await supplierService.listSuppliers({
        search: search as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        hasDebt: hasDebt === 'true' ? true : hasDebt === 'false' ? false : undefined,
        city: city as string,
        state: state as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC',
      });

      res.status(200).json({
        success: true,
        data: result.suppliers,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Error al listar proveedores:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar proveedores',
      });
    }
  }

  /**
   * Obtener un proveedor por ID
   */
  async getSupplier(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const supplier = await supplierService.getSupplierById(parseInt(id));

      if (!supplier) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: supplier,
      });
    } catch (error: any) {
      console.error('Error al obtener proveedor:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener proveedor',
      });
    }
  }

  /**
   * Obtener un proveedor por número de documento
   */
  async getSupplierByDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { documentNumber } = req.params;

      const supplier = await supplierService.getSupplierByDocument(documentNumber);

      if (!supplier) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: supplier,
      });
    } catch (error: any) {
      console.error('Error al obtener proveedor:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener proveedor',
      });
    }
  }

  /**
   * Actualizar un proveedor
   */
  async updateSupplier(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const supplier = await supplierService.updateSupplier(parseInt(id), updateData);

      res.status(200).json({
        success: true,
        message: 'Proveedor actualizado exitosamente',
        data: supplier,
      });
    } catch (error: any) {
      console.error('Error al actualizar proveedor:', error);

      if (error.message === 'SUPPLIER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      if (error.message === 'DOCUMENT_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'Ya existe un proveedor con este número de documento',
        });
        return;
      }

      if (error.message === 'BUSINESS_NAME_REQUIRED') {
        res.status(400).json({
          success: false,
          message: 'El nombre comercial es requerido',
        });
        return;
      }

      if (error.message === 'INVALID_EMAIL') {
        res.status(400).json({
          success: false,
          message: 'El email proporcionado no es válido',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar proveedor',
      });
    }
  }

  /**
   * Eliminar un proveedor (soft delete)
   */
  async deleteSupplier(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await supplierService.deleteSupplier(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Proveedor eliminado exitosamente',
      });
    } catch (error: any) {
      console.error('Error al eliminar proveedor:', error);

      if (error.message === 'SUPPLIER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      if (error.message === 'SUPPLIER_HAS_DEBT') {
        res.status(400).json({
          success: false,
          message: 'No se puede eliminar un proveedor con deuda pendiente',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al eliminar proveedor',
      });
    }
  }

  /**
   * Actualizar el saldo de un proveedor
   */
  async updateBalance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { amount, type } = req.body;

      if (!amount || !type || (type !== 'add' && type !== 'subtract')) {
        res.status(400).json({
          success: false,
          message: 'Campos requeridos: amount (número), type (add o subtract)',
        });
        return;
      }

      const supplier = await supplierService.updateBalance(parseInt(id), parseFloat(amount), type);

      res.status(200).json({
        success: true,
        message: `Saldo ${type === 'add' ? 'agregado' : 'reducido'} exitosamente`,
        data: supplier,
      });
    } catch (error: any) {
      console.error('Error al actualizar saldo:', error);

      if (error.message === 'SUPPLIER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      if (error.message === 'SUPPLIER_INACTIVE') {
        res.status(400).json({
          success: false,
          message: 'El proveedor está inactivo',
        });
        return;
      }

      if (error.message === 'INVALID_BALANCE_OPERATION') {
        res.status(400).json({
          success: false,
          message: 'El saldo no puede ser negativo',
        });
        return;
      }

      if (error.message === 'CREDIT_LIMIT_EXCEEDED') {
        res.status(400).json({
          success: false,
          message: 'El monto excede el límite de crédito disponible',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar saldo',
      });
    }
  }

  /**
   * Actualizar límite de crédito
   */
  async updateCreditLimit(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { creditLimit } = req.body;

      if (creditLimit === undefined || creditLimit === null) {
        res.status(400).json({
          success: false,
          message: 'Campo requerido: creditLimit',
        });
        return;
      }

      const supplier = await supplierService.updateCreditLimit(parseInt(id), parseFloat(creditLimit));

      res.status(200).json({
        success: true,
        message: 'Límite de crédito actualizado exitosamente',
        data: supplier,
      });
    } catch (error: any) {
      console.error('Error al actualizar límite de crédito:', error);

      if (error.message === 'SUPPLIER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      if (error.message === 'INVALID_CREDIT_LIMIT') {
        res.status(400).json({
          success: false,
          message: 'El límite de crédito no puede ser negativo',
        });
        return;
      }

      if (error.message === 'CREDIT_LIMIT_BELOW_BALANCE') {
        res.status(400).json({
          success: false,
          message: 'El límite de crédito no puede ser menor al saldo actual',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar límite de crédito',
      });
    }
  }

  /**
   * Actualizar plazo de pago
   */
  async updatePaymentTerms(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentTerms } = req.body;

      if (paymentTerms === undefined || paymentTerms === null) {
        res.status(400).json({
          success: false,
          message: 'Campo requerido: paymentTerms',
        });
        return;
      }

      const supplier = await supplierService.updatePaymentTerms(parseInt(id), parseInt(paymentTerms));

      res.status(200).json({
        success: true,
        message: 'Plazo de pago actualizado exitosamente',
        data: supplier,
      });
    } catch (error: any) {
      console.error('Error al actualizar plazo de pago:', error);

      if (error.message === 'SUPPLIER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      if (error.message === 'INVALID_PAYMENT_TERMS') {
        res.status(400).json({
          success: false,
          message: 'El plazo de pago debe ser un número positivo',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar plazo de pago',
      });
    }
  }

  /**
   * Obtener proveedores con deuda
   */
  async getSuppliersWithDebt(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const suppliers = await supplierService.getSuppliersWithDebt();

      res.status(200).json({
        success: true,
        data: suppliers,
      });
    } catch (error: any) {
      console.error('Error al obtener proveedores con deuda:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener proveedores con deuda',
      });
    }
  }

  /**
   * Obtener estadísticas de proveedores
   */
  async getSupplierStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await supplierService.getSupplierStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
      });
    }
  }

  /**
   * Buscar proveedores
   */
  async searchSuppliers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { term } = req.params;

      const suppliers = await supplierService.searchSuppliers(term);

      res.status(200).json({
        success: true,
        data: suppliers,
      });
    } catch (error: any) {
      console.error('Error al buscar proveedores:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar proveedores',
      });
    }
  }

  /**
   * Verificar si se puede comprar a un proveedor
   */
  async canPurchaseFromSupplier(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { amount } = req.query;

      if (!amount) {
        res.status(400).json({
          success: false,
          message: 'Campo requerido: amount',
        });
        return;
      }

      const canPurchase = await supplierService.canPurchaseFromSupplier(
        parseInt(id),
        parseFloat(amount as string)
      );

      res.status(200).json({
        success: true,
        data: { canPurchase },
      });
    } catch (error: any) {
      console.error('Error al verificar crédito:', error);

      if (error.message === 'SUPPLIER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al verificar crédito',
      });
    }
  }

  /**
   * Activar/desactivar proveedor
   */
  async toggleSupplierStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const supplier = await supplierService.toggleSupplierStatus(parseInt(id));

      res.status(200).json({
        success: true,
        message: `Proveedor ${supplier.isActive ? 'activado' : 'desactivado'} exitosamente`,
        data: supplier,
      });
    } catch (error: any) {
      console.error('Error al cambiar estado del proveedor:', error);

      if (error.message === 'SUPPLIER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      if (error.message === 'SUPPLIER_HAS_PENDING_DEBT') {
        res.status(400).json({
          success: false,
          message: 'No se puede activar un proveedor con deuda pendiente',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al cambiar estado del proveedor',
      });
    }
  }

  /**
   * Obtener proveedores por plazo de pago
   */
  async getSuppliersByPaymentTerms(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { paymentTerms } = req.params;

      const suppliers = await supplierService.getSuppliersByPaymentTerms(parseInt(paymentTerms));

      res.status(200).json({
        success: true,
        data: suppliers,
      });
    } catch (error: any) {
      console.error('Error al obtener proveedores por plazo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener proveedores por plazo',
      });
    }
  }

  /**
   * Obtener top proveedores
   */
  async getTopSuppliers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { limit } = req.query;

      const suppliers = await supplierService.getTopSuppliers(
        limit ? parseInt(limit as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: suppliers,
      });
    } catch (error: any) {
      console.error('Error al obtener top proveedores:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener top proveedores',
      });
    }
  }
}

export default new SupplierController();
