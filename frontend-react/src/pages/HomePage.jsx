import React, { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { logout } from '../store/actions/user.actions'
import { WorkPreview } from "../cmps/WorkPreview"
import { GuestLogin } from "../cmps/GuestLogin"
import { NoticeBoard } from "../cmps/NoticeBoard"
import { ContactInfo } from "../cmps/ContactInfo"
import { UserLogout } from "../cmps/UserLogout"
import { userService } from "../services/user/user.service.remote.js"
import { homePageSvgs } from "../cmps/Svgs"
import { loadLoggedinUser } from "../store/actions/user.actions"
import { UserOrders } from "../cmps/UserOrders.jsx" 

export function HomePage() {
    const user = useSelector(storeState => storeState.userModule.user) 
    const navigate = useNavigate()
    const [showPic, setShowPic] = useState(false)
    const [imgUrl, setImgUrl] = useState(undefined)

    useEffect(() => {
        loadLoggedinUser()
    },[])    

	const goToAdminIndex = () => {
		navigate("admin")
	}
    
    function closeImg() {
        setShowPic(false)
        setImgUrl(undefined)
    }

    return (
        <section className="home-page-container">
            <div className="logo-container">
                {!user && <GuestLogin/>}
                {user && <UserLogout/>}
                {user && user.isAdmin && 
                <button className="admin-btn" onClick={goToAdminIndex}>דף אדמין</button>
            }
                <img src="/imgs/Lin-Peretz-Logo.jpg" alt="" />
            </div>

            <UserOrders/>

            <WorkPreview setShowPic={setShowPic} setImgUrl={setImgUrl}/>
            <NoticeBoard/>
            <ContactInfo/>

            {showPic && (
                <section onClick={() => closeImg()} className="background-container">
                    <div className="show-img-container">
                        <img src={imgUrl} alt="" />
                    </div>
                </section>
            )}
            <div className="contact-links">
                <span>ליצירת קשר</span> 
                <div className="contact-icons">
                    <a href="https://www.instagram.com/lin__eyebrows?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">{homePageSvgs.instagramLogo}</a>
                    <a href="https://wa.me/972544692777" target="_blank" rel="noopener noreferrer">{homePageSvgs.whatsappLogo}</a>
                    <a href="https://www.facebook.com/share/16ufNJDxXc/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">{homePageSvgs.facebookLogo}</a>
                </div>
            </div>
        </section >
    )
}

