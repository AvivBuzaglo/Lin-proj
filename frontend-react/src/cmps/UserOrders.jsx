import React from "react"
import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { homePageSvgs } from "./Svgs.jsx"

export function UserOrders() {
    const user = useSelector(storeState => storeState.userModule.user) 
    
    return (
        <section className="user-orders-container">
            <h3>תורים &nbsp;{homePageSvgs.appointment}</h3>
            <div className="user-orders">
                 <h4>תור קרוב: </h4>
                    {user && user.orders && user.orders.length > 0 && 
                        <ul className="user-closest-order">
                            <li><span>תאריך:</span>&nbsp;  {user.orders[0].date}</li>
                            <li><span>סוג טיפול:</span>&nbsp; {user.orders[0].care}</li>
                            <li><span>שעת התחלה:</span>&nbsp;  {user.orders[0].start}</li>
                            <li><span>שעת סיום משוערת:</span>&nbsp;  {user.orders[0].end}</li>
                        </ul>
                    }
                    {user && user.orders && user.orders.length <= 0 && <div style={{"direction":"rtl"}}>לא קבעת תור, לקביעת תור לחץ על כפתור קביעת התור</div>}
                    {!user && <div style={{"direction":"rtl"}}>לקביעת תור יש להתחבר למשתמש.</div>}
                <button className="appointment-btn"><a href="/appointment">קביעת תור</a></button>
            </div>
        </section>
    )
}