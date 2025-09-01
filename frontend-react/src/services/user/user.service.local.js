import { storageService } from '../async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

_refreshOrders()

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
}

async function getUsers() {
    const users = await storageService.query('user')
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get('user', userId)
}

function remove(userId) {
    return storageService.remove('user', userId)
}

async function update({ _id, score, orders }) {
    const user = await storageService.get('user', _id)
    user.score = score
    user.orders = orders
    await storageService.put('user', user)

	// When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username && user.password === userCred.password)

    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    userCred.score = 10000

    const user = await storageService.post('user', userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
	user = { 
        _id: user._id, 
        fullname: user.fullname, 
        imgUrl: user.imgUrl, 
        score: user.score, 
        isAdmin: user.isAdmin,
        orders: user.orders 
    }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

function _removeExpiredOrders() {
    const user = getLoggedinUser()
    if (!user || !user.orders ||user.orders.length <= 0) return []
    const orders = user.orders
    const today = new Date()

    return orders.filter(order => {
      const [day, month, year] = order.date.split('.').map(num => parseInt(num))
      const orderDate = new Date(year, month - 1, day)
      return orderDate >= today
    })
}

function _refreshOrders() {
    const user = getLoggedinUser()
    if (!user) return  
    const orders = _removeExpiredOrders()
    user.orders = orders
    update(user)
}

// To quickly create an admin user, uncomment the next line
// _createAdmin()
async function _createAdmin() {
    const user = {
        username: 'admin',
        password: 'admin',
        fullname: 'Mustafa Adminsky',
        isAdmin: true,
        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
        score: 10000,
        orders: []
    }

    const newUser = await storageService.post('user', user)
    console.log('newUser: ', newUser)
}