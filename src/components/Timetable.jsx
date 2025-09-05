import React, { useMemo } from 'react';

const ALL_TIME_SLOTS = [
    "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
    "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00"
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const COURSE_COLORS = [
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100',
    'bg-pink-100', 'bg-indigo-100', 'bg-red-100', 'bg-teal-100',
    'bg-gray-100', 'bg-brown-100', 'bg-orange-100'
];

const parseDay = (abbr) => {
    const dayMap = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };
    return dayMap[abbr] || "";
};

const convertTo24Hour = (timeStr) => {
    const cleanTimeStr = timeStr.toLowerCase().replace('am', '').replace('pm', '').trim();
    let [hour] = cleanTimeStr.split(':');
    let hourInt = parseInt(hour, 10);
    if (isNaN(hourInt)) return NaN;
    if (hourInt >= 1 && hourInt <= 7) {
        hourInt += 12;
    }
    return hourInt;
};

const Timetable = ({ coursesToDisplay }) => {
    const { timetableGrid, activeTimeSlots } = useMemo(() => {
        const timeSlots = ALL_TIME_SLOTS.filter(slot => slot !== "13:00 - 14:00");
        
        const grid = {};
        timeSlots.forEach(time => {
            grid[time] = {};
            DAYS.forEach(day => {
                grid[time][day] = [];
            });
        });

        let colorIndex = 0;
        coursesToDisplay.forEach(course => {
            const courseColor = COURSE_COLORS[colorIndex % COURSE_COLORS.length];
            colorIndex++;
            if (!course.timeSlot) return;

            const timeSlotsRaw = course.timeSlot.split(', ');
            timeSlotsRaw.forEach(slotRaw => {
                const parts = slotRaw.trim().split(' ');
                if (parts.length < 2) return;

                const [dayAbbr, timeRange] = parts;
                const day = parseDay(dayAbbr);
                if (!day || !timeRange.includes('-')) return;

                const [startTime] = timeRange.split('-');
                const startHour = convertTo24Hour(startTime);
                if (isNaN(startHour)) return;

                const gridSlot = timeSlots.find(slot => slot.startsWith(String(startHour).padStart(2, '0')));
                if (grid[gridSlot]?.[day]) {
                    grid[gridSlot][day].push({ ...course, color: courseColor, specificTime: timeRange });
                }
            });
        });

        Object.values(grid).forEach(dayRow => {
            Object.values(dayRow).forEach(cellCourses => {
                if (cellCourses.length > 1) {
                    cellCourses.forEach(c => c.isConflict = true);
                }
            });
        });

        const activeSlots = timeSlots.filter(slot => 
            DAYS.some(day => grid[slot][day].length > 0)
        );

        return { timetableGrid: grid, activeTimeSlots: activeSlots };
    }, [coursesToDisplay]);

    return (
        <div className="w-full bg-white p-4 md:p-6 rounded-2xl shadow-lg">
            <h2 className="text-center text-2xl font-semibold mb-4 border-b pb-2">Your Weekly Timetable</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center table-fixed">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 font-semibold border border-gray-200 min-w-[100px]">Day</th>
                            {activeTimeSlots.map(slot => (
                                <th key={slot} className="p-3 font-semibold border border-gray-200 text-sm min-w-[120px]">{slot}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DAYS.map(day => (
                            <tr key={day}>
                                <td className="p-3 border border-gray-200 font-medium bg-gray-50">{day}</td>
                                {activeTimeSlots.map(slot => {
                                    const coursesInCell = timetableGrid[slot]?.[day] || [];
                                    return (
                                        <td key={`${day}-${slot}`} className="p-1 border border-gray-200 align-top h-28">
                                            <div className="flex flex-col h-full">
                                                {coursesInCell.map((course, index) => (
                                                    <div key={index} className={`rounded-xl ${course.color} ${course.isConflict ? 'ring-2 ring-red-500' : ''} p-2 text-left flex-grow flex flex-col justify-center`}>
                                                        <p className="text-center font-bold text-sm leading-tight">{course.subjectName}</p>
                                                        <p className="text-center text-xs text-gray-700">{course.courseCode}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Timetable;
