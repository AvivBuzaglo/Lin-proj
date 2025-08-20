import React, { useState, useEffect, useRef } from "react"
import { availableOrdersService } from '../services/order/availableOrder.service.local'

export function BlockHours({date, setShowBlockedHours}) {
    const [blockedHours, setBlockedHours] = useState([])
    const [todayBlocked, setTodayBlocked] = useState(null)

    const times1 = ['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00'] 
    const times2 = ['11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20']
    const times3 = ['13:40', '14:00', '14:20', '14:40', '15:00']
    const times4 =['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20', '14:40', '15:00']

    useEffect(() => {
        async function getBlocked() {
            const result = await availableOrdersService.queryHours()
            setBlockedHours(result)
        }
        getBlocked()
    }, [])    
    
    useEffect(() => {
        todaysBlockedHours()
    }, [blockedHours])

    function checkDate() {
        if(blockedHours.length) {
            for(let i = 0; i < blockedHours.length; i++) {
                if(blockedHours[i].date === date) {
                    return i
                }
                else continue
            }
            return null
        }
        else return null
    }

    function todaysBlockedHours() {
        let dateIdx = checkDate()
        
        if(dateIdx === null) return 
        else {
            const blocked = blockedHours[dateIdx].hours
            setTodayBlocked(blocked)
        }
    }

    const handleTimeClicked = (time) => {
        let dateIdx = checkDate()

        if(dateIdx === null) {
            let blockObj = {
                date: date,
                hours: [time]
            }
            availableOrdersService.blockedHoursPost(blockObj)
            setBlockedHours(prev => [...prev, blockObj])
        }
        else{
            let prevObj = blockedHours[dateIdx]
            let updatedhours = [...prevObj.hours, time]
            let updatedObj = {
                date: date,
                hours: updatedhours
            }            
            availableOrdersService.putHours(updatedObj)
            async function getUpdatedBlocked() {
                setBlockedHours(prev => {
                    const newState = [...prev]
                    newState[dateIdx] = {
                        ...newState[dateIdx],
                        hours: [...newState[dateIdx].hours, time]
                    }
                    return newState;
                }) 
            }
            getUpdatedBlocked()
        }
      
    }    

    return (
        <section className="choose-time-container">
            <h2>בחר שעה לחסימה</h2>
            
            <div className="choose-time">
                <table>
                    <tbody>
                        <tr>
                            {times1.map((time) => (
                                <td key={time}>
                                    {!(todayBlocked.includes(time)) ? <button className="time-btn" onClick={() => handleTimeClicked(time)}>{time}</button> : <button className="occupied-btn">{time}</button>}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            {times2.map((time) => (
                                <td key={time}>
                                    {!(todayBlocked.includes(time)) ? <button className="time-btn" onClick={() => handleTimeClicked(time)}>{time}</button> : <button className="occupied-btn">{time}</button>}
                                </td>
                            ))}                                
                        </tr>
                        <tr>
                            {times3.map((time) => (
                                <td key={time}>
                                    {!(todayBlocked.includes(time)) ? <button className="time-btn" onClick={() => handleTimeClicked(time)}>{time}</button> : <button className="occupied-btn">{time}</button>}
                                </td>
                            ))}                                
                        </tr>                            
                    </tbody>
                </table>
            </div>
        </section>
    )
}