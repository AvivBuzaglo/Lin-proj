import fs from 'fs'

export function makeId(length = 5) {
	var txt = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return txt
}

export function debounce(func, timeout = 300) {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, timeout)
	}
}

export function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateRandomName() {
	const names = ['Jhon', 'Wick', 'Strong', 'Dude', 'Yep', 'Hello', 'World', 'Power', 'Goku', 'Super', 'Hi', 'You', 'Are', 'Awesome']
	const famName = ['star', 'kamikaza', 'family', 'eat', 'some', 'banana', 'brock', 'david', 'gun', 'walk', 'talk', 'car', 'wing', 'yang', 'snow', 'fire']
	return names[Math.floor(Math.random() * names.length)] + famName[Math.floor(Math.random() * names.length)]
}

export function generateRandomImg() {
	//try to get diff img every time
	return 'pro' + Math.floor(Math.random() * 17 + 1) + '.png'
}

export function timeAgo(ms = new Date()) {
	const date = ms instanceof Date ? ms : new Date(ms)
	const formatter = new Intl.RelativeTimeFormat('en')
	const ranges = {
		years: 3600 * 24 * 365,
		months: 3600 * 24 * 30,
		weeks: 3600 * 24 * 7,
		days: 3600 * 24,
		hours: 3600,
		minutes: 60,
		seconds: 1,
	}
	const secondsElapsed = (date.getTime() - Date.now()) / 1000
	for (let key in ranges) {
		if (ranges[key] < Math.abs(secondsElapsed)) {
			const delta = secondsElapsed / ranges[key]
			let time = formatter.format(Math.round(delta), key)
			if (time.includes('in')) {
				time = time.replace('in ', '')
				time = time.replace('ago', '')
				time += ' ago'
			}
			return time //? time : 'Just now'
		}
	}
}

export function randomPastTime() {
	const HOUR = 1000 * 60 * 60
	const DAY = 1000 * 60 * 60 * 24
	const WEEK = 1000 * 60 * 60 * 24 * 7

	const pastTime = getRandomIntInclusive(HOUR, WEEK)
	return Date.now() - pastTime
}

export function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

export function generateCalender(year, month) {
    const weeks = []
    const today = new Date()
    const currentDate = new Date(year, month, 1)

    // Only start from today if it's the current year & month
    const startDay = (today.getFullYear() === year && today.getMonth() === month)
        ? today.getDate()
        : 1

    const firstDayOfWeek = new Date(year, month, startDay).getDay()
    let week = new Array(firstDayOfWeek).fill(null)

    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    for (let day = startDay; day <= daysInMonth; day++) {
        week.push(new Date(year, month, day))
        if (week.length === 7) {
            weeks.push(week)
            week = []
        }
    }

    if (week.length > 0) {
        while (week.length < 7) {
            week.push(null)
        }
        weeks.push(week)
    }

    return weeks
}

export function buildExpirationDate(date, end) {
    const [day, month, year] = date.split(".")
    const [hour, minute] = end.split(":")

    return new Date(Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
    ))
}

export function buildBlockedExpirationDate(date) {
	const [day, month, year] = date.split(".").map(Number)
	const baseDate = new Date(Date.UTC(year, month - 1, day))

	baseDate.setUTCDate(baseDate.getUTCDate() + 1)

	return baseDate
}