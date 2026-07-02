import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

import { getUser, getUsers, deleteUser, updateUser, updateFcmToken, deleteAccount } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)
router.delete('/:id/account', requireAuth, deleteAccount)
router.put('/:id/fcm-token', requireAuth, updateFcmToken)

export const userRoutes = router