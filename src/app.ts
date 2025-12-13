import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './interface/docs/swagger';
import { createUserRoutes } from './interface/http/routes/userRoutes';
import { createGymRoutes } from './interface/http/routes/gymRoutes';
import { createMembershipRoutes } from './interface/http/routes/membershipRoutes';
import { createAuthRoutes } from './interface/http/routes/authRoutes';
import { errorHandler } from './interface/http/middleware/errorHandler';
import { userController, gymController, membershipController, authController } from './interface/container';
import { AuthMiddleware } from './interface/http/middleware/AuthMiddleware';

const app = express();
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
const JS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js";
const JS_PRESET_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js";

export function createApp(): Express {

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCssUrl: CSS_URL,
      customJs: [JS_URL, JS_PRESET_URL],
    })
  );
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', AuthMiddleware);
// 2. Create Router
  app.use('/auth', createAuthRoutes(authController));
  app.use('/api/users', createUserRoutes(userController));
  app.use('/api/gyms', createGymRoutes(gymController));
  app.use('/api/memberships', createMembershipRoutes(membershipController));

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

// Export the app instance by default
export default createApp();

