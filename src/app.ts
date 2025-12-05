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
    explorer: true,
    swaggerOptions: {
      url: process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}/api-docs/swagger.json`
        : '/api-docs/swagger.json',
      validatorUrl: null,
    },
  };
  
  // Serve Swagger UI
  app.get('/api-docs', (req, res) => {
    res.send(
      swaggerUi.generateHTML(swaggerSpec, swaggerUiOptions)
    );
  });
  
  // Serve Swagger JSON
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  // Serve Swagger UI assets
  app.use('/api-docs', swaggerUi.serveFiles(undefined, swaggerUiOptions));

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

