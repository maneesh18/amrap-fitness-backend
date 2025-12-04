import { Router } from 'express';
import { MembershipController } from '../controllers/MembershipController';
import { validateDTO } from '../middleware/validation';
import { CreateMembershipDTO } from '../../../application/dtos/CreateMembershipDTO';

export function createMembershipRoutes(membershipController: MembershipController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/memberships:
   *   post:
   *     summary: Add a user to a gym (create membership)
   *     tags: [Memberships]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *               - gymId
   *             properties:
   *               userId:
   *                 type: string
   *                 format: uuid
   *               gymId:
   *                 type: string
   *                 format: uuid
   *     responses:
   *       201:
   *         description: Membership created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Membership'
   *       400:
   *         description: Gym capacity exceeded
   *       404:
   *         description: User or Gym not found
   *       409:
   *         description: Membership already exists
   */
  router.post('/', validateDTO(CreateMembershipDTO), (req, res, next) => {
    membershipController.addUserToGym(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/memberships/users/{userId}/gyms/{gymId}:
   *   delete:
   *     summary: Remove a user from a gym
   *     tags: [Memberships]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: path
   *         name: gymId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Membership removed successfully
   *       404:
   *         description: Membership not found
   */
  router.delete('/users/:userId/gyms/:gymId', (req, res, next) => {
    membershipController.removeUserFromGym(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/memberships/gyms/{gymId}/users:
   *   get:
   *     summary: List all users of a gym, sorted by join date (most recent first)
   *     tags: [Memberships]
   *     parameters:
   *       - in: path
   *         name: gymId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       404:
   *         description: Gym not found
   */
  router.get('/gyms/:gymId/users', (req, res, next) => {
    membershipController.listGymUsers(req, res).catch(next);
  });

  /**
   * @swagger
   * /api/memberships/users/{userId}/gyms:
   *   get:
   *     summary: List all gyms a user belongs to
   *     tags: [Memberships]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: List of gyms
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Gym'
   *       404:
   *         description: User not found
   */
  router.get('/users/:userId/gyms', (req, res, next) => {
    membershipController.listUserGyms(req, res).catch(next);
  });

  return router;
}

