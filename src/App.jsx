import React, { useState, useMemo, useCallback } from 'react';

import { courseData } from './data/courseData'; 
import Header from './components/Header';
import CourseSelector from './components/Courseselector'; 
import Timetable from './components/Timetable';
import ConflictModal from './components/ConflictModal';
import './index.css'; 

const parseDay = (abbr) => {
    const dayMap = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };
    return dayMap[abbr] || "";
};

function App() {
    const [courses] = useState(courseData);
    const departments = useMemo(() => [...new Set(courses.map(course => course.dept))].sort(), [courses]);
    const [selectedCourseIds, setSelectedCourseIds] = useState(new Set());
    const [generatedCourses, setGeneratedCourses] = useState([]);
    const [conflictMessage, setConflictMessage] = useState(null);

    const handleCourseToggle = useCallback((courseId) => {
        setSelectedCourseIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(courseId)) {
                newIds.delete(courseId);
            } else {
                newIds.add(courseId);
            }
            return newIds;
        });
        setGeneratedCourses([]);
    }, []);

    const handleGenerate = useCallback(() => {
        const selectedCourses = courses.filter(c => selectedCourseIds.has(c.id));
        const schedule = {};
        let firstConflict = null;

        for (const course of selectedCourses) {
            if (!course.timeSlot) continue;
            const timeSlotsRaw = course.timeSlot.split(', ');
            for (const slotRaw of timeSlotsRaw) {
                const parts = slotRaw.trim().split(' ');
                if (parts.length < 2) continue;

                const [dayAbbr, timeRange] = parts;
                const day = parseDay(dayAbbr);
                if (!day || !timeRange.includes('-')) continue;

                const [startTime] = timeRange.split('-');
                const startHour = parseInt(startTime.split(':')[0], 10);
                if (isNaN(startHour)) continue;

                const timeSlotStr = `${String(startHour).padStart(2, '0')}:00`;
                const key = `${day}-${timeSlotStr}`;
                if (schedule[key] && !firstConflict) {
                    firstConflict = `Conflict for ${course.subjectName} with ${schedule[key].subjectName} on ${day} at ${timeSlotStr}.`;
                }
                schedule[key] = course;
            }
        }
        setConflictMessage(firstConflict);
        setGeneratedCourses(selectedCourses);
    }, [selectedCourseIds, courses]);

    const handleClear = useCallback(() => {
        setSelectedCourseIds(new Set());
        setGeneratedCourses([]);
        setConflictMessage(null);
    }, []);

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen p-4 md:p-8">
            <Header />
            <main className="flex flex-col items-center w-full gap-8 mt-8">
                
                <div className="w-full lg:w-1/2">
                    <CourseSelector 
                        courses={courses}
                        departments={departments}
                        selectedCourseIds={selectedCourseIds}
                        onCourseToggle={handleCourseToggle}
                        onGenerate={handleGenerate}
                        onClear={handleClear}
                    />
                </div>
                
                <div className="w-full">
                    <Timetable coursesToDisplay={generatedCourses} />
                </div>

            </main>
            <ConflictModal 
                conflictMessage={conflictMessage}
                onClose={() => setConflictMessage(null)} 
            />
        </div>
    );
}

export default App;
