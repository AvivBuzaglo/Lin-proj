import React, { useState, useEffect, useRef } from "react"
import { blockedOrdersService } from "../services/order/blockedOrders.service.remote.js"
import { generateCalender } from "../services/util.service.js"


export function EditAvailbleOrders({showBlockedHours, setShowAvailble, setDateForHourBlock}) {
    
    const [blockedDates, setBlockedDates] = useState([])
    // const [showBlockedHours, setShowBlockedHours] = useState(false)
    
        useEffect(() => {
        }, [blockedDates])
    
        useEffect(() => {
            async function getBlocked() {
                const result = await blockedOrdersService.queryDates()
                setBlockedDates(result)
            }
            getBlocked()
        }, [])

    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    const weeks = generateCalender(year, month)
    const nextWeeks = generateCalender(year, nextMonth.getMonth())
    const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']


    const handleDateClicked = (date) => {
        blockedOrdersService.postDate(date)
        setBlockedDates(prev => [...prev, date])
    }

    const handleBlockedClicked = (date) => {
        const updatedDates = blockedDates.filter(blockedDate => blockedDate !== date)
        setBlockedDates(updatedDates)
        const dateOBj = {
            date: date
        }
        blockedOrdersService.removeDate(dateOBj)
    }

    const handleDateSetClicked = (date) => {
        setDateForHourBlock(date)
        
        setShowAvailble(false)
    }

    return (
        
        <section className="edit-availble-container">
            <h2>בחר יום לחסימה</h2>
            
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
                                {!showBlockedHours && week.map((date, j) => (
                                    <td key={j}>
                                        {(date && !(blockedDates.includes(`${date.getDate()}.${month + 1}.${year}`)) && j !== 5 && j !== 6 ) ? <button className="date-btn" onClick={() => handleDateClicked(`${date.getDate()}.${month + 1}.${year}`)}>{date.getDate()}</button> : (date && j !== 5 && j !== 6 ) ? <button className="date-btn" style={{backgroundColor:"red"}} onClick={() => handleBlockedClicked(`${date.getDate()}.${month + 1}.${year}`)}>{date.getDate()}</button> : ''}
                                    </td>
                                ))}
                                {showBlockedHours && week.map((date, j) => (
                                    <td key={j}>
                                        {(date && !(blockedDates.includes(`${date.getDate()}.${month + 1}.${year}`)) && j !== 5 && j !== 6 ) ? <button className="date-btn" onClick={() => handleDateSetClicked(`${date.getDate()}.${month + 1}.${year}`)}>{date.getDate()}</button> : ''}
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
                                        {(date && !(blockedDates.includes(`${date.getDate()}.${nextMonth.getMonth() + 1}.${year}`)) && j !== 5 && j !== 6 ) ? <button className="date-btn" onClick={() => handleDateClicked(`${date.getDate()}.${nextMonth.getMonth() + 1}.${year}`)}>{date.getDate()}</button> : ''}
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