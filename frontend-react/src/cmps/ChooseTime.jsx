import React, { useState, useEffect } from "react"
// import { orderService } from "../services/order/order.service.local.js"
import { orderService } from "../services/order/order.service.remote.js"
import { blockedOrdersService } from "../services/order/blockedOrders.service.remote.js"

export function ChooseTime({order, setOrder, setReadyToSave}) {
    const [orderToEdit, setOrderToEdit] = useState({...order})
    const [blockedHours, setBlockedHours] = useState([])

    const times1 = ['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00'] 
    const times2 = ['11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20']
    const times3 = ['13:40', '14:00', '14:20', '14:40', '15:00']
    const times4 = ['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20', '14:40', '15:00', '15:10', '15:30', '15:50', '16:10', '16:30']

        useEffect(() => {
            setOrder(orderToEdit) 
        }, [orderToEdit])


        useEffect(() => {
            async function getBlocked() {
                const result = await blockedOrdersService.queryHours()
                result.forEach(element => {
                    element.date === orderToEdit.date ? setBlockedHours(element.hours) : setBlockedHours([])
                })
            }
            getBlocked()

            async function checkOrdered() {
                // const result = await orderService.query()
                const result = await orderService.query({date: orderToEdit.date})
                result.forEach(element => {
                    element.date === orderToEdit.date ? setBlockedHours(prev => [...prev, element.start]) : ''
                })
            }
            checkOrdered()

            async function getHoursBetween() {
                const result = await orderService.query({date: orderToEdit.date})
                let isMicro

                result.forEach(element => {
                    if(element.date === orderToEdit.date) {
                        element.care === 'micro' ? isMicro = true : isMicro = false
                        
                        if(isMicro) {
                            const index1 = times4.indexOf(element.start)
                            const index2 = times4.indexOf(element.end)
                            const occupiedHours = times4.slice(index1 + 1, index2)
                            
                            setBlockedHours(prev => [...prev, ...occupiedHours])
                        }
                        
                    }

                })
            }
            getHoursBetween()

            async function checkCare() {
                const care = orderToEdit.care
                const result = await blockedOrdersService.queryHours()
                let blocked 
                result.forEach(element => {
                    element.date === orderToEdit.date ? blocked = element.hours : blocked = []
                })

                if(care === 'micro') {
                    blocked.map(item => {
                        const idx = times4.indexOf(item)

                        if(idx === -1) return

                        setBlockedHours(prev => [...prev, ...times4.slice(Math.max(0, idx - 4), idx)])
                    })
                }
                if(care === 'lift') {
                    blocked.map(item => {
                        const idx = times4.indexOf(item)

                        if(idx === -1) return

                        setBlockedHours(prev => [...prev, ...times4.slice(Math.max(0, idx - 1), idx)])
                    })
                }
                
            }
            checkCare()
        }, [])           

    const handleTimeClicked = (time) => {
        let endTime = setEndTime(time)
        setOrderToEdit({
            care: orderToEdit.care,
            date: orderToEdit.date,
            start: time,
            end: endTime
        })
        setTimeout(() => {
           setReadyToSave(true)
        }, 10)      
    }

    function setEndTime(time) {
        let endTime = ''
        let timeIdx = times4.indexOf(time)

        if(orderToEdit.care === 'shaping') {
            if(time === '15:00') endTime = '15:20'
            else endTime = times4[timeIdx + 1]
        }
        if(orderToEdit.care === 'lift') {
            if(time === '15:00') endTime = '15:40'
            else if(time === '14:40') endTime = '15:20'
            else endTime = times4[timeIdx + 2]
        }
        if(orderToEdit.care === 'micro') {
            if(time === '15:00') endTime = '16:30'
            else if(time === '14:40') endTime = '16:10'
            else if(time === '14:20') endTime = '15:50'
            else if(time === '14:00') endTime = '15:30'
            else if(time === '13:40') endTime = '15:10'
            else endTime = times4[timeIdx + 5]
        }
        return endTime
    }

        function translateCare() {
        if(order.care === 'shaping') {
            return 'עיצוב גבות + שפם'
        }
        if(order.care === 'lift') {
            return 'הרמת גבות'
        }
        if(order.care === 'micro') {
            return 'מיקרובליינדינג'
        }
    }

    return (
        <section className="choose-time-container">
            <h2>בחר שעה</h2>
            
            <h4>הטיפול שנבחר:&nbsp;{translateCare()}</h4>
            <h4>התאריך שנבחר:&nbsp;{order.date}</h4>


            <div className="choose-time">
                {/* <table>
                    <tbody>
                        <tr>
                            {times1.map((time) => (
                                <td key={time}>
                                   { !(blockedHours.includes(time)) ? <button className="time-btn" onClick={() => handleTimeClicked(time)}>{time}</button> : ''}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            {times2.map((time) => (
                                <td key={time}>
                                    { !(blockedHours.includes(time)) ? <button className="time-btn" onClick={() => handleTimeClicked(time)}>{time}</button> : ''}
                                </td>
                            ))}                                
                        </tr>
                        <tr>
                            {times3.map((time) => (
                                <td key={time}>
                                    { !(blockedHours.includes(time)) ? <button className="time-btn" onClick={() => handleTimeClicked(time)}>{time}</button> : ''}
                                </td>
                            ))}                                
                        </tr>                            
                    </tbody>
                </table> */}
                {/* <div className="times">
                    {times1.map((time) => (
                        <span key={time}>
                           { !(blockedHours.includes(time)) ? <button className="times-btn" onClick={() => handleTimeClicked(time)}>{time}</button> : ''}
                        </span>
                    ))}
                    {times2.map((time) => (
                        <span key={time}>
                            { !(blockedHours.includes(time)) ? <button className="times-btn" onClick={() => handleTimeClicked(time)}>{time}</button> : ''}
                        </span>
                    ))}                                
                    {times3.map((time) => (
                        <span key={time}>
                            { !(blockedHours.includes(time)) ? <button className="times-btn" onClick={() => handleTimeClicked(time)}>{time}</button> : ''}
                        </span>
                    ))}
                </div>                                 */}
                <div className="times">
                    {[...times1, ...times2, ...times3].map((time) =>
                        !blockedHours.includes(time) && (
                            <button key={time} className="times-btn" onClick={() => handleTimeClicked(time)}>
                                {time}
                            </button>
                        )
                    )}
                </div>
            </div>
        </section>
    )
}