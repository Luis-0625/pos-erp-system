import { Op } from 'sequelize';
import Client from '../models/Client.model';

interface CreateClientDTO {
  documentType: 'NIT' | 'CC' | 'CE' | 'PASSPORT';
  documentNumber: string;
  businessName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string;
  clientType: 'PERSON' | 'COMPANY';
  creditLimit?: number;
  notes?: string | null;
}

interface UpdateClientDTO extends Partial<CreateClientDTO> {}

interface ListClientsFilters {
  search?: string;
  clientType?: 'PERSON' | 'COMPANY';
  isActive?: boolean;
  hasDebt?: boolean;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

class ClientService {
  /**
   * Crear un nuevo cliente
   */
  async createClient(data: CreateClientDTO): Promise<Client> {
    // Validar que no exista un cliente con el mismo número de documento
    const existingClient = await Client.findOne({
      where: { documentNumber: data.documentNumber },
    });

    if (existingClient) {
      throw new Error('DOCUMENT_ALREADY_EXISTS');
    }

    // Validar datos según el tipo de cliente
    if (data.clientType === 'COMPANY') {
      if (!data.businessName) {
        throw new Error('BUSINESS_NAME_REQUIRED');
      }
    } else {
      if (!data.firstName || !data.lastName) {
        throw new Error('NAME_REQUIRED');
      }
    }

    // Validar email si se proporciona
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('INVALID_EMAIL');
      }
    }

    const client = await Client.create({
      ...data,
      country: data.country || 'Colombia',
      creditLimit: data.creditLimit || 0,
      currentBalance: 0,
      isActive: true,
    });

