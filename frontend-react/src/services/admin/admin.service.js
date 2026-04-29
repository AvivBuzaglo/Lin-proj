import { registerPlugin } from "@capacitor/core";
import { orderService } from "../order/order.service.remote.js";

const CalendarPlugin = registerPlugin('CapacitorCalendar')

export const syncAllAppointments = async () => {
    const appointments = await orderService.query()

    try {
        const calendarResponse = await CalendarPlugin.getDefaultCalendar()
        const calendar = calendarResponse.result
        const existingIds = await getExistingIds()

        for (const aptt of appointments) {
            if(existingIds.has(aptt._id)) {
                console.log("Skipping existing:", aptt._id)
                continue
            }

            const convertedDate = await convertDateAndTime(aptt.date, aptt.start, aptt.end)
            const start = new Date(convertedDate[0])
            const end = new Date(convertedDate[1])

            await CalendarPlugin.createEvent({
                title: getServiceType(aptt.care),
                description: `${aptt.owner.fullname} | ID:${aptt._id}`,
                startDate: start.getTime(),
                endDate: end.getTime(),
                calendarId: calendar.id,
                commit: true
            })
        }

        alert("תורים צורפו ליומן בהצלחה!")
    } catch (err) {
        console.error(err)
        alert("קרתה תקלה באת ביצוע הסינכרון")
    }
}

async function getExistingIds() {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 1)

    const existingEvents = await CalendarPlugin.listEventsInRange({
        from: startDate.getTime(),
        to: endDate.getTime()
    })

    const existingIds = await new Set(
        existingEvents.result.map(event => {
            const desc = event.description || ""
            const match = desc.match(/ID:(.+)$/)
            return match ? match[1] : null
        }).filter(Boolean)
    )

    return existingIds
}

function convertDateAndTime(date, start, end) {
    const [day, month, year] = date.split(".")

    const formatedMonth = String(month).padStart(2, "0")
    const formatedDay = String(day).padStart(2, "0")

    const formatedStart = `${year}-${formatedMonth}-${formatedDay}T${start}:00.00` // if anything behaves weird change :00.00 to :00
    const formatedEnd = `${year}-${formatedMonth}-${formatedDay}T${end}:00.00`

    return [formatedStart, formatedEnd]
}

function getServiceType(type) {
    switch (type) {
        case 'shaping':
            return "עיצוב גבות + שפם"
        case 'lift':
            return "הרמת גבות"
        case 'micro':
            return "מיקרובליינדינג"
        default: 
            return null   
    }
}