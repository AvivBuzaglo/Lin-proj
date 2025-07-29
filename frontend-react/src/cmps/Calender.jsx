import React from "react"
import { generateCalender } from "../services/util.service.js"

export function Calender({ year = new Date().getFullYear(), month = new Date().getMonth() }) {
    const weeks = generateCalender(year, month)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <div className="calender">
            {/* {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="calender-day">{day}</div>
            ))}

            {weeks.flat().map((date, idx) => (
                <div key={idx} className="calender-week">
                    {date ? date.getDate() : ''}
                </div>
            ))} */}

            <table style={{ borderCollapse: 'collapse', width: '100%', marginBlockStart: '4.375rem' }}>
                <thead>
                    <tr>
                        {daysOfWeek.map((day) => (
                            <th key={day} style={{ border: '1px solid #ccc', padding: '8px', background: '#f0f0f0' }}>
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week, i) => (
                        <tr key={i}>
                            {week.map((date, j) => (
                                <td
                                    key={j}
                                    style={{
                                    border: '1px solid #ccc',
                                    height: '60px',
                                    textAlign: 'center',
                                    verticalAlign: 'top',
                                    background: date ? 'white' : '#f9f9f9'
                                    }}
                                >
                                    {date ? date.getDate() : ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}