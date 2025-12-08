import { logout } from '../store/actions/user.actions'
import { useSelector } from 'react-redux'


export function UserLogout() {
    const user = useSelector(storeState => storeState.userModule.user)
    // const user = userService.getLoggedinUser()

    return (
        <section className="user-logout-container">
            <div className="user-logout-btn-container">
                <button className="logout-btn" onClick={() => logout()}>התנתקות</button>
            </div>

            <div className="user-logout-text-container">
                <h3>שלום, {user?.fullname}</h3>
                <span>טוב לראותך!</span>
            </div>
        </section>
    )
}