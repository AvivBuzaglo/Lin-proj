import { orderService } from "./order.service.js"
import { logger } from '../../services/logger.service.js'


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
    try {
        await orderService.save(orderToSave)
        .then(savedOrder => res.send(savedOrder))
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
        await orderService.remove(orderId)
        .then(() => res.send({ msg: 'Deleted successfully' }))
    } catch (err) {
        logger.error('Error in delete /api/order/:orderId', err)
        res.status(500).send({ err: 'Failed to remove order' })
    }
}

