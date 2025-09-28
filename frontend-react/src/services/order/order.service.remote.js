// import { storageService } from '../async-storage.service'
import axios from 'axios'
import { makeId, loadFromStorage, saveToStorage } from '../util.service.js'
import { userService } from '../user/index.js'

// const ORDERS_STORAGE_KEY = 'order';
// const orders = readJsonFile('backend\data\order.json')
const BASE_URL = '/api/order/'

// _createOrders()
// _refreshOrders()
// _refreshOrdersApi()

// query()
// console.log(query({ tag: 'logo design' }))
export const orderService = {
  query,
  getById,
  save,
  remove,
}
window.cs = orderService


async function query() {
    return axios.get(BASE_URL).then(res => res.data)
}

function getById(orderId) {
    return axios.get(BASE_URL + carId).then(res => res.data)
}

function remove(orderId) {
    return axios.get(BASE_URL + orderId + '/remove')
}

function save(order) {
    const url = BASE_URL + 'save'
    const owner = userService.getLoggedinUser()
    var queryParams = `?care=${order.care}&date=${order.date}&start=${order.start}&end=${order.end}&owner=${owner._id}`
    if(order._id) queryParams += `&_id=${order._id}`
    return axios.get(url + queryParams).then(res => res.data)
}