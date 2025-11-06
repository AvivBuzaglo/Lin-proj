import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'


export const blockOrdersService = {
  queryHours,
  queryDates,
  removeHours,
  removeDate,
  putHours,
  postHours,
  postDate 
}


async function queryHours(filterBy = { date: '' }) {
  try {
    const collection = await dbService.getCollection('blockedHours')
    var filteredHours = await collection.find().toArray()
    if(filterBy.date) { 
      const regExp = new RegExp(filterBy.date, 'i')
      filteredHours = filteredHours.filter(blocked => regExp.test(blocked.date))
    }

    return Promise.resolve(filteredHours)
  } catch (err) {
    logger.error('Cannot find blocked hours (service)', err)
    throw err
  }
}

async function queryDates() {
  try {
    const collection = await dbService.getCollection('blockedDates')
    const dates = await collection.find().toArray()
    return Promise.resolve(dates.map(doc => doc.dates))
  } catch (err) {
    logger.error('Cannot find blocked dates (service)', err)
    throw err
  }
}

async function removeHours(date, start) {
  try {
    const collection = await dbService.getCollection('blockedHours')
    await collection.updateOne(
      { date: date },
      { $pull: { hours: start } }
    )
    await _checkEmptyDay()
    return Promise.resolve('Removed successfully')
  } catch (err) {
    logger.error('Cannot remove blocked hour (service)', err)
    throw err
  }
}

async function removeDate(date) {
  try {
    const collection = await dbService.getCollection('blockedDates')
    const result = await collection.updateOne({}, { $pull: { dates: date } })
    if (result.deletedCount === 0) return Promise.reject('No such date')
    return Promise.resolve('Deleted successfully')
  } catch (err) {
    logger.error('Cannot remove blocked date (service)', err)
    throw err
  }
}

async function putHours(updatedEntity) {
  try {
    const collection = await dbService.getCollection('blockedHours')
    const filter = { _id: new ObjectId(updatedEntity._id) }
    const { _id, ...replacement } = updatedEntity
    const result =  await collection.replaceOne(filter, replacement)
    logger.info(`Matched ${result.matchedCount} and modified ${result.modifiedCount} blocked hours`)
    await _checkFullDay(updatedEntity) 
    await _checkEmptyDay()
    return Promise.resolve()
  } catch (err) {
    logger.error('Cannot update blocked hours (service)', err)
    throw err
  }
}

async function postHours(blockedHoursToAdd) {
  try {
    const collection = await dbService.getCollection('blockedHours')
    await collection.createIndex({ date: 1 }, { unique: true })

    try{
      const result = await collection.insertOne(blockedHoursToAdd)
      logger.info(`Inserted blocked hours with id: ${result.insertedId}`)
      return Promise.resolve()

    } catch (err) {
      if (err.code === 11000) {
        logger.info(`Blocked hours for date ${blockedHoursToAdd.date} already exists, updating instead`)
        await collection.updateOne(
          { date: blockedHoursToAdd.date },
          { $addToSet: { hours: { $each: blockedHoursToAdd.hours } } }
        )
        logger.info(`Updated blocked hours for date: ${blockedHoursToAdd.date}`)
        await _checkFullDay(blockedHoursToAdd)
        return Promise.resolve()
      } else {
        throw err
      }
    }
  } catch (err) { 
    logger.error('Cannot add blocked hours (service)', err)
    throw err 
  }
}

async function postDate(blockedDate) {
  try {
    const collection = await dbService.getCollection('blockedDates')
    const result = await collection.updateOne({}, { $addToSet: { dates: blockedDate}}, { upsert: true} )
    if(result.modifiedCount > 0) {
      logger.info(`Added blocked date: ${blockedDate}`)
    } else {
      logger.info(`Blocked date ${blockedDate} already exists`)
    }
    return Promise.resolve()
  } catch (err) {
    logger.error('Cannot add blocked date (service)', err)
    throw err
  }
}

async function _checkFullDay(entity) {
  try {
    const times = ['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20', '14:40', '15:00']
    const collection = await dbService.getCollection('blockedHours')
    const blockedDocs = await collection.find({ date: entity.date }).toArray()
    const blocked = blockedDocs.flatMap(doc => doc.hours || [])
    const blockedSorted = [...new Set(blocked)].sort()
    const isFull = times.slice().sort().every((val, index) => val === blockedSorted[index])
    
    if(isFull) {
      await postDate(entity.date)
    }
    return Promise.resolve()
  } catch (err) {
    logger.error('Cannot check full day (service)', err)
    throw err
  }
}

async function _checkEmptyDay() {
  try {
    const collection = await dbService.getCollection('blockedHours')
    const result = await collection.deleteMany({
      $or:[
        {hours: { $size: 0}},
        {hours: { $exists: false }}
      ]
    })
    logger.info(`Deleted ${result.deletedCount} empty blocked hours`)
    return Promise.resolve()
  } catch (err) {
    logger.error('Cannot delete empty blocked hours (service)', err)
    throw err
  }
}
