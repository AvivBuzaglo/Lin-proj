import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { generateCalender } from "../services/util.service.js"
import { orderService } from '../services/order/order.service.remote.js'

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

    return (
        <section className='admin-watch-orders'>
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
                        </li>
                        
                    ))}  
                </ul>
            </div>}
        </section>
    )
}