import csv
import re
import json

CSV_FILE_PATH = 'src/data/Time Table Generated List.csv'
OUTPUT_FILE_PATH = 'src/data/courseData.js'

def parse_course_field(course_str):
    match = re.match(r'([A-Z0-9]+)\((.+)\)', course_str)
    if match:
        return match.group(1), match.group(2)
    return course_str, ""

def parse_timetable_field(timetable_str):
    pattern = r'(Monday|Tuesday|Wednesday|Thursday|Friday)\s+(\d{2}:\d{2}-\d{2}:\d{2})'
    matches = re.findall(pattern, timetable_str)
    
    day_abbr = {
        'Monday': 'Mon', 'Tuesday': 'Tue', 'Wednesday': 'Wed', 
        'Thursday': 'Thu', 'Friday': 'Fri'
    }
    
    formatted_slots = [f"{day_abbr[day]} {time}" for day, time in matches]
    return ', '.join(formatted_slots)

def convert_csv_to_js():
    course_list = []
    
    try:
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            
            for row in csv_reader:
                if not row.get('Sl No.'):
                    continue

                course_code, subject_name = parse_course_field(row['Course'])
                time_slot = parse_timetable_field(row['Time Table'])

                course_object = {
                    'id': int(row['Sl No.']),
                    'subjectName': subject_name,
                    'courseCode': course_code,
                    'profName': row['Instructor name'].replace('  ', ' '),
                    'dept': row['Department'],
                    'timeSlot': time_slot
                }
                course_list.append(course_object)

        with open(OUTPUT_FILE_PATH, mode='w', encoding='utf-8') as js_file:
            js_file.write('export const courseData = ')
            json.dump(course_list, js_file, indent=2)
            js_file.write(';\n')
            
        print(f" Success! Converted {len(course_list)} courses.")
        print(f"Your file is ready at: {OUTPUT_FILE_PATH}")

    except FileNotFoundError:
        print(f" Error: The file '{CSV_FILE_PATH}' was not found.")
        print("Please make sure the script is in the same folder as your CSV file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    convert_csv_to_js()
