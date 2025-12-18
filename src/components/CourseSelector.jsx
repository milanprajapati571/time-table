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
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesDept = filter === 'all' || course.dept === filter;
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
                course.subjectName.toLowerCase().includes(searchLower) ||
                course.courseCode.toLowerCase().includes(searchLower) ||
                course.profName.toLowerCase().includes(searchLower);
            
            return matchesDept && matchesSearch;
        });
    }, [filter, searchTerm, courses]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col h-full border border-gray-100">
            <h2 className="text-center text-2xl font-semibold mb-4 border-b pb-2 text-indigo-900">Select Your Courses</h2>
            
            <div className="mb-4">
                <label htmlFor="course-search" className="block text-sm font-medium text-gray-700 mb-1 text-left">Search Course:</label>
                <div className="relative">
                    <input 
                        type="text"
                        id="course-search"
                        placeholder="Type subject, code, or professor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2.5 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="mb-6 text-left">
                <label htmlFor="dept-filter" className="block text-sm font-medium text-gray-700 mb-2">Filter by Department:</label>
                <select 
                    id="dept-filter" 
                    value={filter} 
                    onChange={e => setFilter(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
                >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>
                            {getDeptFullName(dept)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-3 h-96 overflow-y-auto pr-2 flex-grow text-left custom-scrollbar">
                {filteredCourses.length > 0 ? filteredCourses.map(course => (
                    <div key={course.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition border-gray-100">
                        <input 
                            type="checkbox" 
                            id={`course-${course.id}`} 
                            value={course.id}
                            checked={selectedCourseIds.has(course.id)}
                            onChange={() => onCourseToggle(course.id)}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4 flex-shrink-0 cursor-pointer"
                        />
                        <label htmlFor={`course-${course.id}`} className="flex-grow cursor-pointer min-w-0">
                            <p className="font-semibold truncate text-indigo-950">{course.subjectName} ({course.courseCode})</p>
                            <p className="text-sm text-gray-600 truncate">{course.profName}</p>
                        </label>
                    </div>
                )) : (
                    <p className="text-gray-400 text-center py-10 text-sm">No courses found matching your criteria.</p>
                )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                    onClick={onGenerate} 
                    className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                >
                    Generate Timetable
                </button>
                <button 
                    onClick={() => { onClear(); setSearchTerm(''); setFilter('all'); }} 
                    className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default CourseSelector;