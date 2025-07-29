import React, { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { logout } from '../store/actions/user.actions'
import { WorkPreview } from "../cmps/WorkPreview"
import { GuestLogin } from "../cmps/GuestLogin"
import { NoticeBoard } from "../cmps/NoticeBoard"
import { ContactInfo } from "../cmps/ContactInfo"

export function HomePage() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    
    
    return (
        <section className="home-page-container">
            <div className="logo-container">
                <img src="/imgs/Lin-Peretz-Logo.jpg" alt="" />
            </div>
            {!user && <GuestLogin/>}
            <WorkPreview/>
            <NoticeBoard/>
            <ContactInfo/>
        </section >
    )
}

