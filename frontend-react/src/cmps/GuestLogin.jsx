import { Link, NavLink } from 'react-router-dom'


export function GuestLogin() {

    return (
        <section className="guest-login-container">
            <div className="guest-login-btn-container">
                <NavLink to="login"><button className='guest-login-btn'>התחברות</button></NavLink>
            </div>
            <div className="guest-login-text-container">
                <h3>שלום, אורח</h3>
                <span> !טוב לראותך</span>
            </div>
        </section>
    )
}