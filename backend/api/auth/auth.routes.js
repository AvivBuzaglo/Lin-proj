import express from 'express'

import { login, signup, logout, loggedinUser } from './auth.controller.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.get('/loggedin', loggedinUser)

export const authRoutes = router