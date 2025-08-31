import { Outlet } from 'react-router'
import { NavLink } from 'react-router-dom'

export function LoginSignup() {
    return (
        <div className="login-page">
            <nav>
                <NavLink to=".">התחברות</NavLink>
                <NavLink to="signup">הרשמה</NavLink>
            </nav>
            <Outlet/>
        </div>
    )
}