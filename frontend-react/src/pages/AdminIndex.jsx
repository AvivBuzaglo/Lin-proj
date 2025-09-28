import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { useNavigate } from 'react-router'
import { availableOrdersService } from '../services/order/availableOrder.service.local'
import { EditAvailbleOrders } from '../cmps/EditAvailbleOrders'
import { BlockHours } from '../cmps/BlockHours'
import { orderService } from '../services/order/order.service.remote.js'

export function AdminIndex() {
    
    const [showAvailble, setShowAvailble] = useState(false)
    const [showBlockedHours, setShowBlockedHours] = useState(false)
    const [dateForHourBlock, setDateForHourBlock] = useState(undefined)
    const [menageUsers, setMenageUsers] = useState(false)
    const [orders, setOrders] = useState([])

    const navigate = useNavigate()
	const user = useSelector(storeState => storeState.userModule.user)
	const users = useSelector(storeState => storeState.userModule.users)
	const isLoading = useSelector(storeState => storeState.userModule.isLoading)

	useEffect(() => {
        if(!user.isAdmin) navigate('/')
		loadUsers()
        // setOrders(orderService.query())
	}, [])

    const handleCmpClicked = (cmp) => {
        if(cmp === 'blockDate') {
            if(!showAvailble) {
                setShowAvailble(true)
                setShowBlockedHours(false)
                setMenageUsers(false)
                return
            }
            if(showAvailble) {
                setShowAvailble(false)
                setShowBlockedHours(false)
                setMenageUsers(false)
                return
            }
        }
        if(cmp === 'blockHours') {
            if(!showBlockedHours) {
                setShowBlockedHours(true)
                setShowAvailble(true)
                setMenageUsers(false)
                return
            }
            if(showBlockedHours) {
                setShowBlockedHours(false)
                setShowAvailble(false)
                setMenageUsers(false)
                return
            }
        }
        if(cmp === 'menageUsers') {
            if(!menageUsers) {
                setMenageUsers(true)
                setShowAvailble(false)
                setShowBlockedHours(false)
                return
            }
            if(menageUsers) {
                setMenageUsers(false)
                setShowAvailble(false)
                setShowBlockedHours(false)
                return
            }
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

    function getOrders() {
        orderService.query()
            .then(fetchedOrders => {
                setOrders(fetchedOrders)
            })
            .catch(err => {
                console.log('Error fetching orders', err)
            })
    }

	return (
        <section className="admin">
            {isLoading && 'Loading...'}

            {(showAvailble || showBlockedHours || menageUsers) &&<div className='admin-close-btn'>
                <button className='close-btn' onClick={() => {
                    setShowAvailble(false)
                    setShowBlockedHours(false)
                    setMenageUsers(false)
                }}>X</button>
            </div>}
            
            {(!showAvailble && !showBlockedHours && !menageUsers) &&
            <div className='admin-btns-container'>
                <div className='availble-orders-container'>
                    <button className='availble-btn' onClick={() => handleCmpClicked('blockDate')}>{showAvailble ? 'X' : 'חסימת תאריך'}</button>
                </div>
                <div className='blocked-hours-container'>
                    <button className='blocked-btn' onClick={() => handleCmpClicked('blockHours')}>{showBlockedHours ? 'X' : 'חסימת שעות'}</button>
                </div>
                <div className='menage-users-container'>
                    <button className='menage-btn' onClick={() => handleCmpClicked('menageUsers')}>{menageUsers ? 'X' : 'ניהול משתמשים'}</button>
                </div>
                <div>
                    <button onClick={() => getOrders()}>orders</button>
                </div>
            </div>}            

            {showAvailble && <EditAvailbleOrders showBlockedHours={showBlockedHours} setShowAvailble={setShowAvailble} setDateForHourBlock={setDateForHourBlock}/>}
            {showBlockedHours && !showAvailble && <BlockHours date={dateForHourBlock} setShowBlockedHours={setShowBlockedHours}/>}

            {users && !showAvailble && !showBlockedHours && menageUsers && (
                <ul className='users-list'>
                    {users.map(user => (
                        <li key={user._id}>
                            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                            <p><span>שם מלא:</span> {user.fullname}</p>
                            <p><span>שם משתמש:</span> {user.username}</p>
                            <p><span>פלאפון:</span> {user.phoneNumber}</p>
                            <p><span>אדמין:</span> {(user.isAdmin) ? 'כן' : "לא"}</p>
                            <button className='remove-user-btn' onClick={() => removeUser(user._id)}>
                                Remove {user.username}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    ) 
}
