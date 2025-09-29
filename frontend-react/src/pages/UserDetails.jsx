import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser } from '../store/actions/user.actions'
import { store } from '../store/store'
import { showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'
import { userService } from '../services/user/user.service.local'
// import { orderService } from '../services/order/order.service.local'
import { orderService } from '../services/order/order.service.remote.js' // for remote
import { availableOrdersService } from '../services/order/availableOrder.service.local'

export function UserDetails() {

  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.watchedUser)
  const [orders, setOrders] = useState([])


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
        console.log(loggedUser.orders);
      
    }    
    loadorders()
  }, [])

  function onUserUpdate(user) {
    showSuccessMsg(`This user ${user.fullname} just got updated from socket, new score: ${user.score}`)
    store.dispatch({ type: 'SET_WATCHED_USER', user })
  }

  function setCare(care) {
    // switch (care) {
    //   case (care === 'shaping'):
    //     return 'עיצוב גבות'
    //   case (care === 'lift'):
    //     return 'הרמת גבות'
    //   case (care === 'micro'):
    //     return 'מיקרובליידינג'
    // }
    if(care === 'shaping') return 'עיצוב גבות'
    if(care === 'lift') return 'הרמת גבות'
    if(care === 'micro') return 'מיקרובליידינג'
  }

  const onCancelOrder = async (date, start, idx) => { 
    async function getOrderId(date, start) {
        const result = await orderService.query()
        const orderIdx = result.findIndex((order) => order.date === date && order.start === start)
        
        return result[orderIdx]._id
    }
    const orderId = await getOrderId(date, start)
    await orderService.remove(orderId)
    await availableOrdersService.removeByTime(date, start)
    user.orders.splice(idx, 1)
    await userService.update(user)
    setOrders(user.orders)
    showSuccessMsg('התור בוטל בהצלחה')
  }

  return (
    <section className="user-details">
      <h1 className='user-details-header'>פרטי  חשבון</h1>
      {user && <div>
        <h4>
          {user.fullname}
        </h4>
        {/* <img src={user.imgUrl} style={{ width: '100px' }} /> */}
        {/* <pre> {JSON.stringify(user, null, 2)} </pre> */}
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
                  <td><button className='cancel-order-btn' onClick={() => onCancelOrder(order.date, order.start)}>בטל תור</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </section>
  )
}