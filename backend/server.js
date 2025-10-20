import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import { logger } from './services/logger.service.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { carRoutes } from './api/car/car.routes.js'
import { setupSocketAPI } from './services/socket.service.js'
import { readJsonFile } from './services/util.service.js'
import { orderService } from './services/order.service.js'
import { userService } from './services/user/user.service.local.js'
import { blockOrdersService } from './services/blockedOrders.service.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

const app = express()
const server = http.createServer(app)


const users = readJsonFile('data/user.json')


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
    try {
        const filterBy = {
            date: req.query.date || '',
        }
        orderService.query(filterBy)
        .then(orders => res.send(orders))
    } catch (err) {
        logger.error('Error in /api/order', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
})

app.post('/api/order', (req, res) => {
    try {
        const orderToSave = req.body
        orderService.save(orderToSave)
        .then(savedOrder => res.send(savedOrder))
    } catch (err) {
        logger.error('Error in /api/order', err)
        res.status(500).send({ err: 'Failed to save order' })
    }
})

app.get('/api/order/:orderId', (req, res) => {
    try {
        const { orderId } = req.params
        orderService.getById(orderId)
        .then(order => res.send(order))
    } catch (err) { 
        logger.error('Error in get /api/order/:orderId', err)
        res.status(500).send({ err: 'Failed to get order by id' })
    }  
})

app.delete('/api/order/:orderId', (req, res) => {
    try {
        const { orderId } = req.params
        orderService.remove(orderId)
        .then(() => res.send({ msg: 'Deleted successfully' }))
    } catch (err) {
        logger.error('Error in delete /api/order/:orderId', err)
        res.status(500).send({ err: 'Failed to remove order' })
    }
})

// app.get('/api/user', (req, res) => {
//     res.send(users)
//     console.log(users)
//     .catch(err => {
//         console.log('Error in /api/user', err)
//         res.status(500).send({ err: 'Failed to get users' })
//     })
// })

app.get('/api/user/:userId', (req, res) => {
    try {
        const { userId } = req.params
        userService.getById(userId)
        .then(user => res.send(user))  
    } catch (err) {
        logger.error('Error in get /api/user/:userId', err)
        res.status(500).send({ err: 'Failed to get user by id' })
    }  
})

app.get('/api/blockedhours', (req, res) => {
    try {
        const filterBy = {
            date: req.query.date || '',
        }
        blockOrdersService.queryHours(filterBy)
        .then(blocked => res.send(blocked))
    } catch (err) {
        logger.error('Error in /api/blockedhours', err)
        res.status(500).send({ err: 'Failed to get blocked hours' })
    }
})

app.get('/api/blockeddates', (req, res) => {
    try {
        blockOrdersService.queryDates()
        .then(dates => res.send(dates))
    } catch (err) {
        logger.error('Error in /api/blockeddates', err)
        res.status(500).send({ err: 'Failed to get blocked dates' })
    }
})

app.delete('/api/blockedhours', (req, res) => {
    try {
        const date = req.body.date
        const start = req.body.start
        console.log("date:", date, "start:", start)
        blockOrdersService.removeHours(date, start)
        .then(() => res.send({ msg: 'Deleted successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockedhours', err)
        res.status(500).send({ err: 'Failed to remove blocked hours' })
    }
})

app.delete('/api/blockeddates', (req, res) => {
    try {
        const  dateToRemove = {
            date: req.query.date || '',
        }
        blockOrdersService.removeDate(dateToRemove.date)
        .then(() => res.send({ msg: 'Deleted successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockeddates', err)
        res.status(500).send({ err: 'Failed to remove blocked date' })
    }
})

app.put('/api/blockedhours', (req, res) => {
    try {
        const updatedHours = req.body
        blockOrdersService.putHours(updatedHours)
        .then(() => res.send({ msg: 'Updated successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockedhours', err)
        res.status(500).send({ err: 'Failed to update blocked hours' })
    }
})

app.post('/api/blockedhours', (req, res) => {
    try {
        const blockedHours = req.body
        blockOrdersService.postHours(blockedHours)
        .then(() => res.send({ msg: 'Saved successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockedhours', err)
        res.status(500).send({ err: 'Failed to save blocked hours' })
    }
})

app.post('/api/blockeddates/:blockedDate', (req, res) => {
    try {
        const { blockedDate } = req.params
        blockOrdersService.postDate(blockedDate)
        .then(() => res.send({ msg: 'Saved successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockeddates', err)
        res.status(500).send({ err: 'Failed to save blocked date' })
    }
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const port = process.env.PORT || 3030

server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})