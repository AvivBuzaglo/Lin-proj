import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { useNavigate } from 'react-router'
import { availableOrdersService } from '../services/order/availableOrder.service.local'
import { EditAvailbleOrders } from '../cmps/EditAvailbleOrders'
import { BlockHours } from '../cmps/BlockHours'

export function AdminIndex() {
    
    const [showAvailble, setShowAvailble] = useState(false)
    const [showBlockedHours, setShowBlockedHours] = useState(false)
    const [dateForHourBlock, setDateForHourBlock] = useState(undefined)

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

    const handleBlockedClicked = () => {
        if(showBlockedHours) {
            setShowBlockedHours(false)
            setShowAvailble(false)
        }
        else if(!showBlockedHours) {
            setShowBlockedHours(true)
            setShowAvailble(true)
        }
    }    

	return (
        <section className="admin">
            {isLoading && 'Loading...'}
            
            <div className='availble-orders-container'>
                <button className='availble-btn' onClick={() => handleAvailableClicked()}>{showAvailble ? 'X' : 'פתיחת תורים זמינים'}</button>
            </div>
            <div className='blocked-hours-container'>
                <button className='blocked-btn' onClick={() => handleBlockedClicked()}>{showBlockedHours ? 'X' : 'חסימת שעות'}</button>
            </div>            

            {showAvailble && <EditAvailbleOrders showBlockedHours={showBlockedHours} setShowAvailble={setShowAvailble} setDateForHourBlock={setDateForHourBlock}/>}
            {showBlockedHours && !showAvailble && <BlockHours date={dateForHourBlock} setShowBlockedHours={setShowBlockedHours}/>}

            {users && !showAvailble && !showBlockedHours && (
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
