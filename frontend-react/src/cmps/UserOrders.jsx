import React from "react"
import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { homePageSvgs } from "./Svgs.jsx"

export function UserOrders() {
    const user = useSelector(storeState => storeState.userModule.user) 
    const hasOrders = Array.isArray(user?.orders) && user.orders.length > 0 
    
    const filteredOrders = hasOrders ?
        user.orders.filter(order => {
            const [day, month, year] = order.date.split(".").map(Number)
            const orderDate = new Date(year, month - 1, day)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            return orderDate >= today
        }) : []


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
        <section className="user-orders-container">
            <h3>תורים &nbsp;{homePageSvgs.appointment}</h3>
            <div className="user-orders">
                 <h4>תור קרוב: </h4>
                    {hasOrders && 
                        <ul className="user-closest-order">
                            <li><span>תאריך:</span>&nbsp; {filteredOrders[0].date}</li>
                            <li><span>סוג טיפול:</span>&nbsp; {filteredOrders[0].care}</li>
                            <li><span>שעת התחלה:</span>&nbsp; {filteredOrders[0].start}</li>
                            <li><span>שעת סיום:</span>&nbsp; {filteredOrders[0].end}</li>
                        </ul>
                    }
                    {user && !hasOrders && <div style={{"direction":"rtl"}}>לא קבעת תור, לקביעת תור לחץ על כפתור קביעת התור</div>}
                    {!user && <div style={{"direction":"rtl"}}>לקביעת תור יש להתחבר למשתמש.</div>}
                    {hasOrders &&
                        <div className="btn-div">
                            <button className="appointment-btn"><a href={`/user/${user._id}`}>ביטול תור</a></button>   
                            <button className="appointment-btn"><a href="/appointment">קביעת תור</a></button>
                        </div>
                    }
                    {user && !hasOrders &&
                        <button className="appointment-btn"><a href="/appointment">קביעת תור</a></button>
                    }
            </div>
        </section>
    )
}