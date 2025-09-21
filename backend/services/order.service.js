// import { storageService } from '../async-storage.service'
import fs from 'fs'
import { readJsonFile, makeId } from './util.service.js'
// import { userService } from '../user'

const ORDERS_STORAGE_KEY = 'order';
const orders = readJsonFile('./data/order.json')

// _createOrders()
// _refreshOrders()
// _refreshOrdersApi()

query()
console.log(query({ tag: 'logo design' }))
export const orderService = {
  query,
  getById,
  remove,
  save
}
// window.cs = orderService


// async function query() {
//   let orders;

//   try {
//     orders = await storageService.query(ORDERS_STORAGE_KEY); // Fetch orders from storage or API
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return [];
//   }

//   return orders;
// }


function query() {
  return Promise.resolve(orders)
}

function getById(orderId) {
  const order = orders.find(order => order._id === orderId)
  if (!order) return Promise.reject('No such order')
  return Promise.resolve(order)
}
async function remove(orderId) {
  // throw new Error('Nope')
  const idx = orders.findIndex(order => order._id === orderId)
  if (idx < 0) return Promise.reject('No such order')
  orders.splice(idx, 1)
  return _saveOrdersToFile()
}

async function save(orderToSave) {
  if (orderToSave._id) {
    const idx = orders.findIndex(order => order._id === orderToSave._id)
    if (idx < 0) return Promise.reject('No such order')
    orders[idx] = orderToSave
  } else {
    orderToSave._id = makeId()
    orders.unshift(orderToSave)
  }
  return _saveOrdersToFile().then(() => orderToSave)
}

async function _saveOrdersToFile() { 
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(orders, null, 4)
    fs.writeFile('./data/order.json', data, (err) => {
      if (err) {
        console.error('Error writing file:', err)
        return reject(err)
      }
      resolve()
    })
  })
}
// async function remove(orderId) {
//   // throw new Error('Nope')
//   await storageService.remove(ORDERS_STORAGE_KEY, orderId)
// }

// async function save(order) {
//   var savedOrder
//   if (order._id) {
//     const orderToSave = {
//       _id: order._id,
//       price: order.price,
//       speed: order.speed,
//     }
//     savedOrder = await storageService.put(ORDERS_STORAGE_KEY, orderToSave)
//   } else {
//     const orderToSave = {
//       _id: makeId(),
//       care: order.care,
//       date: order.date,
//       start: order.start,
//       end: order.end,
//       // Later, owner is set by the backend
//       owner: userService.getLoggedinUser(),
//       msgs: []
//     }
//     savedOrder = await storageService.post(ORDERS_STORAGE_KEY, orderToSave)
//   }
//   return savedOrder
// }

// async function addOrderMsg(orderId, txt) {
//   // Later, this is all done by the backend
//   const order = await getById(orderId)

//   const msg = {
//     id: makeId(),
//     by: userService.getLoggedinUser(),
//     txt
//   }
//   order.msgs.push(msg)
//   await storageService.put(ORDERS_STORAGE_KEY, order)

//   return msg
// }

// async function getEmptyOrder() {
//     let emptyOrder = {
//         _id: makeId(),
//         customer: 'Aviv Buzaglo',
//         care: '',
//         date: '',
//         start: '',
//         end: ''
//     }

//     return emptyOrder
// }

// function _removeExpiredOrders() {
//   const orders = loadFromStorage(ORDERS_STORAGE_KEY)
//   if (!orders) return
//   const today = new Date()

//   return orders.filter(order => {
//     const [day, month, year] = order.date.split('.').map(num => parseInt(num))
//     const orderDate = new Date(year, month - 1, day)
//     return orderDate >= today
//   })
// }

// function _refreshOrders() {
//   const orders = _removeExpiredOrders()
//   if (!orders) return
//   saveToStorage(ORDERS_STORAGE_KEY, orders)
// }

// async function _refreshOrdersApi() {
//   const orders = loadFromStorage(ORDERS_STORAGE_KEY)

//   for(let order of orders) {
//     const orderDate = new Date(order.date)
//     if(orderDate < new Date()) {
//       await remove(order._id)
//     }
//   }
// }

// function _createOrders() {
//     let orders = loadFromStorage(ORDERS_STORAGE_KEY);
//     if (!orders || !orders.lenght) {
//         const orders = [
//             {
//                 _id: 'o1234',
//                 customer: 'Aviv Buzaglo',
//                 care: 'shaping',
//                 date: '01/01/2025',
//                 start: '16:00',
//                 end: '16:20'
//             },
//             {
//                 _id: 'o1235',
//                 customer: 'Aviv Buzaglo',
//                 care: 'lifting',
//                 date: '01/01/2025',
//                 start: '16:20',
//                 end: '17:00'
//             },
//             {
//                 _id: 'o1236',
//                 customer: 'Aviv Buzaglo',
//                 care: 'micro',
//                 date: '01/01/2025',
//                 start: '17:00',
//                 end: '18:30'
//             }
//         ]
//     }
// }