    return client;
  }

  /**
   * Obtener cliente por ID
   */
  async getClientById(id: number): Promise<Client | null> {
    const client = await Client.findByPk(id);
    return client;
  }

  /**
   * Obtener cliente por número de documento
   */
  async getClientByDocument(documentNumber: string): Promise<Client | null> {
    const client = await Client.findOne({
      where: { documentNumber },
    });
    return client;
  }

  /**
   * Listar clientes con filtros
   */
  async listClients(filters: ListClientsFilters = {}) {
    const {
      search,
      clientType,
      isActive,
      hasDebt,
      city,
      state,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const where: any = {};

    // Filtro de búsqueda (nombre, razón social, documento, email)
    if (search) {
      where[Op.or] = [
        { documentNumber: { [Op.iLike]: `%${search}%` } },
        { businessName: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Filtro por tipo de cliente
    if (clientType) {
      where.clientType = clientType;
    }

    // Filtro por estado activo
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Filtro por deuda
    if (hasDebt !== undefined) {
      where.currentBalance = hasDebt ? { [Op.gt]: 0 } : 0;
    }

    // Filtro por ciudad
    if (city) {
      where.city = { [Op.iLike]: `%${city}%` };
    }

    // Filtro por departamento/estado
    if (state) {
      where.state = { [Op.iLike]: `%${state}%` };
    }

    const offset = (page - 1) * limit;

    const { rows: clients, count: total } = await Client.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Actualizar cliente
   */
  async updateClient(id: number, data: UpdateClientDTO): Promise<Client> {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('CLIENT_NOT_FOUND');
    }

    // Si se está actualizando el documento, validar que no exista
    if (data.documentNumber && data.documentNumber !== client.documentNumber) {
      const existingClient = await Client.findOne({
        where: { documentNumber: data.documentNumber },
      });

      if (existingClient) {
        throw new Error('DOCUMENT_ALREADY_EXISTS');
      }
    }

    // Validar datos según el tipo de cliente
    const newClientType = data.clientType || client.clientType;
    if (newClientType === 'COMPANY') {
      if (data.businessName === null || (data.businessName === undefined && !client.businessName)) {
        throw new Error('BUSINESS_NAME_REQUIRED');
      }
    } else {
      const firstName = data.firstName !== undefined ? data.firstName : client.firstName;
      const lastName = data.lastName !== undefined ? data.lastName : client.lastName;
      if (!firstName || !lastName) {
        throw new Error('NAME_REQUIRED');
      }
    }

    // Validar email si se proporciona
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('INVALID_EMAIL');
      }
    }

    await client.update(data);

    return await this.getClientById(id) as Client;
  }

  /**
   * Eliminar cliente (soft delete)
   */
  async deleteClient(id: number): Promise<void> {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('CLIENT_NOT_FOUND');
    }

    // No permitir eliminar clientes con deuda
    if (client.currentBalance > 0) {
      throw new Error('CLIENT_HAS_DEBT');
    }

    await client.update({ isActive: false });
  }

  /**
   * Actualizar saldo del cliente
   */
  async updateBalance(id: number, amount: number, type: 'add' | 'subtract'): Promise<Client> {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('CLIENT_NOT_FOUND');
    }

    if (!client.isActive) {
      throw new Error('CLIENT_INACTIVE');
    }

    const newBalance = type === 'add' 
      ? client.currentBalance + amount 
      : client.currentBalance - amount;

    if (newBalance < 0) {
      throw new Error('INVALID_BALANCE_OPERATION');
    }

    // Validar que no exceda el límite de crédito al agregar deuda
    if (type === 'add' && newBalance > client.creditLimit) {
      throw new Error('CREDIT_LIMIT_EXCEEDED');
    }

    await client.update({ currentBalance: newBalance });

    return await this.getClientById(id) as Client;
  }

  /**
   * Actualizar límite de crédito
   */
  async updateCreditLimit(id: number, newLimit: number): Promise<Client> {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('CLIENT_NOT_FOUND');
    }

    if (newLimit < 0) {
      throw new Error('INVALID_CREDIT_LIMIT');
    }

    // No permitir reducir el límite por debajo del saldo actual
    if (newLimit < client.currentBalance) {
      throw new Error('CREDIT_LIMIT_BELOW_BALANCE');
    }

    await client.update({ creditLimit: newLimit });

    return await this.getClientById(id) as Client;
  }

  /**
   * Obtener clientes con deuda
   */
  async getClientsWithDebt() {
    const clients = await Client.findAll({
      where: {
        currentBalance: { [Op.gt]: 0 },
        isActive: true,
      },
      order: [['currentBalance', 'DESC']],
    });

    return clients;
  }

  /**
   * Obtener clientes por tipo
   */
  async getClientsByType(clientType: 'PERSON' | 'COMPANY') {
    const clients = await Client.findAll({
      where: {
        clientType,
        isActive: true,
      },
      order: [['createdAt', 'DESC']],
    });

    return clients;
  }

  /**
   * Obtener estadísticas de clientes
   */
  async getClientStats() {
    const totalClients = await Client.count({ where: { isActive: true } });
    const totalPersons = await Client.count({ where: { clientType: 'PERSON', isActive: true } });
    const totalCompanies = await Client.count({ where: { clientType: 'COMPANY', isActive: true } });
    const clientsWithDebt = await Client.count({
      where: { currentBalance: { [Op.gt]: 0 }, isActive: true },
    });

    const totalDebtResult = await Client.sum('currentBalance', {
      where: { isActive: true },
    });

    const totalCreditLimitResult = await Client.sum('creditLimit', {
      where: { isActive: true },
    });

    return {
      totalClients,
      totalPersons,
      totalCompanies,
      clientsWithDebt,
      totalDebt: totalDebtResult || 0,
      totalCreditLimit: totalCreditLimitResult || 0,
      availableCredit: (totalCreditLimitResult || 0) - (totalDebtResult || 0),
    };
  }

  /**
   * Buscar clientes
   */
  async searchClients(term: string) {
    const clients = await Client.findAll({
      where: {
        [Op.or]: [
          { documentNumber: { [Op.iLike]: `%${term}%` } },
          { businessName: { [Op.iLike]: `%${term}%` } },
          { firstName: { [Op.iLike]: `%${term}%` } },
          { lastName: { [Op.iLike]: `%${term}%` } },
          { email: { [Op.iLike]: `%${term}%` } },
        ],
        isActive: true,
      },
      limit: 20,
      order: [['createdAt', 'DESC']],
    });

    return clients;
  }

  /**
   * Verificar si un cliente puede comprar a crédito
   */
  async canPurchaseOnCredit(id: number, amount: number): Promise<boolean> {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('CLIENT_NOT_FOUND');
    }

    if (!client.isActive) {
      return false;
    }

    const newBalance = client.currentBalance + amount;
    return newBalance <= client.creditLimit;
  }

  /**
   * Activar/desactivar cliente
   */
  async toggleClientStatus(id: number): Promise<Client> {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('CLIENT_NOT_FOUND');
    }

    // No permitir activar clientes con deuda pendiente
    if (!client.isActive && client.currentBalance > 0) {
      throw new Error('CLIENT_HAS_PENDING_DEBT');
    }

    await client.update({ isActive: !client.isActive });

    return await this.getClientById(id) as Client;
  }
}

export default new ClientService();
