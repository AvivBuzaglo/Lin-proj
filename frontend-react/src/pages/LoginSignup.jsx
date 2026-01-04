import { Outlet } from 'react-router'
import { NavLink } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { appointmentSvgs } from '../cmps/Svgs.jsx'

export function LoginSignup() {
    const navigate = useNavigate()

    async function backBtn() {
        navigate("/")
    }

    return (
        <div className="login-page">
            <button className="back-btn" onClick={() => backBtn()}>{appointmentSvgs.backBtn}</button>
            <nav>
                <NavLink to=".">התחברות</NavLink>
                <NavLink to="signup">הרשמה</NavLink>
            </nav>
            <Outlet/>
        </div>
    )
}