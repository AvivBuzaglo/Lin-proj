import React from "react"
import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'


export function HamburgerMenu() {
    const user = useSelector(storeState => storeState.userModule.user) 
    const [open, setOpen] = useState(false)

    return (
        <nav className={`navbar ${open ? "open" : ""}`}>
            <div className={`hamburger ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`nav-links ${open ? "show" : ""}`}>
                <li><a href="/">דף בית</a></li>
                {user && user._id && <li><a href="/appointment">קביעת תור</a></li>}
                {user && user._id && <li><a href={`/user/${user._id}`}></a></li>}
                {!user && <li><a href="/login/signup">הרשמה</a></li>}
                {!user && <li><a href="/login">התחברות</a></li>}
                <li><a href="/contact">מידע נוסף</a></li>
            </ul>
        </nav>
    )
}

