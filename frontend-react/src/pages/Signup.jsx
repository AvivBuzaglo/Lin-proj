import { useState } from 'react'
import { useNavigate } from 'react-router'

import { signup } from '../store/actions/user.actions'

import { ImgUploader } from '../cmps/ImgUploader'
import { userService } from '../services/user'
import { showErrorMsg } from '../services/event-bus.service'

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', phoneNumber: '' })
    }

    function handleChange(ev) {
        const type = ev.target.type

        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username || !credentials.password || !credentials.fullname || !credentials.phoneNumber) return
        try{
            await signup(credentials)
            clearState()
            navigate('/')
        } catch (err) {
            showErrorMsg('הרשמה נכשלה, שם המשתמש תפוס, נסה שם אחר',err)
        }
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>
            <p className='singup-p'>
                שם מלא:
                <input
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Fullname"
                    onChange={handleChange}
                    required
                />
            </p>
            <p className='singup-p'>
                שם משתמש:
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
            />
            </p> 
            <p className='singup-p'>
                סיסמה:
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
            </p>
            <p className='singup-p'>
                טלפון:
                <input
                    type="text"
                    name="phoneNumber"
                    value={credentials.phoneNumber}
                    placeholder="Phone Number"
                    onChange={handleChange}
                    required
                />
            </p>
            {/* <ImgUploader onUploaded={onUploaded} /> */}
            <button className='signup-btn'>הרשמה</button>
        </form>
    )
}