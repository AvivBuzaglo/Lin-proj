
export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
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

// export function readJsonFile(path) {
//     const str = fs.readFileSync(path, 'utf8')
//     const json = JSON.parse(str)
//     return json
// }
// export function generateCalender(year, month) {
//     const weeks = []
//     const firstDay = new Date(year, month, 1)
//     const lastDay = new Date(year, month + 1, 0)
//     const daysInMonth = lastDay.getDate()

//     // const startDay = firstDay.getDate()
//     const startDay = firstDay.getDay()
//     let week = new Array(startDay).fill(null)

//     for(let day = 1; day <= daysInMonth; day++) {
//         week.push(new Date(year, month, day))
//         if(week.length === 7) {
//             weeks.push(week)
//             week=[]
//         }
//     }

//     if(week.length > 0) {
//         while(week.length < 7) {
//             week.push(null)
//         }
//         weeks.push(week)
//     }

//     console.log(daysInMonth);
    
    
//     return weeks
// }