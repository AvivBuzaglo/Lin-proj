import fs from 'fs'
import { readJsonFile, makeId } from './util.service.js'

const orders = readJsonFile('./data/order.json')


export const orderService = {
  query,
  getById,
  remove,
  save
}


function query(filterBy = { date: '' }) {
  var filteredOrders = orders
    if(filterBy.date) { 
      const regExp = new RegExp(filterBy.date, 'i')
      filteredOrders = filteredOrders.filter(order => regExp.test(order.date))
    }

  return Promise.resolve(filteredOrders)
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