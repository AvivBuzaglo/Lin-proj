import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { Appointment } from '../pages/Appointment.jsx'

export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()

	const goToAppointment = () => {
		navigate("appointment")
	}

	const goToUserDetails = () => {
		navigate(`user/${user._id}`)
	}
	
	const goToContact = () => {
		navigate("contact")
	}

	return (
		<footer className="app-footer full">
			{/* <p>Coffeerights &copy; 2024</p>
			<p>Count: {count}</p> */}

			<button className='user-info btn' onClick={goToUserDetails}>👤</button>
			<button className='main-footer btn' style={{backgroundImage: "url('imgs/Lin-Peretz-Logo.jpg')"}} onClick={goToAppointment}></button>
			<button className='contact btn' onClick={goToContact}>ℹ️</button>
            
            {/* {import.meta.env.VITE_LOCAL ? 
                <span className="local-services">Local Services</span> : 
                <span className="remote-services">Remote Services</span>} */}
		</footer>
	)
}