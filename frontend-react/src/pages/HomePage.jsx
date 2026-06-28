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
import { checkVersion } from "../services/versionCheck.service.js"

export function HomePage() {
    const user = useSelector(storeState => storeState.userModule.user)
    const [isOutdated, setIsOutdated] = useState(false) 
    const navigate = useNavigate()
    const [showPic, setShowPic] = useState(false)
    const [imgUrl, setImgUrl] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)

    // useEffect(() => {
    //     loadLoggedinUser().finally(() => setIsLoading(false))
    // },[])
    
    useEffect(() => {
        const init = async () => {
            try {
                await loadLoggedinUser()
                const isUpToDate = await checkVersion()
                if(!isUpToDate) setIsOutdated(true)
            } catch(err) {
                console.log('Error on init:', err)
            } finally {
                setIsLoading(false)
            }
        }
        init()
    },[]) 

	const goToAdminIndex = () => {
		navigate("admin")
	}
    
    function closeImg() {
        setShowPic(false)
        setImgUrl(undefined)
    }

if(isOutdated) return (
    <section className="update-container" style={{direction: 'rtl', textAlign: 'center', padding: '2rem'}}>
        <img src="/imgs/Lin-Peretz-Logo.jpg" alt="" />
        <h2>נדרש עדכון</h2>
        <p>גרסה חדשה של האפליקציה זמינה. יש לעדכן את האפליקציה כדי להמשיך.</p>
        <a href={Capacitor.getPlatform() === 'ios' 
            ? 'https://apps.apple.com/il/app/lin-bitton/id6757673216' 
            : 'https://play.google.com/store/apps/details?id=com.linbitton.app'}>
            <button>עדכן עכשיו</button>
        </a>
    </section>
)

    if(isLoading) return <div className="loading-container">
        <img src="/imgs/Lin-Peretz-Logo.jpg" alt="" />
    </div>

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

