import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import mongoDB from 'mongodb'

import { logger } from './services/logger.service.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { carRoutes } from './api/car/car.routes.js'
import { orderRoutes } from './api/order/order.routs.js'
import { blockedHoursRoutes } from './api/blockedHours/blockedHours.routs.js'
import { blockedDatesRoutes } from './api/blockedDates/blockedDates.routs.js'
import { setupSocketAPI } from './services/socket.service.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

const app = express()
const server = http.createServer(app)

const {MongoClient} = mongoDB

const url = 'mongodb://127.0.0.1:27017'
const dbName = 'linDB'


// // Express App Config
// app.use(cookieParser())
// app.use(express.json())
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', 'true')
//     res.header('Access-Control-Allow-Origin', 'capacitor://localhost')
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//     if(req.method === 'OPTIONS') {
//         return res.sendStatus(200)
//     }
//     next()
// })

// Express App Config
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} 
const corsOptions = {
    origin: [   
        'capacitor://localhost',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://192.168.1.10:3030',
        'http://192.168.1.10:5173',
        'https://lin-bitton.onrender.com',
        'https://localhost'
        ],
        credentials: true
    }
app.use(cors(corsOptions))

// app.use(session({
//     secret: "...",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'none',
//     }
// }))

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.resolve('public')))
// } else {
//     const corsOptions = {
//         origin: [   'http://127.0.0.1:3000',
//                     'http://localhost:3000',
//                     'http://127.0.0.1:5173',
//                     'http://localhost:5173',
//                     'http://192.168.1.10:3030',
//                     'http://192.168.1.10:5173',
//                     'https://lin-bitton.onrender.com',
//                     'capacitor://localhost',
//                     'http://localhost'
//                 ],
//         credentials: true
//     }
//     app.use(cors(corsOptions))
// }
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/car', carRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/blockedhours', blockedHoursRoutes)
app.use('/api/blockeddates', blockedDatesRoutes)

setupSocketAPI(server)

// Make every unhandled server-side-route match index.html
// so when requesting http://localhost:3030/unhandled-route... 
// it will still serve the index.html file
// and allow vue/react-router to take it from there

// tryMongo()

async function tryMongo() {
    console.log('connecting')
    const connection = await MongoClient.connect(url)

    console.log('connected!. Getting DB')
    const db = connection.db(dbName)

    console.log('Getting collection')
    const collection = db.collection('orders')

    console.log('Fetching Docs..')
    const docs = await collection.find().toArray()

    console.log('Docs:\n', await docs)
    connection.close()
}


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})


const port = process.env.PORT || 3030

server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})