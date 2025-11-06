import React, { useState, useEffect } from "react"
import { generateCalender } from "../services/util.service.js"
import { blockedOrdersService } from "../services/order/blockedOrders.service.remote.js"

export function ChooseDate({order, setOrder, year = new Date().getFullYear(), month = new Date().getMonth(), calenderHandler}) {

    const [orderToEdit, setOrderToEdit] = useState({...order})
    const [blockedDates, setBlockedDates] = useState([])
    
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    const weeks = generateCalender(year, month)
    const nextWeeks = generateCalender(year, nextMonth.getMonth())
    const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
    

    useEffect(() => {
        setOrder(orderToEdit)
    }, [orderToEdit])

    useEffect(() => {
        async function getBlocked() {
            const result = await blockedOrdersService.queryDates()
            setBlockedDates(result)
        }
        getBlocked()
    }, [])

    const handleDateClicked = (date, idx) => {
        setOrderToEdit({
            care: orderToEdit.care,
            date: date,
            start: '',
            end: ''
        })
        
        setTimeout(() => {
           calenderHandler() 
        }, 10)      
    }

    return (
        
        <section className="choose-date-container">
            <h2>בחר יום</h2>
            
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
                                        {(date && !(blockedDates.includes(`${date.getDate()}.${month + 1}.${year}`)) && j !== 5 && j !== 6 && (date.getDate() !== today.getDate())) ? <button className="date-btn" onClick={() => handleDateClicked(`${date.getDate()}.${month + 1}.${year}`, `weeks: ${i}, day: ${j}`)}>{date.getDate()}</button> : ''}
                                        {/* {(date && !(blockedDates.includes(`${date.getDate()}.${month + 1}.${year}`)) && j !== 5 && j !== 6) ? <button className="date-btn" onClick={() => handleDateClicked(`${date.getDate()}.${month + 1}.${year}`, `weeks: ${i}, day: ${j}`)}>{date.getDate()}</button> : ''} */}
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
                                        {(date && !(blockedDates.includes(`${date.getDate()}.${nextMonth.getMonth() + 1}.${year}`)) && j !== 5 && j !== 6 && (date.getDate() !== today.getDate())) ? <button className="date-btn" onClick={() => handleDateClicked(`${date.getDate()}.${nextMonth.getMonth() + 1}.${year}`, `weeks: ${i}, day: ${j}`)}>{date.getDate()}</button> : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>                                
            </div>
        </section>

    )
}
