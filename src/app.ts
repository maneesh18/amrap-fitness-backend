import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './interface/docs/swagger';
import { createUserRoutes } from './interface/http/routes/userRoutes';
import { createGymRoutes } from './interface/http/routes/gymRoutes';
import { createMembershipRoutes } from './interface/http/routes/membershipRoutes';
import { errorHandler } from './interface/http/middleware/errorHandler';
import { userController, gymController, membershipController } from './application/container';

const app = express();

export function createApp(): Express {

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Swagger documentation
  const swaggerUiOptions = {
    swaggerOptions: {
      url: '/api/api-docs/swagger.json',
    },
  };
  
  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  
  // Serve Swagger JSON
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Routes
  app.use('/api/users', createUserRoutes(userController));
  app.use('/api/gyms', createGymRoutes(gymController));
  app.use('/api/memberships', createMembershipRoutes(membershipController));

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

// Export the app instance by default
export default createApp();

