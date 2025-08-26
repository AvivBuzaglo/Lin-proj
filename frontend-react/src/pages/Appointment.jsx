import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { ChooseCare } from "../cmps/ChooseCare.jsx"
import { ChooseDate } from "../cmps/ChooseDate.jsx"
import { ChooseTime } from "../cmps/ChooseTime.jsx"
import { ConfirmOrder } from "../cmps/ConfirmOrder.jsx";
import { orderService } from "../services/order/order.service.local.js"
import { userService } from "../services/user/user.service.local.js";

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
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    
    
    useEffect(() => {
        console.log(order);
    }, [order])

    useEffect(() => {
        if(readyToSave && orderConfirmed) {
            orderService.save(order)
            user.orders.push(order)
            userService.update(user)

            setTimeout(() => {
                navigate("/")
            }, 3000) 
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

    function restartOrder() {
        setShowChooseCare(true)
        setShowCalender(false)
        setReadyToSave(false)
    }

    return (
        <div>
            {showChooseCare && <ChooseCare order={order} setOrder={orderHandler} careHandler={careHandler}/>}
            {!showChooseCare && showCalender && <ChooseDate order={order} setOrder={orderHandler} calenderHandler={calenderHandler} />}
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