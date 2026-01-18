import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'
import { logger } from '../../services/logger.service.js'


export const orderService = {
  query,
  getById,
  remove,
  save
}


async function query(filterBy = { date: '' }) {
  try{
    const collection = await dbService.getCollection('orders')
    var filteredOrders = await collection.find().toArray()
    if(filterBy.date) { 
      const regExp = new RegExp(filterBy.date, 'i')
      filteredOrders = filteredOrders.filter(order => regExp.test(order.date))
    }
    return Promise.resolve(filteredOrders)
  } catch (err) {
    logger.error('Cannot find orders (service)', err)
    throw err
  }
}

async function getById(orderId) {
  try {
    const collection = await dbService.getCollection('orders')
    const order = await collection.findOne({ _id: ObjectId.createFromHexString(orderId) })
    if (!order) return Promise.reject('No such order')
    return Promise.resolve(order)
  } catch (err) {
    logger.error('Cannot find order by id (service)', err)
    throw err
  }
}

async function remove(orderId) {
  try {
    const collection = await dbService.getCollection('orders')
    await collection.deleteOne({ _id: ObjectId.createFromHexString(orderId) })
    return Promise.resolve('Deleted successfully')
  } catch (err) {
    logger.error('Cannot remove order (service)', err)
    throw err
  }
}

async function save(orderToSave) {
  try {
    const collection = await dbService.getCollection('orders')
    await collection.insertOne(orderToSave)
    return Promise.resolve(orderToSave)
  } catch (err) {
    logger.error('Cannot save order (service)', err)
    throw err
  }
}

// async function deleteExpiredOrders() {
//   try {
//     const collection = await dbService.getCollection('orders')
//     const result = await collection.deleteMany({
//       expiresAt: { $lt: new Date().toISOString() }
//     })
//     if(result.deletedCount > 0 ) {
//       logger.info(`Deleted ${result.deletedCount} expired orders`)
//     } 
//   } catch (err) {
//     logger.error('failed to delete expired orders', err)
//   }
// }
