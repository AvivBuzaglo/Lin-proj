import { storageService } from '../async-storage.service'
import { makeId, loadFromStorage, saveToStorage } from '../util.service'
import { userService } from '../user'

const ORDERS_STORAGE_KEY = 'order';

_createOrders()

query()
console.log(query({ tag: 'logo design' }))
export const orderService = {
  query,
  getById,
  save,
  remove,
  addOrderMsg,
  getEmptyOrder
}
window.cs = orderService


async function query() {
  let orders;

  try {
    orders = await storageService.query(ORDERS_STORAGE_KEY); // Fetch orders from storage or API
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return orders;
}


function getById(orderId) {
  return storageService.get(ORDERS_STORAGE_KEY, orderId)
}

async function remove(orderId) {
  // throw new Error('Nope')
  await storageService.remove(ORDERS_STORAGE_KEY, orderId)
}

async function save(order) {
  var savedOrder
  if (order._id) {
    const orderToSave = {
      _id: order._id,
      price: order.price,
      speed: order.speed,
    }
    savedOrder = await storageService.put(ORDERS_STORAGE_KEY, orderToSave)
  } else {
    const orderToSave = {
      _id: makeId(),
      care: order.care,
      date: order.date,
      start: order.start,
      end: order.end,
      // Later, owner is set by the backend
      owner: userService.getLoggedinUser(),
      msgs: []
    }
    savedOrder = await storageService.post(ORDERS_STORAGE_KEY, orderToSave)
  }
  return savedOrder
}

async function addOrderMsg(orderId, txt) {
  // Later, this is all done by the backend
  const order = await getById(orderId)

  const msg = {
    id: makeId(),
    by: userService.getLoggedinUser(),
    txt
  }
  order.msgs.push(msg)
  await storageService.put(ORDERS_STORAGE_KEY, order)

  return msg
}

async function getEmptyOrder() {
    let emptyOrder = {
        _id: makeId(),
        customer: 'Aviv Buzaglo',
        care: '',
        date: '',
        start: '',
        end: ''
    }

    return emptyOrder
}

function _createOrders() {
    let orders = loadFromStorage(ORDERS_STORAGE_KEY);
    if (!orders || !orders.lenght) {
        const orders = [
            {
                _id: 'o1234',
                customer: 'Aviv Buzaglo',
                care: 'shaping',
                date: '01/01/2025',
                start: '16:00',
                end: '16:20'
            },
            {
                _id: 'o1235',
                customer: 'Aviv Buzaglo',
                care: 'lifting',
                date: '01/01/2025',
                start: '16:20',
                end: '17:00'
            },
            {
                _id: 'o1236',
                customer: 'Aviv Buzaglo',
                care: 'micro',
                date: '01/01/2025',
                start: '17:00',
                end: '18:30'
            }
        ]
    }
}