import axios from 'axios'
import { makeId, loadFromStorage, saveToStorage } from '../util.service.js'
import { userService } from '../user/index.js'

const isMobile = typeof window !== 'undefined' && !!window.Capacitor

const BASE_URL = process.env.NODE_ENV === 'production' || isMobile
    ? 'https://lin-bitton.onrender.com/api/order/'
    : '//localhost:3030/api/order/'
    
// const BASE_URL = '/api/order/'

export const orderService = {
  query,
  getById,
  save,
  remove,
}
// window.cs = orderService


async function query(filterBy = { date: '' }) {
    return axios.get(BASE_URL, {params: filterBy}).then(res => res.data)
}

function getById(orderId) {
    return axios.get(BASE_URL + orderId).then(res => res.data)
}

function remove(orderId) {
    return axios.delete(BASE_URL + orderId).then(res => res.data)
}

function save(order) {
    const owner = userService.getLoggedinUser()
    order.owner = {
        _id: owner._id,
        fullname: owner.fullname
    }
    return axios.post(BASE_URL, order).then(res => res.data)
}