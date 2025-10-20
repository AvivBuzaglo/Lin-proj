import fs from 'fs'
import { readJsonFile ,generateCalender } from '../../services/util.service.js'
import e from 'cors'

const blockedHours = readJsonFile('data/blockedHours.json')
const blockedDates = readJsonFile('data/blockedDates.json')

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
  var filteredHours = blockedHours
    if(filterBy.date) { 
      const regExp = new RegExp(filterBy.date, 'i')
      filteredHours = filteredHours.filter(blocked => regExp.test(blocked.date))
    }

  return Promise.resolve(filteredHours)
}

async function queryDates() {
  return Promise.resolve(blockedDates)
}

async function removeHours(date, start) {
  const blocked = blockedHours.find(block => block.date === date)
  if (!blocked) return Promise.reject('No such date')
  const hourIdx = blocked.hours.findIndex(h => h === start)
  if (hourIdx < 0) return Promise.reject('No such hour')
  blocked.hours.splice(hourIdx, 1)
  _checkEmptyDay(date)
  return _saveHoursToFile()
}

async function removeDate(date) {
  const idx = blockedDates.findIndex(blocked => blocked === date)
  if (idx < 0) return Promise.reject('No such date')
  blockedDates.splice(idx, 1)
  return _saveDatesToFile()
}

async function putHours(updatedEntity) {
  console.log('updatedEntity:', updatedEntity)
  const idx = blockedHours.findIndex(block => block.date === updatedEntity.date)
  if (idx < 0) return Promise.reject('No such date')
  blockedHours[idx] = updatedEntity
  _checkFullDay(updatedEntity) // this function need to be in backend
  _checkEmptyDay(blockedHours[idx].date)
  return _saveHoursToFile()
}

async function postHours(blockedHoursToAdd) {
  const idx = blockedHours.findIndex(block => block.date === blockedHoursToAdd.date)
  if (idx >= 0) {
    blockedHours[idx].hours = [...new Set([...blockedHours[idx].hours, ...blockedHoursToAdd.hours])]
  }
  else {
    blockedHours.push(blockedHoursToAdd)
  }
  return _saveHoursToFile()
}

async function postDate(blockedDate) {
  if (blockedDates.includes(blockedDate)) return Promise.reject('Date already exists')
  blockedDates.push(blockedDate)
  return _saveDatesToFile()
}

async function _checkFullDay(entity) {
  const times = ['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20', '14:40', '15:00']
  const blocked = _removeMatches(entity) 
  let isFull = times.slice().sort().every((val, index) => val === blocked.slice().sort()[index])

  if(isFull) {
    BlockedDatePost(entity.date)
  }
}

async function _checkEmptyDay(date) {
  const blockedIdx = blockedHours.findIndex((block) => block.date === date)
  if(blockedHours[blockedIdx].hours.length === 0) {
    blockedHours.splice(blockedIdx, 1)
    await _saveHoursToFile()
  }
}

async function _removeMatches(entity) {
  const remove = ['15:10', '15:30', '15:50', '16:10', '16:30']
  let blocked = [...entity.hours]

  remove.forEach(item => {
    const index = blocked.indexOf(item)
    if(index !== -1) {
      blocked.splice(index, 1)
    }
  })

  return blocked
}

// function _cleanDates() {
//   const blockedDates = loadFromStorage(AVAILABLE_ORDERS_STORAGE_KEY)
//   if (!blockedDates) return 
//   const today = new Date()

//   return blockedDates.filter(dateStr => {
//     const [day, month, year] = dateStr.split('.').map(Number)
//     const date = new Date(year, month - 1, day)
//     return date >= today
//   })
// }

// function _refreshDates() {
//   const blockedDates = _cleanDates()
//   if (!blockedDates) return
//   saveToStorage(AVAILABLE_ORDERS_STORAGE_KEY, blockedDates)
// }

// function _cleanBlockedHour(blockedHours) {
//   const now = new Date()
//   const [day, month, year] = blockedHours.date.split('.').map(Number)
//   const blockedDate = new Date(year, month - 1, day)

//   if(blockedDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
//     return null
//   }

//   if(
//     blockedDate.getFullYear() === now.getFullYear() &&
//     blockedDate.getMonth() === now.getMonth() &&
//     blockedDate.getDate() === now.getDate()
//   ) 
//   {
//     const currentMinutes = now.getHours() * 60 + now.getMinutes()

//     const filteredHours = blockedHours.hours.filter((h) => {
//       const [hour, minute] = h.split(':').map(Number)
//       const timeMinutes = hour * 60 + minute
//       return timeMinutes > currentMinutes
//     })

//     if (filteredHours.length === 0) return null
//     return { ...blockedHours, hours: filteredHours }
//   }
//   return blockedHours
// }

// function _refreshBlockedHours() {
//   const blockedHours = loadFromStorage(BLOCKED_HOURS_STORAGE_KEY)
//   if (!blockedHours) return
//   const refreshedHours = blockedHours.map(_cleanBlockedHour).filter(blocked => blocked !== null)
  
//   saveToStorage(BLOCKED_HOURS_STORAGE_KEY, refreshedHours)
// }

async function _saveHoursToFile() { 
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(blockedHours, null, 4)
    fs.writeFile('./data/blockedHours.json', data, (err) => {
      if (err) {
        console.error('Error writing file:', err)
        return reject(err)
      }
      resolve()
    })
  })
}

async function _saveDatesToFile() { 
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(blockedDates, null, 4)
    fs.writeFile('./data/blockedDates.json', data, (err) => {
      if (err) {
        console.error('Error writing file:', err)
        return reject(err)
      }
      resolve()
    })
  })
}