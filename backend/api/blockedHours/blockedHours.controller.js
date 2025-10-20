import { blockOrdersService } from './blockedOrders.service.js'
import { logger } from './services/logger.service.js'

export const blockedHoursController = {
    getHours,
    deleteHours,
    updatedHours,
    postHours
}


async function getHours(req, res) { 
    const filterBy = {
        date: req.query.date || '',
    }
    try {
        await blockOrdersService.queryHours(filterBy)
        .then(blocked => res.send(blocked))
    } catch (err) {
        logger.error('Error in /api/blockedhours', err)
        res.status(500).send({ err: 'Failed to get blocked hours' })
    }    
}

async function deleteHours(req, res) {
    const date = req.body.date
    const start = req.body.start
    console.log("date:", date, "start:", start)
    try {
        await blockOrdersService.removeHours(date, start)
        .then(() => res.send({ msg: 'Deleted successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockedhours', err)
        res.status(500).send({ err: 'Failed to remove blocked hours' })
    }
}

async function updatedHours(req, res) {
    const updatedHours = req.body
    try {
        await blockOrdersService.putHours(updatedHours)
        .then(() => res.send({ msg: 'Updated successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockedhours', err)
        res.status(500).send({ err: 'Failed to update blocked hours' })
    }
}

async function postHours(req, res) {
    const blockedHours = req.body
    try {
        await blockOrdersService.postHours(blockedHours)
        .then(() => res.send({ msg: 'Saved successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockedhours', err)
        res.status(500).send({ err: 'Failed to save blocked hours' })
    }
}