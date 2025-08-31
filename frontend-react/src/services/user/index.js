const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

function getEmptyUser() {
    return {
        username: '', 
        password: '', 
        fullname: '',
        phoneNumber: '',
        isAdmin: false,
        score: 100,
        orders: []
    }
}

// const service = VITE_LOCAL === 'true' ? local : remote
const service = local
export const userService = { ...service, getEmptyUser }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if(DEV) window.userService = userService