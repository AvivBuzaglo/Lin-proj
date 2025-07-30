import React, { useState, useEffect, useRef } from "react"

export function ConfirmOrder({order, setOrderConfirmed, restartOrder}) {
    const care = setCare(order.care)
    
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
               <p className="confirm-btn-container"><button className="confirm-btn" onClick={() => setOrderConfirmed(true)}>אשר הזמנה</button> <button className="confirm-btn" onClick={() => restartOrder()}>להתחיל מחדש</button></p>
            </div>
             
        </section>
    )
}