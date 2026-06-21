import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { generateCalender } from "../services/util.service.js"
import { orderService } from '../services/order/order.service.remote.js'
import { userService } from '../services/user/user.service.remote.js'
import { appointmentSvgs } from "../cmps/Svgs.jsx"
import { blockedOrdersService } from '../services/order/blockedOrders.service.remote.js'
import { showSuccessMsg } from '../services/event-bus.service.js'

export function AdminWatchOrders() {
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    const [showOrders, setShowOrders] = useState(false)
    const user = useSelector(storeState => storeState.userModule.user)
    const users = useSelector(storeState => storeState.userModule.users)
    
    const navigate = useNavigate()
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    const weeks = generateCalender(year, month)
    const nextWeeks = generateCalender(year, nextMonth.getMonth())
    const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']    
    const times = ['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20', '14:40', '15:00', '15:10', '15:30', '15:50', '16:10', '16:30']


    useEffect(() => {
        if(!user.isAdmin) navigate('/')
        loadUsers()
        getOrders()
    }, [])

    async function getOrders() {
        const orders = await orderService.query()
        setOrders(orders)
    }

    function handleDateClicked(date) {
        const filterOrders = orders.filter(order => order.date === date)
        setFilteredOrders(filterOrders)
        setShowOrders(true)
    }

    function setCare(type) {
        if(type === 'shaping') {
            return 'עיצוב גבות + שפם'
        }
        else if(type === 'lift') {
            return 'הרמת גבות'
        }
        else if(type === 'micro') {
            return 'מיקרובליינדינג'
        }
    }
    
    async function onCancelOrder(ownerId, order) {

        console.log(`ownerId: ${ownerId}, orderId: ${order._id}`)

        const user = await userService.getById(ownerId)
        console.log('user: ', user)

        const newOrders = await user.orders.filter((item) => (item.date !== order.date) && (item.start !== order.start))
        console.log('old orders: ' ,  user.orders)
        console.log("new orders: ", newOrders)

        user.orders = newOrders
        console.log('new user orders after change: ', user.orders)

        await userService.update(user)
        
        await orderService.remove(order._id)
        if(order.care === 'micro' || order.care === 'lift') {
            const index1 = times.indexOf(order.start)
            const index2 = times.indexOf(order.end)
            const occupiedHours = times.slice(index1, index2)
            
            for(let hour of occupiedHours) {
                await blockedOrdersService.removeHours({date: order.date, start: hour})
            }
        } else {
            await blockedOrdersService.removeHours({date: order.date, start: order.start})
        }
        
        await getOrders()
        showSuccessMsg('התור בוטל בהצלחה!')
    }

    function backBtn() {
        if(!showOrders) {
            navigate('/admin')
        }
        if(showOrders) {
            setShowOrders(false)
        }
    }

    return (
        <section className='admin-watch-orders'>

            <button className="back-btn" onClick={() => backBtn()}>{appointmentSvgs.backBtn}</button>

        {!showOrders && <div><h2>בחר יום להצגה</h2>
            
            <div className="this-month">
                <h4>{months[month]} {year}</h4>
                <table>
                    <thead>
                        <tr>
                            {daysOfWeek.map((day) => (
                                <th key={day}>
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((week, i) => (
                            <tr key={i}>
                                {week.map((date, j) => (
                                    <td key={j}>
                                        {(date && j !== 5 && j !== 6) ? <button className="date-btn" onClick={() => handleDateClicked(`${date.getDate()}.${month + 1}.${year}`, `weeks: ${i}, day: ${j}`)}>{date.getDate()}</button> : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>                                
            </div>

            <div className="next-month">
                <h4>{months[nextMonth.getMonth()]} {year}</h4>
                <table>
                    <thead>
                        <tr>
                            {daysOfWeek.map((day) => (
                                <th key={day}>
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {nextWeeks.map((week, i) => (
                            <tr key={i}>
                                {week.map((date, j) => (
                                    <td key={j}>
                                        {(date && j !== 5 && j !== 6) ? <button className="date-btn" onClick={() => handleDateClicked(`${date.getDate()}.${nextMonth.getMonth() + 1}.${year}`, `weeks: ${i}, day: ${j}`)}>{date.getDate()}</button> : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>                                
            </div></div>}
            {showOrders && <div className='orders-list'>
                <h2>תורים ליום {filteredOrders[0]?.date}</h2>

                <ul style={{direction: 'rtl', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: '1rem' , marginTop: '1rem', padding: 'none'}}>
                    {filteredOrders.map((order, i) => (
                        <li key={i} style={{border: '1px solid black', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                            <span>לקוח: <span style={{fontWeight: 'normal'}}>{order.owner.fullname}</span></span>
                            <span> סוג טיפול: <span style={{fontWeight: 'normal'}}>{setCare(order.care)}</span> </span>
                            <span> שעת התחלה: <span style={{fontWeight: 'normal'}}>{order.start}</span></span>
                            <span> שעת סיום: <span style={{fontWeight: 'normal'}}>{order.end}</span></span>
                            <button className='admin-cancel-btn' onClick={() => onCancelOrder(order.owner._id, order)}>ביטול התור</button>
                        </li>
                        
                    ))}  
                </ul>
            </div>}
        </section>
    )
}