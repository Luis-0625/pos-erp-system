import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Cargar variables de entorno
dotenv.config();

// Importar configuración de base de datos
import { sequelize } from './config/database';

// Importar rutas (se crearán después)
// import authRoutes from './routes/auth.routes';
// import userRoutes from './routes/user.routes';
// import productRoutes from './routes/product.routes';
// import saleRoutes from './routes/sale.routes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.',
});
app.use('/api', limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de salud
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'POS ERP API está funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Rutas de la API
const API_VERSION = process.env.API_VERSION || 'v1';
app.get(`/api/${API_VERSION}`, (req: Request, res: Response) => {
  res.status(200).json({
    message: 'API POS ERP - Sistema de Punto de Venta y Gestión Empresarial',
    version: API_VERSION,
    endpoints: {
      auth: `/api/${API_VERSION}/auth`,
      users: `/api/${API_VERSION}/users`,
      products: `/api/${API_VERSION}/products`,
      sales: `/api/${API_VERSION}/sales`,
      clients: `/api/${API_VERSION}/clients`,
      inventory: `/api/${API_VERSION}/inventory`,
      purchases: `/api/${API_VERSION}/purchases`,
      suppliers: `/api/${API_VERSION}/suppliers`,
      portfolio: `/api/${API_VERSION}/portfolio`,
      reports: `/api/${API_VERSION}/reports`,
    },
  });
});

// Aquí irán las rutas principales
// app.use(`/api/${API_VERSION}/auth`, authRoutes);
// app.use(`/api/${API_VERSION}/users`, userRoutes);
// app.use(`/api/${API_VERSION}/products`, productRoutes);
// app.use(`/api/${API_VERSION}/sales`, saleRoutes);

// Manejo de errores 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
  });
});

// Middleware de manejo de errores global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');

    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 API disponible en http://localhost:${PORT}/api/${API_VERSION}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

export default app;
