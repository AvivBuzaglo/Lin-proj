import {userService} from './user.service.js'
import {logger} from '../../services/logger.service.js'
import {socketService} from '../../services/socket.service.js'
import { dbService } from '../../services/db.service.js'
import { sendPushNotification } from '../../services/pushNotifications.service.js'

export async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt || '',
            minBalance: +req.query?.minBalance || 0
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function deleteAccount(req, res) {
    try {
        const userId = req.params.id
        const deletedData = await userService.deleteAccount(userId)
        res.send({ msg: 'Account Deleted Successfully' })

        const userCollection = await dbService.getCollection('user')
        const admins = await userCollection.find({ isAdmin: true }).toArray()

        const orderInfo = deletedData.orders.length > 0 
            ? deletedData.orders.map( o => `${o.care} בתאריך ${o.date} בשעה ${o.start}`).join(', ')
            : 'לא היו תורים'
        
        for(const admin of admins) {
            if(admin?.fcmToken) {
                await sendPushNotification(
                    admin.fcmToken,
                    'משתמש מחק את החשבון',
                    `${deletedData.user.fullname} מחק את השחבון שלו. תורים שנמחקו: ${orderInfo}`
                )
            }
        }
    } catch (err) {
        logger.error('Failed to delete account', err)
        res.status(400).send({ err: 'Failed to delete account' })
    }
}

export async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        res.send(savedUser)
        // logger.info(`User: ${res}`)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(400).send({ err: 'Failed to update user' })
    }
}

export async function updateFcmToken(req, res) {
    try {
        const { fcmToken } = req.body
        const userId = req.params.id
        await userService.updateFcmToken(userId, fcmToken)
        res.send({ msg: 'FCM token updated successfully' })
    } catch (err) {
        logger.error('Failed to update FCM token', err)
        res.status(400).send({ err: 'Failed to update FCM token' })
    }
}
