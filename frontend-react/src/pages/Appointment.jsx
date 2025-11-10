import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { ChooseCare } from "../cmps/ChooseCare.jsx"
import { ChooseDate } from "../cmps/ChooseDate.jsx"
import { ChooseTime } from "../cmps/ChooseTime.jsx"
import { ConfirmOrder } from "../cmps/ConfirmOrder.jsx";
import { orderService } from "../services/order/order.service.remote.js" // for remote
import { blockedOrdersService } from "../services/order/blockedOrders.service.remote.js"
// import { orderService } from "../services/order/order.service.local.js" // for local
import { userService } from "../services/user";

export function Appointment() {
    const [order, setOrder] = useState({
        care: '',
        date: '',
        start: '',
        end: ''
    })
    const [showChooseCare, setShowChooseCare] = useState(true)
    const [showCalender, setShowCalender] = useState(false)
    const [ readyToSave, setReadyToSave] = useState(false)
    const [ orderConfirmed, setOrderConfirmed] = useState(false)
    const [blockedDates, setBlockedDates] = useState([])
    const loggedUser = userService.getLoggedinUser()
    const [ user, setUser ] = useState(null)
    const navigate = useNavigate()
    
    useEffect(() => {
        if(!loggedUser) navigate('/')
        setUser(loggedUser)
        
        async function getBlocked() {
            const result = await blockedOrdersService.queryDates()
            setBlockedDates(result) 
        }
        getBlocked()
    }, [])


    useEffect(() => {
        if(readyToSave && orderConfirmed) {
            
            (async () => {
                try {
                    const updatedUser = await saveToUser(order)
                    await new Promise(resolve => setTimeout(resolve, 3000))
                    navigate("/")
                } catch (err) {
                    console.error('Error saving order to user:', err);
                }
            })()
        }
    },[readyToSave, orderConfirmed])
    
    function orderHandler(order) {
        setOrder(order)
    }

    function careHandler() {
        setShowChooseCare(false)
        setShowCalender(true)
    }

    function calenderHandler() {
        setShowCalender(false)
    }

    // async function saveToUser(order) {
    //     orderService.save(order)
    //     await user.orders.push(order)
    //     await userService.update(user)
    // }

    async function saveToUser(order) {
        await orderService.save(order)

        const updatedUser = {
            ...user,
            orders: [...user.orders, order]
        }
        
        const res = await userService.update(updatedUser)
        // localStorage.setItem('loggedinUser', JSON.stringify(res))
        return res
    }

    function restartOrder() {
        setShowChooseCare(true)
        setShowCalender(false)
        setReadyToSave(false)
    }

    return (
        <div>
            {showChooseCare && <ChooseCare order={order} setOrder={orderHandler} careHandler={careHandler}/>}
            {!showChooseCare && showCalender && <ChooseDate order={order} setOrder={orderHandler} calenderHandler={calenderHandler} blockedDatesParent={blockedDates}/>}
            {!showChooseCare && !showCalender && !readyToSave && <ChooseTime order={order} setOrder={orderHandler} setReadyToSave={setReadyToSave}/>}
            {readyToSave && <ConfirmOrder order={order} setOrderConfirmed={setOrderConfirmed} restartOrder={restartOrder}/>}

            {readyToSave && orderConfirmed && (
                <div className="saved-msg-container">
                    !התור נקבע בהצלחה
                </div>
            )}
        </div>
    )
}