import { Router } from 'express';
import { GymController } from '../controllers/GymController';
import { validateDTO } from '../middleware/validation';
import { CreateGymDTO } from '../../../application/dtos/CreateGymDTO';
import { UpdateGymDTO } from '../../../application/dtos/UpdateGymDTO';

export function createGymRoutes(gymController: GymController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/gyms:
   *   post:
   *     summary: Create a new gym
   *     tags: [Gyms]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - type
   *             properties:
   *               name:
   *                 type: string
   *               type:
   *                 type: string
   *                 enum: [commercial, home, apartment]
   *               location:
   *                 type: string
   *               capacity:
   *                 type: integer
   *                 minimum: 1
   *     responses:
   *       201:
   *         description: Gym created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Gym'
   */
  router.post('/', validateDTO(CreateGymDTO), (req, res, next) => {
    gymController.create(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/gyms:
   *   get:
   *     summary: List all gyms
   *     tags: [Gyms]
   *     responses:
   *       200:
   *         description: List of gyms
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Gym'
   */
  router.get('/', (req, res, next) => {
    gymController.listMyGyms(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/gyms/available-spots:
   *   get:
   *     summary: List gyms with available spots, sorted by availability
   *     tags: [Gyms]
   *     responses:
   *       200:
   *         description: List of gyms with available spots
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   gym:
   *                     $ref: '#/components/schemas/Gym'
   *                   availableSpots:
   *                     type: integer
   *                     nullable: true
   *                   currentCount:
   *                     type: integer
   */
  router.get('/available-spots', (req, res, next) => {
    gymController.listWithAvailableSpots(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/gyms/{id}:
   *   get:
   *     summary: Get gym by ID
   *     tags: [Gyms]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Gym found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Gym'
   *       404:
   *         description: Gym not found
   */
  router.get('/:id', (req, res, next) => {
    gymController.getById(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/gyms/{id}:
   *   put:
   *     summary: Update gym
   *     tags: [Gyms]
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
   *               type:
   *                 type: string
   *                 enum: [commercial, home, apartment]
   *               location:
   *                 type: string
   *                 nullable: true
   *               capacity:
   *                 type: integer
   *                 nullable: true
   *                 minimum: 1
   *     responses:
   *       200:
   *         description: Gym updated successfully
   *       404:
   *         description: Gym not found
   */
  router.put('/:id', validateDTO(UpdateGymDTO), (req, res, next) => {
    gymController.update(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/gyms/{id}:
   *   delete:
   *     summary: Delete gym
   *     tags: [Gyms]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Gym deleted successfully
   *       404:
   *         description: Gym not found
   */
  router.delete('/:id', (req, res, next) => {
    gymController.delete(req, res).catch(next);
  });

  return router;
}

