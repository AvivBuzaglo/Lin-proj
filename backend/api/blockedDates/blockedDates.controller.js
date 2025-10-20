import { blockOrdersService } from './blockedOrders.service.js'
import { logger } from './services/logger.service.js'

export const blockedOrdersController = {
    getDates,
    deleteDate,
    postDate
}

async function getDates(req, res) {
    try {
        await blockOrdersService.queryDates()
        .then(dates => res.send(dates))
    } catch (err) {
        logger.error('Error in /api/blockeddates', err)
        res.status(500).send({ err: 'Failed to get blocked dates' })
    }
}

async function deleteDate(req, res) {
    const  dateToRemove = {
        date: req.query.date || '',
    }
    try {
        await blockOrdersService.removeDate(dateToRemove.date)
        .then(() => res.send({ msg: 'Deleted successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockeddates', err)
        res.status(500).send({ err: 'Failed to remove blocked date' })
    }
}

async function postDate(req, res) {
    const { blockedDate } = req.params
    try {
        await blockOrdersService.postDate(blockedDate)
        .then(() => res.send({ msg: 'Saved successfully' }))
    } catch (err) {
        logger.error('Error in /api/blockeddates', err)
        res.status(500).send({ err: 'Failed to save blocked date' })
    }
}