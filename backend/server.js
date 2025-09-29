import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { carRoutes } from './api/car/car.routes.js'
import { setupSocketAPI } from './services/socket.service.js'
import { readJsonFile } from './services/util.service.js'
import { orderService } from './services/order.service.js'
import { userService } from './services/user/user.service.local.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

const app = express()
const server = http.createServer(app)


const users = readJsonFile('data/user.json')
const blockedHours = readJsonFile('data/blockedHours.json')

// Express App Config
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: [   'http://127.0.0.1:3000',
                    'http://localhost:3000',
                    'http://127.0.0.1:5173',
                    'http://localhost:5173'
                ],
        credentials: true
    }
    app.use(cors(corsOptions))
}
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/car', carRoutes)

setupSocketAPI(server)

// Make every unhandled server-side-route match index.html
// so when requesting http://localhost:3030/unhandled-route... 
// it will still serve the index.html file
// and allow vue/react-router to take it from there

app.get('/api/order', (req, res) => {
    const filterBy = {
        date: req.query.date || '',
    }
    orderService.query(filterBy)
    .then(orders => res.send(orders))
    // .then(console.log(orders))
    .catch(err => {
        console.log('Error in /api/orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    })
})

app.post('/api/order', (req, res) => {
//   userService.getById(req.query.owner)
//     .then(owner => {
//       if (!owner) throw new Error('No such user')

    //   const orderToSave = {
    //     _id: req.query._id,
    //     care: req.query.care,
    //     date: req.query.date,
    //     start: req.query.start,
    //     end: req.query.end,
    //     owner: {
    //       _id: owner._id,
    //       fullname: owner.fullname
    //     },
    //     msgs: []
    //   }

        const orderToSave = req.body
    
        // return orderService.save(orderToSave)
        orderService.save(orderToSave)
    // })
    .then(savedOrder => res.send(savedOrder))
    .catch(err => {
        console.log('Error in /api/order/save', err)
        res.status(500).send({ err: 'Failed to save order' })
    })
})

app.get('/api/order/:orderId', (req, res) => {
    const { orderId } = req.params
    orderService.getById(orderId)
    .then(order => res.send(order))
    .catch(err => {
        console.log('Error in /api/order/:orderId', err)
        res.status(500).send({ err: 'Failed to get order by id' })
    })
})

app.delete('/api/order/:orderId', (req, res) => {
    const { orderId } = req.params
    orderService.remove(orderId)
    .then(() => res.send({ msg: 'Deleted successfully' }))
    .catch(err => {
        console.log('Error in /api/order/:orderId/remove', err)
        res.status(500).send({ err: 'Failed to remove order' })
    })
})

app.get('/api/user', (req, res) => {
    res.send(users)
    console.log(users)
    .catch(err => {
        console.log('Error in /api/users', err)
        res.status(500).send({ err: 'Failed to get users' })
    })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
    .then(user => res.send(user))  
    console.log(user)
    .catch(err => {
        console.log('Error in /api/user/:userId', err)
        res.status(500).send({ err: 'Failed to get user by id' })
    })      
})

app.get('/api/blockedhours', (req, res) => {
    res.send(blockedHours)
    console.log(blockedHours)
    .catch(err => {
        console.log('Error in /api/blockedhours', err)
        res.status(500).send({ err: 'Failed to get blockedhours' })
    })
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

import { logger } from './services/logger.service.js'
const port = process.env.PORT || 3030

server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})