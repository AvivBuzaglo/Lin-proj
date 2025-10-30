import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser } from '../store/actions/user.actions'
import { store } from '../store/store'
import { showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'
import { userService } from '../services/user'
import { orderService } from '../services/order/order.service.remote.js' // for remote
import { blockedOrdersService } from '../services/order/blockedOrders.service.remote.js'

export function UserDetails() {

  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.watchedUser)
  const [orders, setOrders] = useState([])
  const times = ['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20', '14:40', '15:00', '15:10', '15:30', '15:50', '16:10', '16:30']


  useEffect(() => {
    loadUser(params.id)

    socketService.emit(SOCKET_EMIT_USER_WATCH, params.id)
    socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
  
    return () => {
      socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    }
    
  }, [params.id])

  useEffect(() => {
    async function loadorders() {
      const loggedUser = await userService.getLoggedinUser()
      setOrders(loggedUser.orders)
    }    
    loadorders()
  }, [])


  function onUserUpdate(user) {
    showSuccessMsg(`This user ${user.fullname} just got updated from socket, new score: ${user.score}`)
    store.dispatch({ type: 'SET_WATCHED_USER', user })
  }

  function setCare(care) {
    if(care === 'shaping') return 'עיצוב גבות'
    if(care === 'lift') return 'הרמת גבות'
    if(care === 'micro') return 'מיקרובליידינג'
  }

  const onCancelOrder = async (date, start, idx) => { 
    async function getOrderId(date, start) {
        const result = await orderService.query({date: date})
        const orderIdx = result.findIndex((order) => order.start === start)
        
        return result[orderIdx]._id
    }
    const orderId = await getOrderId(date, start)
    const order = await orderService.getById(orderId)
    await orderService.remove(orderId)
    if(order.care === 'micro' || order.care === 'lift') {
      const index1 = times.indexOf(order.start)
      const index2 = times.indexOf(order.end)
      const occupiedHours = times.slice(index1, index2)
      for(let hour of occupiedHours) {
        await blockedOrdersService.removeHours({date: date, start: hour})
      }
    } else {
        await blockedOrdersService.removeHours({date: date, start: start})
      }
    const newOrders = orders.filter((_, orderIdx) => orderIdx !== idx)
    user.orders = newOrders

    await userService.update(user)
    setOrders(newOrders)
    showSuccessMsg('התור בוטל בהצלחה')
  }

  return (
    <section className="user-details">
      <h1 className='user-details-header'>פרטי  חשבון</h1>
      {user && <div>
        <h4>
          {user.fullname}
        </h4>
        <div>
          <h3 className='user-orders-header'>תורים עתידיים</h3>
          <table className="user-orders-table">
            <thead>
              <tr>
                <td className='user-thead-td'>
                  סוג טיפול
                </td>
                <td className='user-thead-td'>
                  תאריך
                </td>
                <td className='user-thead-td'>
                  שעת התחלה
                </td>
                <td className='user-thead-td'>
                  שעת סיום
                </td>  
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) =>(
                <tr key={i}>
                  <td className='user-tbody-td'>{setCare(order.care)}</td>
                  <td className='user-tbody-td'>{order.date}</td>
                  <td className='user-tbody-td'>{order.start}</td>
                  <td className='user-tbody-td'>{order.end}</td>
                  <td><button className='cancel-order-btn' onClick={() => onCancelOrder(order.date, order.start, i)}>בטל תור</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </section>
  )
}