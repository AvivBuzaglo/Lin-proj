import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { ChooseCare } from "../cmps/ChooseCare.jsx"
import { ChooseDate } from "../cmps/ChooseDate.jsx"
import { ChooseTime } from "../cmps/ChooseTime.jsx"
import { orderService } from "../services/order/order.service.local.js"

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
    const navigate = useNavigate()
    
    
    useEffect(() => {
        console.log(order);
    }, [order])

    useEffect(() => {
        if(readyToSave) {
            orderService.save(order)

            setTimeout(() => {
                navigate("/")
            }, 3000) 
        }
    },[readyToSave])
    
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

    return (
        <div>
            {showChooseCare && <ChooseCare order={order} setOrder={orderHandler} careHandler={careHandler}/>}
            {!showChooseCare && showCalender && <ChooseDate order={order} setOrder={orderHandler} calenderHandler={calenderHandler}/>}
            {!showChooseCare && !showCalender && <ChooseTime order={order} setOrder={orderHandler} setReadyToSave={setReadyToSave}/>}

            {readyToSave && (
                <div className="saved-msg-container">
                    !התור נקבע בהצלחה
                </div>
            )}
        </div>
    )
}