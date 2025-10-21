import express from 'express'
import {getHours, deleteHours, updateHours, postHours} from './blockedHours.controller.js'
const router = express.Router()

router.get('/', getHours)
router.delete('/', deleteHours)
router.put('/', updateHours)
router.post('/', postHours)

export const blockedHoursRoutes = router