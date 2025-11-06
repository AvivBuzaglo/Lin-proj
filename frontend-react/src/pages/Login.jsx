import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { userService } from '../services/user'
import { login } from '../store/actions/user.actions'
import { showErrorMsg } from '../services/event-bus.service'

export function Login() {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })

    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        console.log(credentials);
        
    }, [credentials])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username) return
        if (!credentials.password) return
        try{
            await login(credentials)
            navigate('/')
        } catch (err) {
            showErrorMsg('Cannot login',err)
        }
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    return (
        <form className="login-form" onSubmit={onLogin}>
            {/* <select
                name="username"
                value={credentials.username}
                onChange={handleChange}>
                    <option value="">Select User</option>
                    {users.map(user => <option key={user._id} value={user.username}>{user.fullname}</option>)}
            </select> */}
            <div className='username-div'>
                שם משתמש: 
                <input 
                    type="text"
                    name='username'
                    value={credentials.username}
                    className='username-input'
                    onChange={handleChange}
                    required 
                />
            </div>
            <div className='password-div'>
                סיסמא:
                <input 
                    type="text"
                    name='password'
                    value={credentials.password}
                    className='password-input'
                    onChange={handleChange}
                    required 
                />
            </div>
            <button className='login-btn'>התחבר</button>
        </form>
    )
}