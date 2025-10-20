import express from 'express'
import {getDates, deleteDate, postDate} from './blockedDates.controller.js'

const router = express.Router()

router.get('/', getDates)
router.delete('/', deleteDate)
router.post('/:blockedDate', postDate)

export const blockedDatesRoutes = router