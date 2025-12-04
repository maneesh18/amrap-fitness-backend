import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateDTO } from '../middleware/validation';
import { CreateUserDTO } from '../../../application/dtos/CreateUserDTO';
import { UpdateUserDTO } from '../../../application/dtos/UpdateUserDTO';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - dateOfBirth
   *               - fitnessGoal
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               dateOfBirth:
   *                 type: string
   *                 format: date
   *               fitnessGoal:
   *                 type: string
   *                 enum: [strength, hypertrophy, endurance]
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Validation error
   *       409:
   *         description: User with email already exists
   */
  router.post('/', validateDTO(CreateUserDTO), (req, res, next) => {
    userController.create(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: List all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   */
  router.get('/', (req, res, next) => {
    userController.list(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: User found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   */
  router.get('/:id', (req, res, next) => {
    userController.getById(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               dateOfBirth:
   *                 type: string
   *                 format: date
   *               fitnessGoal:
   *                 type: string
   *                 enum: [strength, hypertrophy, endurance]
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   */
  router.put('/:id', validateDTO(UpdateUserDTO), (req, res, next) => {
    userController.update(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   */
  router.delete('/:id', (req, res, next) => {
    userController.delete(req, res).catch(next);
  });

  return router;
}

