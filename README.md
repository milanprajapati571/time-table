

# 🎓 Interactive Course Timetable Builder

A modern, responsive web application built with React and Tailwind CSS that allows students to easily select their courses, generate a weekly timetable, and export it as an image. This tool simplifies semester planning by providing a clean visual schedule and automatically detecting conflicts.

## ✨ Features

* **Filter & Select**: Easily filter a large list of courses by department.
* **Dynamic Timetable Generation**: Instantly generates a clean, color-coded weekly timetable based on your selections.
* **Conflict Detection**: Automatically highlights any overlapping classes to prevent scheduling mistakes.
* **Responsive Design**: A clean and intuitive interface that works seamlessly on both desktop and mobile devices.
* **Export to PNG**: Download your final timetable as a high-quality PNG image with a single click.
* **CSV Data Processing**: Includes a Python script to automatically convert raw course data from a CSV file into a usable format for the application.

## 🚀 Tech Stack

* **Frontend**: React (with Vite)
* **Styling**: Tailwind CSS
* **Timetable Export**: html2canvas
* **Data Processing**: Python (with Pandas)

## 🛠️ Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

* Node.js (v16 or later)
* npm (comes with Node.js)
* Python (to run the data conversion script)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

Install the Python dependencies:

```bash
pip install pandas
```

### 3. Prepare the Course Data

Place your course list (e.g., `Time Table Generated List.csv`) in the `src/data/` directory.

Run the conversion script:

```bash
python src/data/converter.py
```

This will generate/update the `src/data/courseData.js` file, which the app imports.

### 4. Run the Development Server

```bash
npm run dev
```

Your app should now be running at:
👉 [http://localhost:5173](http://localhost:5173)

## 📂 File Structure

```
/src
├── /assets        # Static assets like images
├── /components    # Reusable React components (Timetable, CourseSelector, etc.)
├── /data          # Data files (CSV input, Python converter, JS output)
├── App.jsx        # Main application component and layout
├── index.css      # Tailwind CSS directives
└── main.jsx       # Main entry point for the React application
```


