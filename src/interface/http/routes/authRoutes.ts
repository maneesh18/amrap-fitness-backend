import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateDTO } from '../middleware/validation'; // Your existing validation middleware
import { AuthMiddleware } from '../middleware/AuthMiddleware'; // We need this for Logout
import { SignUpDTO } from '../../../application/dtos/SignUpDTO';
import { SignInDTO } from '../../../application/dtos/SignInDTO';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       400:
   *         description: Validation error
   *       409:
   *         description: Username or email already exists
   */
  router.post('/signup', validateDTO(SignUpDTO), (req, res, next) => {
    authController.register(req, res).catch(next);
  });

  /**
   * @swagger
   * /auth/verify:
   *   post:
   *     summary: Verify email with code
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - code
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               code:
   *                 type: string
   *     responses:
   *       200:
   *         description: Email verified successfully
   *       400:
   *         description: Email and code are required
   *       401:
   *         description: Invalid verification code
   */
  router.post('/verify', (req, res, next) => {
    authController.verify(req, res).catch(next);
  });


  /**
   * @swagger
   * /auth/signin:
   *   post:
   *     summary: Log in and receive tokens
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *                 idToken:
   *                   type: string
   *       401:
   *         description: Invalid credentials
   */
  router.post('/signin', validateDTO(SignInDTO), (req, res, next) => {
    authController.login(req, res).catch(next);
  });

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user (Global Sign Out)
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logged out successfully
   *       401:
   *         description: Missing or invalid token
   */
  // Note: Logout MUST be protected to know WHICH token to invalidate.
  // We explicitly add AuthMiddleware here since /auth usually isn't protected globally.
  router.post('/logout', AuthMiddleware, (req, res, next) => {
    authController.logout(req, res).catch(next);
  });

  return router;
}