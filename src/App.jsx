import React, { useState, useMemo, useCallback } from 'react';
import { Github } from 'lucide-react';

import { courseData } from './data/courseData'; 
import Header from './components/Header';
import CourseSelector from './components/CourseSelector'; 
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
        // We no longer clear generatedCourses here so the table stays visible
    }, []);

    const handleGenerate = useCallback(() => {
        const selectedCourses = courses.filter(c => selectedCourseIds.has(c.id));
        const schedule = {};
        let firstConflict = null;
        let conflictingCourseId = null;

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
                
                const timeSlotStr = `${String(startHour).padStart(2, '0')}:00`;
                const key = `${day}-${timeSlotStr}`;

                // Check for conflict
                if (schedule[key]) {
                    firstConflict = `Conflict: "${course.subjectName}" overlaps with "${schedule[key].subjectName}" on ${day} at ${timeSlotStr}.`;
                    conflictingCourseId = course.id;
                    break; 
                }
                schedule[key] = course;
            }
            if (firstConflict) break;
        }

        if (firstConflict) {
            setConflictMessage(firstConflict);
            // Remove ONLY the conflicting course from the selection
            setSelectedCourseIds(prev => {
                const updated = new Set(prev);
                updated.delete(conflictingCourseId);
                return updated;
            });
            // Re-filter the courses to display everything EXCEPT the one that conflicted
            setGeneratedCourses(selectedCourses.filter(c => c.id !== conflictingCourseId));
        } else {
            setGeneratedCourses(selectedCourses);
        }
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
                    {generatedCourses.length > 0 ? (
                        <Timetable coursesToDisplay={generatedCourses} />
                    ) : (
                        <div className="text-center p-10 bg-white rounded-2xl shadow-inner border-2 border-dashed border-gray-300">
                            <p className="text-gray-500">Select courses and click "Generate" to view your timetable.</p>
                        </div>
                    )}
                </div>

            </main>
            
            <ConflictModal 
                conflictMessage={conflictMessage}
                onClose={() => setConflictMessage(null)} 
            />
            
            <footer className="mt-16 pb-8 text-center text-gray-500 text-sm">
                <div className="flex flex-col items-center gap-3">
                    <p className="font-medium">Made by Milan Prajapati</p>
                    <a 
                        href="https://github.com/milanprajapati571"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:text-gray-800 transition-all duration-300"
                    >
                        <Github size={18} />
                        <span className="font-semibold">GitHub</span>
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default App;