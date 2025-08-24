import React, { useState, useEffect, useRef } from "react"
import { availableOrdersService } from '../services/order/availableOrder.service.local'

export function ConfirmOrder({order, setOrderConfirmed, restartOrder}) {
    const [ blockedHours, setBlockedHours ] = useState([])
    const times4 = ['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20', '14:40', '15:00', '15:10', '15:30', '15:50', '16:10', '16:30']
    const care = setCare(order.care)
    
    useEffect(() => {
        async function getBlocked() {
            const result = await availableOrdersService.queryHours()
            setBlockedHours(result)
        }
        getBlocked()
    }, [])

    function checkDate() {
        if(blockedHours.length) {
            for(let i = 0; i < blockedHours.length; i++) {
                if(blockedHours[i].date === order.date) {
                    return i
                }
                else continue
            }
            return null
        }
        else return null
    }

    function updateStorage() {
        let dateIdx = checkDate()
        console.log(dateIdx);
        
        if(dateIdx === null && order.care !== 'micro' && order.care !== 'lift') {
            let blockObj = {
                date: order.date,
                hours: [order.start]
            }
            availableOrdersService.blockedHoursPost(blockObj)
        }
        else if(dateIdx === null && (order.care === 'micro' || order.care === 'lift')) {
            const index1 = times4.indexOf(order.start)
            const index2 = times4.indexOf(order.end)
            const occupiedHours = times4.slice(index1, index2)
            
            let blockObj = {
                date: order.date,
                hours: occupiedHours
            }
            availableOrdersService.blockedHoursPost(blockObj)
        }
        else if(dateIdx !== null && order.care !== 'micro' && order.care !== 'lift') {
            let prevObj = blockedHours[dateIdx]
            let updatedhours = [...prevObj.hours, order.start]
            let updatedObj = {
                date: prevObj.date,
                hours: updatedhours
            }            
            availableOrdersService.putHours(updatedObj)
        }
        else if(dateIdx !== null && (order.care === 'micro' || order.care === 'lift')) {
            const index1 = times4.indexOf(order.start)
            const index2 = times4.indexOf(order.end)
            const occupiedHours = times4.slice(index1, index2)
            let prevObj = blockedHours[dateIdx]
            let updatedhours = [...prevObj.hours, ...occupiedHours]
            let updatedObj = {
                date: prevObj.date,
                hours: updatedhours
            }            
            availableOrdersService.putHours(updatedObj)
        }
    }

    function handleConfirmedClick() {
        setOrderConfirmed(true)
        updateStorage()
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
        <section className="confirm-order-container">
            <h2>אישור הזמנה</h2>

            <div className="order-details">
               <p><span>סוג הטיפול:</span> {care}</p>
               <p><span>תאריך הטיפול:</span> {order.date}</p>
               <p><span>שעת הטיפול:</span> {order.start}-{order.end}</p>
               <p className="confirm-btn-container"><button className="confirm-btn" onClick={() => handleConfirmedClick()}>אשר הזמנה</button> <button className="confirm-btn" onClick={() => restartOrder()}>להתחיל מחדש</button></p>
            </div>
             
        </section>
    )
}