import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { useNavigate } from 'react-router'
import { availableOrdersService } from '../services/order/availableOrder.service.local'
import { EditAvailbleOrders } from '../cmps/EditAvailbleOrders'

export function AdminIndex() {
    
    const [showAvailble, setShowAvailble] = useState(false)

    const navigate = useNavigate()
	const user = useSelector(storeState => storeState.userModule.user)
	const users = useSelector(storeState => storeState.userModule.users)
	const isLoading = useSelector(storeState => storeState.userModule.isLoading)

	useEffect(() => {
        if(!user.isAdmin) navigate('/')
		loadUsers()
	}, [])

    const handleAvailableClicked = () => {
        if(showAvailble) {
            setShowAvailble(false)
        }
        else if(!showAvailble) {
            setShowAvailble(true)
        }
    }

	return (
        <section className="admin">
            {isLoading && 'Loading...'}
            
            <div className='availble-orders-container'>
                <button className='availble-btn' onClick={() => handleAvailableClicked()}>{showAvailble ? 'סגירת תורים זמינים' : 'פתיחת תורים זמינים'}</button>
            </div>

            {showAvailble && <EditAvailbleOrders/>}

            {users && !showAvailble && (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <pre>{JSON.stringify(user, null, 2)}</pre>
                            <button onClick={() => removeUser(user._id)}>
                                Remove {user.username}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    ) 
}
