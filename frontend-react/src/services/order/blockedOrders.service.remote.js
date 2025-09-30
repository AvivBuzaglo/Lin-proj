import axios from 'axios'


const DATE_BASE_URL = '/api/blockedDates/'
const HOURS_BASE_URL = '/api/blockedhours/'


export const blockedOrdersService = {
    queryDates,
    queryHours,
    getHoursById,
    removeHours,
    removeDate,
    putHours,
    postHours,
    postDate
}

async function queryHours(filterBy = { date: '' }) {
    return axios.get(HOURS_BASE_URL, {params: filterBy}).then(res => res.data)
}

async function queryDates() {
    return axios.get(DATE_BASE_URL).then(res => res.data)
}

async function getHoursById(hoursId) {
  return axios.get(HOURS_BASE_URL + hoursId).then(res => res.data)
}

async function removeHours(date, start) {
    return axios.delete(HOURS_BASE_URL, date, start).then(res => res.data)
}

async function removeDate(date) {
    return axios.delete(DATE_BASE_URL, {params: date}).then(res => res.data)
}

async function putHours(updatedEntity) {
  return axios.put(HOURS_BASE_URL, updatedEntity).then(res => res.data)
//   _checkFullDay(updatedEntity) // this function need to be in backend
}

async function postHours(blockedHours) {
    return axios.post(HOURS_BASE_URL, blockedHours).then(res => res.data)
}

async function postDate(blockedDate) {
    return axios.post(DATE_BASE_URL, {params: blockedDate}).then(res => res.data)
}



