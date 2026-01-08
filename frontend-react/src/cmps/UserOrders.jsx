import React from "react"
import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { homePageSvgs } from "./Svgs.jsx"

export function UserOrders() {
    const user = useSelector(storeState => storeState.userModule.user) 
    const hasOrders = Array.isArray(user?.orders) && user.orders.length > 0 

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
                    {/* {user && user.orders && user.orders.length > 0 &&  */}
                    {hasOrders && 
                        <ul className="user-closest-order">
                            <li><span>תאריך:</span>&nbsp;  {user.orders[0].date}</li>
                            <li><span>סוג טיפול:</span>&nbsp; {setCare(user.orders[0].care)}</li>
                            <li><span>שעת התחלה:</span>&nbsp;  {user.orders[0].start}</li>
                            <li><span>שעת סיום משוערת:</span>&nbsp;  {user.orders[0].end}</li>
                        </ul>
                    }
                    {user && !hasOrders && <div style={{"direction":"rtl"}}>לא קבעת תור, לקביעת תור לחץ על כפתור קביעת התור</div>}
                    {!user && <div style={{"direction":"rtl"}}>לקביעת תור יש להתחבר למשתמש.</div>}
                <button className="appointment-btn"><a href="/appointment">קביעת תור</a></button>
            </div>
        </section>
    )
}