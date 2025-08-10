import { storageService } from '../async-storage.service'
import { makeId, loadFromStorage, saveToStorage, generateCalender } from '../util.service'

const AVAILABLE_ORDERS_STORAGE_KEY = 'availableOrders'

query()
export const availableOrdersService = {
  query, 
  getById, 
  remove,
  BlockedDatePost
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

function getById(availableOrderId) {
  return storageService.get(AVAILABLE_ORDERS_STORAGE_KEY, availableOrderId)
}

async function remove(month, weekIdx, dayIdx) {
  // throw new Error('Nope')
  await storageService.removeByDate(AVAILABLE_ORDERS_STORAGE_KEY, month, weekIdx, dayIdx)
}


function BlockedDatePost(entity) {
  storageService.BlockedDatePost(AVAILABLE_ORDERS_STORAGE_KEY, entity)
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
          '10.8.2025'
        ]

         saveToStorage(AVAILABLE_ORDERS_STORAGE_KEY, blockedDates)
    }
}