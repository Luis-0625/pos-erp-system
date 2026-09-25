import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import clientService from '../services/client.service';

class ClientController {
  /**
   * Crear un nuevo cliente
   */
  async createClient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        documentType,
        documentNumber,
        businessName,
        firstName,
        lastName,
        email,
        phone,
        mobile,
        address,
        city,
        state,
        postalCode,
        country,
        clientType,
        creditLimit,
        notes,
      } = req.body;

      // Validar campos requeridos
      if (!documentType || !documentNumber || !clientType) {
        res.status(400).json({
          success: false,
          message: 'Campos requeridos: documentType, documentNumber, clientType',
        });
        return;
      }

      const client = await clientService.createClient({
        documentType,
        documentNumber,
        businessName,
        firstName,
        lastName,
        email,
        phone,
        mobile,
        address,
        city,
        state,
        postalCode,
        country,
        clientType,
        creditLimit,
        notes,
      });

      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: client,
      });
    } catch (error: any) {
      console.error('Error al crear cliente:', error);

      if (error.message === 'DOCUMENT_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'Ya existe un cliente con este número de documento',
        });
        return;
      }

      if (error.message === 'BUSINESS_NAME_REQUIRED') {
        res.status(400).json({
          success: false,
          message: 'El nombre comercial es requerido para empresas',
        });
        return;
      }

      if (error.message === 'NAME_REQUIRED') {
        res.status(400).json({
          success: false,
          message: 'El nombre y apellido son requeridos para personas naturales',
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
        message: 'Error al crear cliente',
      });
    }
  }

  /**
   * Obtener todos los clientes con filtros
   */
  async listClients(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        search,
        clientType,
        isActive,
        hasDebt,
        city,
        state,
        page,
        limit,
        sortBy,
        sortOrder,
      } = req.query;

      const result = await clientService.listClients({
        search: search as string,
        clientType: clientType as 'PERSON' | 'COMPANY',
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
        data: result.clients,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Error al listar clientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar clientes',
      });
    }
  }

  /**
   * Obtener un cliente por ID
   */
  async getClient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const client = await clientService.getClientById(parseInt(id));

      if (!client) {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error: any) {
      console.error('Error al obtener cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cliente',
      });
    }
  }

  /**
   * Obtener un cliente por número de documento
   */
  async getClientByDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { documentNumber } = req.params;

      const client = await clientService.getClientByDocument(documentNumber);

      if (!client) {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error: any) {
      console.error('Error al obtener cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cliente',
      });
    }
  }

  /**
   * Actualizar un cliente
   */
  async updateClient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const client = await clientService.updateClient(parseInt(id), updateData);

      res.status(200).json({
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: client,
      });
    } catch (error: any) {
      console.error('Error al actualizar cliente:', error);

      if (error.message === 'CLIENT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
        return;
      }

      if (error.message === 'DOCUMENT_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'Ya existe un cliente con este número de documento',
        });
        return;
      }

      if (error.message === 'BUSINESS_NAME_REQUIRED') {
        res.status(400).json({
          success: false,
          message: 'El nombre comercial es requerido para empresas',
        });
        return;
      }

      if (error.message === 'NAME_REQUIRED') {
        res.status(400).json({
          success: false,
          message: 'El nombre y apellido son requeridos para personas naturales',
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
        message: 'Error al actualizar cliente',
      });
    }
  }

  /**
   * Eliminar un cliente (soft delete)
   */
  async deleteClient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await clientService.deleteClient(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Cliente eliminado exitosamente',
      });
    } catch (error: any) {
      console.error('Error al eliminar cliente:', error);

      if (error.message === 'CLIENT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
        return;
      }

      if (error.message === 'CLIENT_HAS_DEBT') {
        res.status(400).json({
          success: false,
          message: 'No se puede eliminar un cliente con deuda pendiente',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al eliminar cliente',
      });
    }
  }

  /**
   * Actualizar el saldo de un cliente
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

      const client = await clientService.updateBalance(parseInt(id), parseFloat(amount), type);

      res.status(200).json({
        success: true,
        message: `Saldo ${type === 'add' ? 'agregado' : 'reducido'} exitosamente`,
        data: client,
      });
    } catch (error: any) {
      console.error('Error al actualizar saldo:', error);

      if (error.message === 'CLIENT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
        return;
      }

      if (error.message === 'CLIENT_INACTIVE') {
        res.status(400).json({
          success: false,
          message: 'El cliente está inactivo',
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

      const client = await clientService.updateCreditLimit(parseInt(id), parseFloat(creditLimit));

      res.status(200).json({
        success: true,
        message: 'Límite de crédito actualizado exitosamente',
        data: client,
      });
    } catch (error: any) {
      console.error('Error al actualizar límite de crédito:', error);

      if (error.message === 'CLIENT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
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
   * Obtener clientes con deuda
   */
  async getClientsWithDebt(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const clients = await clientService.getClientsWithDebt();

      res.status(200).json({
        success: true,
        data: clients,
      });
    } catch (error: any) {
      console.error('Error al obtener clientes con deuda:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener clientes con deuda',
      });
    }
  }

  /**
   * Obtener clientes por tipo
   */
  async getClientsByType(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type } = req.params;

      if (type !== 'PERSON' && type !== 'COMPANY') {
        res.status(400).json({
          success: false,
          message: 'Tipo de cliente inválido. Use: PERSON o COMPANY',
        });
        return;
      }

      const clients = await clientService.getClientsByType(type);

      res.status(200).json({
        success: true,
        data: clients,
      });
    } catch (error: any) {
      console.error('Error al obtener clientes por tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener clientes por tipo',
      });
    }
  }

  /**
   * Obtener estadísticas de clientes
   */
  async getClientStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await clientService.getClientStats();

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
   * Buscar clientes
   */
  async searchClients(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { term } = req.params;

      const clients = await clientService.searchClients(term);

      res.status(200).json({
        success: true,
        data: clients,
      });
    } catch (error: any) {
      console.error('Error al buscar clientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar clientes',
      });
    }
  }

  /**
   * Verificar si un cliente puede comprar a crédito
   */
  async canPurchaseOnCredit(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const canPurchase = await clientService.canPurchaseOnCredit(
        parseInt(id),
        parseFloat(amount as string)
      );

      res.status(200).json({
        success: true,
        data: { canPurchase },
      });
    } catch (error: any) {
      console.error('Error al verificar crédito:', error);

      if (error.message === 'CLIENT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
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
   * Activar/desactivar cliente
   */
  async toggleClientStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const client = await clientService.toggleClientStatus(parseInt(id));

      res.status(200).json({
        success: true,
        message: `Cliente ${client.isActive ? 'activado' : 'desactivado'} exitosamente`,
        data: client,
      });
    } catch (error: any) {
      console.error('Error al cambiar estado del cliente:', error);

      if (error.message === 'CLIENT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
        return;
      }

      if (error.message === 'CLIENT_HAS_PENDING_DEBT') {
        res.status(400).json({
          success: false,
          message: 'No se puede activar un cliente con deuda pendiente',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al cambiar estado del cliente',
      });
    }
  }
}

export default new ClientController();
