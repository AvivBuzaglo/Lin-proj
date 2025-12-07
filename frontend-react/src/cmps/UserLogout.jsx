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
                <span> !טוב לראותך</span>
                {user.orders && user.orders.length > 0 &&
                    <div className="user-closest-order">תור קרוב: <br /> {user.orders[0].date} בשעה: {user.orders[0].start} </div>
                }
            </div>
        </section>
    )
}