import { orderService } from "./order.service.js"
import { sendPushNotification } from "../../services/pushNotifications.service.js"
import { buildExpirationDate } from "../../services/util.service.js"
import { logger } from '../../services/logger.service.js'
import { dbService } from "../../services/db.service.js"
import { ObjectId } from "mongodb"


export async function getOrders(req, res) {
    const filterBy = {
        date: req.query.date || '',
    }
    try {
        await orderService.query(filterBy)
        .then(orders => res.send(orders))
    } catch (err) {
        logger.error('Error in /api/order', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

export async function postOrder(req, res) {
    const orderToSave = req.body


    orderToSave.expiresAt = new Date (buildExpirationDate(orderToSave.date, orderToSave.end)) 
    try {
        await orderService.save(orderToSave)
        .then(savedOrder => res.send(savedOrder))

        const userCollection = await dbService.getCollection('user')

        const orderOwner = await userCollection.findOne({
            _id: ObjectId.createFromHexString(orderToSave.owner._id)
        })
        if(orderOwner?.fcmToken) {
            await sendPushNotification(
                orderOwner.fcmToken,
                'התור נקבע בהצלחה!',
                `התור שלך ל${orderToSave.care} בתאריך ${orderToSave.date} בשעה ${orderToSave.start} נקלט בהצלחה!`
            )
        }

        const admins = await userCollection.find({ isAdmin: true }).toArray()
        for(const admin of admins) {
            if(admin?.fcmToken) {
                await sendPushNotification(
                    admin.fcmToken,
                    'תור חדש נקבע!', 
                    `${orderToSave.owner.fullname} קבע תור ל ${orderToSave.care} בתאריך ${orderToSave.date} בשעה ${orderToSave.start}`
                )
            }
        }
    } catch (err) {
        logger.error('Error in /api/order', err)
        res.status(500).send({ err: 'Failed to save order' })
    }
}

export async function getOrderById(req, res) {
    const { orderId } = req.params
    try {
        await orderService.getById(orderId)
        .then(order => res.send(order))
    } catch (err) { 
        logger.error('Error in get /api/order/:orderId', err)
        res.status(500).send({ err: 'Failed to get order by id' })
    }  
}

export async function deleteOrder(req, res) {
    const { orderId } = req.params
    try {
        const ordersCollection = await dbService.getCollection('orders')
        const order = await ordersCollection.findOne({ _id: ObjectId.createFromHexString(orderId) })

        await orderService.remove(orderId)
        .then(() => res.send({ msg: 'Deleted successfully' }))

        if(order) {
            const userCollection = await dbService.getCollection('user')

            const orderOwner = await userCollection.findOne({
                _id: ObjectId.createFromHexString(order.owner._id)
            })
            if(orderOwner?.fcmToken) {
                await sendPushNotification(
                    orderOwner.fcmToken,
                    'תור בוטל!',
                    `התור שלך ל${order.care} בתאריך ${order.date} בשעה ${order.start} בוטל`
                )
            }

            const admins = await userCollection.find({ isAdmin: true }).toArray()
            for(const admin of admins){
                if(admin?.fcmToken) {
                    await sendPushNotification(
                        admin.fcmToken,
                        'תור בוטל!',
                        `${order.owner.fullname} ביטל תור ל ${order.care} בתאריך ${order.date} בשעה ${order.start}`
                    )
                }
            }
        }

    } catch (err) {
        logger.error('Error in delete /api/order/:orderId', err)
        res.status(500).send({ err: 'Failed to remove order' })
    }
}

