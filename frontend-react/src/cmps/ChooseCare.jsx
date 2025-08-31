import React, { useState, useEffect } from "react"
import { orderService } from "../services/order/order.service.local"

export function ChooseCare({ order, setOrder, careHandler}) {

    const [orderToEdit, setOrderToEdit] = useState({...order})

    useEffect(() => {
        setOrder(orderToEdit)
    }, [orderToEdit])

    const handleCareClicked = (type) => {
        setOrderToEdit({
            care: type,
            date: '',
            start: '',
            end: ''
        })
        setTimeout(() => {
            careHandler()
        }, 10)      
    }

    return (
        <section className="choose-care-container">
            <h2> בחר טיפול</h2>

            <div className="choose-btns">
                <div className="care-btn-price">
                    <span className="price">70₪</span>
                    <button className="care-btn" onClick={() => handleCareClicked('shaping')}>עיצוב גבות + שפם</button>
                </div>
                <div className="care-btn-price">
                    <span className="price">170₪</span>
                    <button className="care-btn" onClick={() => handleCareClicked('lift')}>הרמת גבות</button>
                </div>
                <div className="care-btn-price">
                    <span className="price">600₪</span>
                    <button className="care-btn" onClick={() => handleCareClicked('micro')}>מיקרובליינדינג</button>
                </div>
            </div>
        </section>        

    )
}