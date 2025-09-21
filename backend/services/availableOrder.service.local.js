import { storageService } from '../async-storage.service'
import { makeId, loadFromStorage, saveToStorage, generateCalender } from '../util.service'

const AVAILABLE_ORDERS_STORAGE_KEY = 'blockedDates'
const BLOCKED_HOURS_STORAGE_KEY = 'blockedHours'

query()
_refreshBlockedHours()
_refreshDates()
export const availableOrdersService = {
  query, 
  getById, 
  remove,
  BlockedDatePost,
  blockedHoursPost,
  putHours,
  queryHours,
  removeByTime
}
window.cs = availableOrdersService

async function query() {
  let availableOrders;

  try {
    availableOrders = await storageService.query(AVAILABLE_ORDERS_STORAGE_KEY); // Fetch orders from storage or API
  } catch (error) {
    console.error('Error fetching available orders:', error);
    return [];
  }

  return availableOrders;
}

async function queryHours() {
  let blockedHours;

  try {
    blockedHours = await storageService.query(BLOCKED_HOURS_STORAGE_KEY); // Fetch orders from storage or API
  } catch (error) {
    console.error('Error fetching blocked hours:', error);
    return [];
  }

  return blockedHours;
}

function getById(availableOrderId) {
  return storageService.get(AVAILABLE_ORDERS_STORAGE_KEY, availableOrderId)
}

async function remove(month, weekIdx, dayIdx) {
  // throw new Error('Nope')
  await storageService.removeByDate(AVAILABLE_ORDERS_STORAGE_KEY, month, weekIdx, dayIdx)
}

async function removeByTime(date, start) {
  await storageService.removeByTime(BLOCKED_HOURS_STORAGE_KEY, date, start)
  _checkEmptyDay(date)
}

function putHours(updatedEntity) {
  storageService.putHours(BLOCKED_HOURS_STORAGE_KEY, updatedEntity)
  _checkFullDay(updatedEntity)
}

function BlockedDatePost(entity) {
  storageService.BlockedDatePost(AVAILABLE_ORDERS_STORAGE_KEY, entity)
}

function blockedHoursPost(entity) {
  storageService.BlockedDatePost(BLOCKED_HOURS_STORAGE_KEY, entity)
}

function _checkFullDay(entity) {
  const times = ['9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20', '14:40', '15:00']
  const blocked = _removeMatches(entity) 
  let isFull = times.slice().sort().every((val, index) => val === blocked.slice().sort()[index])

  if(isFull) {
    BlockedDatePost(entity.date)
  }
}

async function _checkEmptyDay(date) {
  const blockedHours = await queryHours(BLOCKED_HOURS_STORAGE_KEY)
  const blockedIdx = blockedHours.findIndex((block) => block.date === date)
  if(blockedHours[blockedIdx].hours.length === 0) {
    storageService.removeByDate(BLOCKED_HOURS_STORAGE_KEY, date)
  }
}

function _removeMatches(entity) {
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

function _cleanDates() {
  const blockedDates = loadFromStorage(AVAILABLE_ORDERS_STORAGE_KEY)
  if (!blockedDates) return 
  const today = new Date()

  return blockedDates.filter(dateStr => {
    const [day, month, year] = dateStr.split('.').map(Number)
    const date = new Date(year, month - 1, day)
    return date >= today
  })
}

function _refreshDates() {
  const blockedDates = _cleanDates()
  if (!blockedDates) return
  saveToStorage(AVAILABLE_ORDERS_STORAGE_KEY, blockedDates)
}

function _cleanBlockedHour(blockedHours) {
  const now = new Date()
  const [day, month, year] = blockedHours.date.split('.').map(Number)
  const blockedDate = new Date(year, month - 1, day)

  if(blockedDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    return null
  }

  if(
    blockedDate.getFullYear() === now.getFullYear() &&
    blockedDate.getMonth() === now.getMonth() &&
    blockedDate.getDate() === now.getDate()
  ) 
  {
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const filteredHours = blockedHours.hours.filter((h) => {
      const [hour, minute] = h.split(':').map(Number)
      const timeMinutes = hour * 60 + minute
      return timeMinutes > currentMinutes
    })

    if (filteredHours.length === 0) return null
    return { ...blockedHours, hours: filteredHours }
  }
  return blockedHours
}

function _refreshBlockedHours() {
  const blockedHours = loadFromStorage(BLOCKED_HOURS_STORAGE_KEY)
  if (!blockedHours) return
  const refreshedHours = blockedHours.map(_cleanBlockedHour).filter(blocked => blocked !== null)
  
  saveToStorage(BLOCKED_HOURS_STORAGE_KEY, refreshedHours)
}

// _createAvailbleOrders()
function _createAvailbleOrders() {
    let blockedDates = loadFromStorage(AVAILABLE_ORDERS_STORAGE_KEY)


    if (!blockedDates || !blockedDates.lenght) {
        const year = new Date().getFullYear()
        const month = new Date().getMonth()
        const today = new Date()
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        const weeks = generateCalender(year, month)
        const nextWeeks = generateCalender(year, nextMonth.getMonth())
        const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
        const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']


        const blockedDates = [
          '20.8.2025'
        ]

         saveToStorage(AVAILABLE_ORDERS_STORAGE_KEY, blockedDates)
    }
}

function _createBlockedHours() {
  let blockedHours = loadFromStorage(BLOCKED_HOURS_STORAGE_KEY)

  if(!blockedHours || !blockedHours.lenght) {
    blockedHours = [
      {
        date: '20.8.2025',
        hours: ['10:00', '10:20', '10:40', '11:00']
      },
      {
        date: '21.8.2025',
        hours: ['10:00', '10:20', '10:40', '11:00']
      }
    ]
  }
}