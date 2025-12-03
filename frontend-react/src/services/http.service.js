import Axios from 'axios'
import { Capacitor } from '@capacitor/core'
// const BASE_URL = process.env.NODE_ENV === 'production'
//     ? '/api/'
//     : '//localhost:3030/api/'
// const isMobile = typeof window !== 'undefined' && window?.capacitor?.isNativePlatform()
// const isMobile = Capacitor.isNativePlatform()

// const isMobile = typeof window !== 'undefined' && !!window.Capacitor //27.11

// const BASE_URL = process.env.NODE_ENV === 'production' || isMobile //27.11
//     ? 'https://lin-bitton.onrender.com/api/'
//     : '//localhost:3030/api/'

const isNative = Capacitor.isNativePlatform()
const isIOS = Capacitor.getPlatform() === 'ios'

const isSimulator = isIOS && navigator.userAgent.includes('Simulator')

const BASE_URL= 
    process.env.NODE_ENV === 'production' || (isNative && !isSimulator)
        ? 'https://lin-bitton.onrender.com/api/'
        : 'http://localhost:3030/api/'

const axios = Axios.create({ withCredentials: true })
axios.defaults.withCredentials = true

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`
    const params = (method === 'GET') ? data : null
    const options = { url, method, data, params }

    try {
        const res = await axios(options)
        return res.data
    } catch (err) {
        const status = err?.response?.status
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.log("Full URL on iOS", url)
        if (status === 401) return { error: 'Unauthorized', err }
        if (status === 404) return { error: 'Not_found', err }

        return { error: 'request failed',details: err.message }
        // // console.dir(err)
        // if (err.response && err.response.status === 401) {
        //     // sessionStorage.clear()
        //     // window.location.assign('/')
        //     return { error: 'Unauthorized'}
        // }
        // return { error: 'request failed', err}

    }
}