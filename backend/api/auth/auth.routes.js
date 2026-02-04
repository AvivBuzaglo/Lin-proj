import express from 'express'

import { login, signup, logout, loggedinUser, resetToken } from './auth.controller.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.post('/updateToken', resetToken)
router.get('/loggedin', loggedinUser)

export const authRoutes = router