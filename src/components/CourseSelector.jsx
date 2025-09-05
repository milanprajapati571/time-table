import React, { useState, useMemo } from 'react';

const departmentMap = {
    'agl': 'Applied Geology',
    'ce': 'Chemical Engineering',
    'me': 'Minning Engineering',
    'cse': 'Computer Science and Engineering',
    'ee': 'Electrical Engineering',
    'mc': 'Mathematics and Computing',
    'pe': 'Petroleum Engineering',
    'cve': 'Civil Engineering',
    'agp': 'Appiled Geophysics',
    'ece': 'Electronics and Communication Engineering',
    'ese': 'Environmental Engineering',
    'fme': 'Fuel and Minerals Engineering',
    'mech': 'Mechanical Engineering',
    'phy': 'Engineering Physics',
};

const getDeptFullName = (abbr) => {
    return departmentMap[abbr] || abbr.toUpperCase();
};

const CourseSelector = ({ courses, departments, selectedCourseIds, onCourseToggle, onGenerate, onClear }) => {
    const [filter, setFilter] = useState('all');

    const filteredCourses = useMemo(() => {
        if (filter === 'all') return courses;
        return courses.filter(course => course.dept === filter);
    }, [filter, courses]);

    return (
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg flex flex-col">
            <h2 className="text-center text-2xl font-semibold mb-4 border-b pb-2">Select Your Courses</h2>
            
            <div className="mb-6">
                <label htmlFor="dept-filter" className="block text-sm font-medium text-gray-700 mb-2">Filter by Department:</label>
                <select 
                    id="dept-filter" 
                    value={filter} 
                    onChange={e => setFilter(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>
                            {getDeptFullName(dept)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-3 h-96 overflow-y-auto pr-2 flex-grow">
                {filteredCourses.length > 0 ? filteredCourses.map(course => (
                    <div key={course.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition">
                        <input 
                            type="checkbox" 
                            id={`course-${course.id}`} 
                            value={course.id}
                            checked={selectedCourseIds.has(course.id)}
                            onChange={() => onCourseToggle(course.id)}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4 flex-shrink-0"
                        />
                        <label htmlFor={`course-${course.id}`} className="flex-grow cursor-pointer min-w-0">
                            <p className="font-semibold truncate">{course.subjectName} ({course.courseCode})</p>
                            <p className="text-sm text-gray-600 truncate">{course.profName}</p>
                        </label>
                    </div>
                )) : <p className="text-gray-500 text-center p-4">No courses found for this department.</p>}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button onClick={onGenerate} className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                    Generate Timetable
                </button>
                <button onClick={onClear} className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition">
                    Clear
                </button>
            </div>
        </div>
    );
};

export default CourseSelector;
