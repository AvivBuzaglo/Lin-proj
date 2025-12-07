import { config } from '../config/index.js'
import { logger } from '../services/logger.service.js'
import { asyncLocalStorage } from '../services/als.service.js'
import { authService } from '../api/auth/auth.service.js'

// export function requireAuth(req, res, next) { // 07/12
// 	const { loggedinUser } = asyncLocalStorage.getStore()
// 	req.loggedinUser = loggedinUser

// 	if (config.isGuestMode && !loggedinUser) {
// 		req.loggedinUser = { _id: '', fullname: 'Guest' }
// 		return next()
// 	}
// 	if (!loggedinUser) return res.status(401).send('Not Authenticated')
// 	next()
// }

export async function requireAuth(req, res, next) {
	try {
		const authHeader = req.headers.authorization || ''
		const token = authHeader.replace('Bearer ', '')
		if(!token) return res.status(401).send('Not Authenticated (token)')
		
		const loggedinUser = await authService.validateToken(token)
		if(!loggedinUser) return res.status(401).send('Not Authenticated (loggedinUser)')
		
		asyncLocalStorage.getStore().loggedinUser = loggedinUser
		req.loggedinUser = loggedinUser
		next()
	} catch (err) {
		res.status(401).send('Not Authenticated (all)', err)
	}
}

// export function requireAuth(req, res, next) {
// 	const authHeader = req.headers.authorization

// 	if(!authHeader) return res.status(401).send('Missing Authorization header')
	
// 	const token = authHeader.split(' ')[1]
// 	if(!token) return res.status(401).send('Invalid Authorization header')

// 	try{
// 		const user = authService.validateToken(token)
// 		req.loggedinUser = user
// 		next()
// 	} catch (err) {
// 		return res.status(401).send('Invalid token')
// 	}
// }

export async function requireAdmin(req, res, next) {
	try { 
		const authHeader = req.headers.authorization || ''
		const token = authHeader.replace('Bearer ', '')

		if(!token) return res.status(401).send('Not Authenticated (token)')
		
		const loggedinUser = await authService.validateToken(token)
		if(!loggedinUser) return res.status(401).send('Not Authenticated (loggedinUser)')
		
		if(!loggedinUser.isAdmin) return res.status(403).send('Not Authenticated (admin)')
		
		asyncLocalStorage.getStore().loggedinUser = loggedinUser
		req.loggedinUser = loggedinUser
		next()
	} catch (err) {
		console.log('Admin auth error', err)
		res.status(401).send('Not Authenticated (all)')
	}
}


// export function requireAdmin(req, res, next) { // 07/12
// 	const { loggedinUser } = asyncLocalStorage.getStore()
    
// 	if (!loggedinUser) return res.status(401).send('Not Authenticated')
// 	if (!loggedinUser.isAdmin) {
// 		logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
// 		res.status(403).end('Not Authorized')
// 		return
// 	}
// 	next()
// }