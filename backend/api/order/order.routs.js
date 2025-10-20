import express from 'express'
import {getOrders, postOrder, getOrderById, deleteOrder} from './order.controller.js'

const router = express.Router()

router.get('/', getOrders)
router.post('/', postOrder)
router.get('/:orderId', getOrderById)
router.delete('/:orderId', deleteOrder)

export const orderRoutes = router