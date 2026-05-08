/**
 * Seed data — mirrors 02_insert_data.sql.
 * Kept normalized (like the DB). API services join/derive from this.
 *
 * When you swap to a real backend, delete the in-memory exports here
 * and have api/* services hit your Express endpoints instead.
 */

export const maintenance_units = [
  { unit_id: 1, unit_name: 'Electrical Maintenance', description: 'Wiring, outlets, lighting circuits, and power issues.' },
  { unit_id: 2, unit_name: 'Mechanical Maintenance', description: 'Plumbing, water systems, elevators, mechanical equipment.' },
  { unit_id: 3, unit_name: 'HVAC',                   description: 'Heating, ventilation, and air-conditioning systems.' },
  { unit_id: 4, unit_name: 'Cleaning Services',      description: 'Janitorial, pest control, and general cleanliness.' },
  { unit_id: 5, unit_name: 'Construction & Civil',   description: 'Furniture, doors, walls, flooring, structural repairs.' }
];

export const facility_types = [
  { type_id: 1, type_name: 'Academic Building', type_desc: 'Classrooms, labs, and faculty offices.' },
  { type_id: 2, type_name: 'Student Housing',   type_desc: 'On-campus dormitories and residential blocks.' },
  { type_id: 3, type_name: 'Dining Facility',   type_desc: 'Cafeterias, food courts, and dining halls.' },
  { type_id: 4, type_name: 'Sports Facility',   type_desc: 'Gyms, courts, pools, and athletic areas.' },
  { type_id: 5, type_name: 'Medical Center',    type_desc: 'Campus clinic and health services.' },
  { type_id: 6, type_name: 'Common Area',       type_desc: 'Restrooms, lounges, malls, and shared spaces.' }
];

export const facilities = [
  { facility_id: 1,  type_id: 1, name: 'Lecture Hall A',        building_name: 'Building 14',    area_description: 'Ground floor, east wing' },
  { facility_id: 2,  type_id: 1, name: 'Computer Lab 2',        building_name: 'Building 24',    area_description: 'Second floor, ICS department' },
  { facility_id: 3,  type_id: 1, name: 'Main Library',          building_name: 'Building 22',    area_description: 'All floors, central campus' },
  { facility_id: 4,  type_id: 2, name: 'Dorm Block A',          building_name: 'Building 800',   area_description: 'Rooms 100-220' },
  { facility_id: 5,  type_id: 2, name: 'Dorm Block D',          building_name: 'Building 803',   area_description: 'Rooms 100-180' },
  { facility_id: 6,  type_id: 3, name: 'Food Court',            building_name: 'Student Mall',   area_description: 'First floor, north entrance' },
  { facility_id: 7,  type_id: 3, name: 'Cafeteria 1',           building_name: 'Building 16',    area_description: 'Adjacent to main entrance' },
  { facility_id: 8,  type_id: 4, name: 'Main Gym',              building_name: 'Sports Complex', area_description: 'East side, weight area' },
  { facility_id: 9,  type_id: 4, name: 'Swimming Pool',         building_name: 'Sports Complex', area_description: 'Indoor pool, west wing' },
  { facility_id: 10, type_id: 5, name: 'Campus Medical Clinic', building_name: 'Medical Center', area_description: 'Reception and triage area' },
  { facility_id: 11, type_id: 6, name: 'Restrooms 2F',          building_name: 'Building 14',    area_description: 'Second floor, near elevators' },
  { facility_id: 12, type_id: 6, name: 'Student Lounge',        building_name: 'Student Mall',   area_description: 'Second floor, study area' }
];

export const priority_levels = [
  { priority_id: 1, level_name: 'Critical', rank: 1, sla_hours: 4,   color_code: '#FF0000' },
  { priority_id: 2, level_name: 'High',     rank: 2, sla_hours: 24,  color_code: '#FF8C00' },
  { priority_id: 3, level_name: 'Medium',   rank: 3, sla_hours: 72,  color_code: '#FFD700' },
  { priority_id: 4, level_name: 'Low',      rank: 4, sla_hours: 168, color_code: '#32CD32' },
  { priority_id: 5, level_name: 'Trivial',  rank: 5, sla_hours: 336, color_code: '#87CEEB' }
];

export const report_statuses = [
  { status_id: 1, status_name: 'Submitted',    sort_order: 1 },
  { status_id: 2, status_name: 'Acknowledged', sort_order: 2 },
  { status_id: 3, status_name: 'In Progress',  sort_order: 3 },
  { status_id: 4, status_name: 'Resolved',     sort_order: 4 },
  { status_id: 5, status_name: 'Closed',       sort_order: 5 },
  { status_id: 6, status_name: 'Rejected',     sort_order: 6 }
];

export const issue_categories = [
  { category_id: 1,  category_name: 'Air Conditioning',  default_priority_id: 3, default_unit_id: 3 },
  { category_id: 2,  category_name: 'Plumbing',          default_priority_id: 2, default_unit_id: 2 },
  { category_id: 3,  category_name: 'Water Leak',        default_priority_id: 1, default_unit_id: 2 },
  { category_id: 4,  category_name: 'Electrical Issue',  default_priority_id: 2, default_unit_id: 1 },
  { category_id: 5,  category_name: 'Lighting',          default_priority_id: 3, default_unit_id: 1 },
  { category_id: 6,  category_name: 'Damaged Furniture', default_priority_id: 4, default_unit_id: 5 },
  { category_id: 7,  category_name: 'Door / Lock Issue', default_priority_id: 3, default_unit_id: 5 },
  { category_id: 8,  category_name: 'Cleanliness',       default_priority_id: 3, default_unit_id: 4 },
  { category_id: 9,  category_name: 'Pest Issue',        default_priority_id: 2, default_unit_id: 4 },
  { category_id: 10, category_name: 'Broken Window',     default_priority_id: 2, default_unit_id: 5 }
];

export const users = [
  { user_id: 1,  kfupm_id: 'S202250700', unit_id: null, name: 'Ali Alzaki',          email: 's202250700@kfupm.edu.sa',   phone: '0551110001', role: 'student' },
  { user_id: 2,  kfupm_id: 'S202282700', unit_id: null, name: 'Hussain Alsadah',     email: 's202282700@kfupm.edu.sa',   phone: '0551110002', role: 'student' },
  { user_id: 3,  kfupm_id: 'S202254380', unit_id: null, name: 'Mhammed Aboalsaud',   email: 's202254380@kfupm.edu.sa',   phone: '0551110003', role: 'student' },
  { user_id: 4,  kfupm_id: 'S202231100', unit_id: null, name: 'Khalid Al-Otaibi',    email: 'k.alotaibi@kfupm.edu.sa',   phone: '0551110004', role: 'student' },
  { user_id: 5,  kfupm_id: 'S202245612', unit_id: null, name: 'Sara Al-Harbi',       email: 's.alharbi@kfupm.edu.sa',    phone: '0551110005', role: 'student' },
  { user_id: 6,  kfupm_id: 'S202267890', unit_id: null, name: 'Omar Al-Qahtani',     email: 'o.alqahtani@kfupm.edu.sa',  phone: '0551110006', role: 'student' },
  { user_id: 7,  kfupm_id: 'F100200',    unit_id: null, name: 'Dr. Yousef Al-Mulla', email: 'y.almulla@kfupm.edu.sa',    phone: '0551120001', role: 'faculty' },
  { user_id: 8,  kfupm_id: 'F100201',    unit_id: null, name: 'Dr. Layla Al-Sayegh', email: 'l.alsayegh@kfupm.edu.sa',   phone: '0551120002', role: 'faculty' },
  { user_id: 9,  kfupm_id: 'M500301',    unit_id: 1,    name: 'Ahmed Khan',          email: 'ahmed.khan@kfupm.edu.sa',   phone: '0551130001', role: 'maintenance_staff' },
  { user_id: 10, kfupm_id: 'M500302',    unit_id: 2,    name: 'Rashid Mansour',      email: 'r.mansour@kfupm.edu.sa',    phone: '0551130002', role: 'maintenance_staff' },
  { user_id: 11, kfupm_id: 'M500303',    unit_id: 3,    name: 'Tariq Al-Zahrani',    email: 't.alzahrani@kfupm.edu.sa',  phone: '0551130003', role: 'maintenance_staff' },
  { user_id: 12, kfupm_id: 'M500304',    unit_id: 4,    name: 'Saif Al-Dosari',      email: 's.aldosari@kfupm.edu.sa',   phone: '0551130004', role: 'maintenance_staff' },
  { user_id: 13, kfupm_id: 'M500305',    unit_id: 5,    name: 'Nasser Al-Ghamdi',    email: 'n.alghamdi@kfupm.edu.sa',   phone: '0551130005', role: 'maintenance_staff' },
  { user_id: 14, kfupm_id: 'A900401',    unit_id: null, name: 'Fahad Al-Otaibi',     email: 'fahad.admin@kfupm.edu.sa',  phone: '0551140001', role: 'admin' },
  { user_id: 15, kfupm_id: 'A900402',    unit_id: null, name: 'Mona Al-Rashid',      email: 'mona.admin@kfupm.edu.sa',   phone: '0551140002', role: 'admin' }
];

export const reports = [
  { report_id: 1,  user_id: 1, facility_id: 1,  category_id: 1,  priority_id: 3, status_id: 1, title: 'AC not cooling in Lecture Hall A',     description: 'Temperature is high; AC running but no cold air.',                  submitted_at: '2026-04-20 09:15:00', updated_at: '2026-04-20 09:15:00', resolved_at: null },
  { report_id: 2,  user_id: 2, facility_id: 4,  category_id: 3,  priority_id: 1, status_id: 2, title: 'Water leak under sink in Dorm 800',    description: 'Significant water on floor in room 142.',                          submitted_at: '2026-04-20 11:00:00', updated_at: '2026-04-20 11:30:00', resolved_at: null },
  { report_id: 3,  user_id: 3, facility_id: 7,  category_id: 2,  priority_id: 2, status_id: 3, title: 'Clogged drain in Cafeteria 1',         description: 'Sink in dishwashing area is fully blocked.',                        submitted_at: '2026-04-19 14:00:00', updated_at: '2026-04-20 10:00:00', resolved_at: null },
  { report_id: 4,  user_id: 4, facility_id: 3,  category_id: 5,  priority_id: 3, status_id: 4, title: 'Flickering lights in study area',      description: 'Two ceiling lights flicker on the second floor.',                   submitted_at: '2026-04-15 08:30:00', updated_at: '2026-04-17 16:00:00', resolved_at: '2026-04-17 16:00:00' },
  { report_id: 5,  user_id: 5, facility_id: 2,  category_id: 6,  priority_id: 4, status_id: 5, title: 'Broken chair in Computer Lab 2',       description: 'Chair leg is bent; unsafe to sit on.',                              submitted_at: '2026-04-10 13:45:00', updated_at: '2026-04-14 09:00:00', resolved_at: '2026-04-13 11:00:00' },
  { report_id: 6,  user_id: 6, facility_id: 8,  category_id: 4,  priority_id: 2, status_id: 3, title: 'Power outlet sparking in gym',         description: 'Outlet near treadmills sparks when used.',                          submitted_at: '2026-04-21 07:20:00', updated_at: '2026-04-21 09:00:00', resolved_at: null },
  { report_id: 7,  user_id: 1, facility_id: 6,  category_id: 9,  priority_id: 2, status_id: 4, title: 'Cockroach sighting in Food Court',     description: 'Multiple sightings near trash area.',                               submitted_at: '2026-04-12 19:00:00', updated_at: '2026-04-14 18:00:00', resolved_at: '2026-04-14 18:00:00' },
  { report_id: 8,  user_id: 2, facility_id: 5,  category_id: 7,  priority_id: 3, status_id: 1, title: 'Door lock not working - room 105',     description: 'Key turns but bolt does not retract.',                              submitted_at: '2026-04-22 08:00:00', updated_at: '2026-04-22 08:00:00', resolved_at: null },
  { report_id: 9,  user_id: 3, facility_id: 11, category_id: 8,  priority_id: 3, status_id: 2, title: 'Restrooms not cleaned 2F Building 14', description: 'No cleaning observed for 2 days.',                                  submitted_at: '2026-04-21 16:00:00', updated_at: '2026-04-22 09:00:00', resolved_at: null },
  { report_id: 10, user_id: 4, facility_id: 12, category_id: 10, priority_id: 2, status_id: 5, title: 'Cracked window in Student Lounge',     description: 'Glass cracked, possibly from impact.',                              submitted_at: '2026-04-05 12:00:00', updated_at: '2026-04-09 10:00:00', resolved_at: '2026-04-08 14:00:00' },
  { report_id: 11, user_id: 5, facility_id: 4,  category_id: 1,  priority_id: 3, status_id: 3, title: 'AC noisy and weak in Dorm A',          description: 'Loud rattling and barely cools the room.',                          submitted_at: '2026-04-21 22:00:00', updated_at: '2026-04-22 08:30:00', resolved_at: null },
  { report_id: 12, user_id: 7, facility_id: 9,  category_id: 2,  priority_id: 2, status_id: 1, title: 'Leaking shower head - pool changing room', description: 'Leak continuous, water pooling.',                                submitted_at: '2026-04-22 10:00:00', updated_at: '2026-04-22 10:00:00', resolved_at: null },
  { report_id: 13, user_id: 8, facility_id: 10, category_id: 5,  priority_id: 2, status_id: 4, title: 'Lights out in clinic waiting area',    description: 'Most ceiling lights are off.',                                      submitted_at: '2026-04-18 07:00:00', updated_at: '2026-04-18 14:00:00', resolved_at: '2026-04-18 14:00:00' },
  { report_id: 14, user_id: 1, facility_id: 1,  category_id: 6,  priority_id: 4, status_id: 2, title: 'Two desks damaged in Lecture Hall A',  description: 'Desks have broken hinges.',                                         submitted_at: '2026-04-19 11:00:00', updated_at: '2026-04-20 09:00:00', resolved_at: null },
  { report_id: 15, user_id: 4, facility_id: 3,  category_id: 5,  priority_id: 4, status_id: 4, title: 'Reading lamp not working - shelf 12',  description: 'Dead bulb on study desk lamp.',                                     submitted_at: '2026-04-08 15:00:00', updated_at: '2026-04-10 13:00:00', resolved_at: '2026-04-10 13:00:00' },
  { report_id: 16, user_id: 6, facility_id: 6,  category_id: 1,  priority_id: 2, status_id: 5, title: 'AC dripping water onto tables',        description: 'Drip from ceiling vent over seating area.',                         submitted_at: '2026-03-28 12:00:00', updated_at: '2026-04-02 09:00:00', resolved_at: '2026-04-01 17:00:00' },
  { report_id: 17, user_id: 3, facility_id: 2,  category_id: 4,  priority_id: 1, status_id: 1, title: 'Burning smell from lab outlet',        description: 'Smell coming from outlet near workstation 4.',                      submitted_at: '2026-04-22 11:30:00', updated_at: '2026-04-22 11:30:00', resolved_at: null },
  { report_id: 18, user_id: 5, facility_id: 6,  category_id: 8,  priority_id: 3, status_id: 3, title: 'Tables dirty in Food Court',           description: 'Tables not wiped during peak hours.',                               submitted_at: '2026-04-21 13:00:00', updated_at: '2026-04-22 10:00:00', resolved_at: null },
  { report_id: 19, user_id: 2, facility_id: 5,  category_id: 2,  priority_id: 2, status_id: 4, title: 'Toilet overflow - room 130',           description: 'Water overflowing, isolated for now.',                              submitted_at: '2026-04-16 06:00:00', updated_at: '2026-04-16 12:00:00', resolved_at: '2026-04-16 12:00:00' },
  { report_id: 20, user_id: 7, facility_id: 4,  category_id: 10, priority_id: 2, status_id: 2, title: 'Cracked window dorm room 220',         description: 'Window cracked, possible safety risk.',                             submitted_at: '2026-04-22 07:30:00', updated_at: '2026-04-22 09:30:00', resolved_at: null },
  { report_id: 21, user_id: 6, facility_id: 3,  category_id: 7,  priority_id: 3, status_id: 5, title: 'Broken door handle - Library entrance',description: 'Main entrance door handle is loose and difficult to operate.',      submitted_at: '2026-04-01 10:00:00', updated_at: '2026-04-04 15:00:00', resolved_at: '2026-04-04 11:00:00' },
  { report_id: 22, user_id: 4, facility_id: 8,  category_id: 9,  priority_id: 2, status_id: 4, title: 'Pest sighting near gym storage room',  description: 'Ants observed around the storage area next to the weight room.',    submitted_at: '2026-04-17 09:00:00', updated_at: '2026-04-19 14:00:00', resolved_at: '2026-04-19 14:00:00' },
  { report_id: 23, user_id: 5, facility_id: 5,  category_id: 5,  priority_id: 3, status_id: 4, title: 'Hallway lights out in Dorm Block D',   description: 'Three hallway ceiling lights on the ground floor are not working.', submitted_at: '2026-04-18 20:00:00', updated_at: '2026-04-20 11:00:00', resolved_at: '2026-04-20 11:00:00' }
];

export const assignments = [
  { assignment_id: 1,  report_id: 2,  staff_id: 10, assigned_at: '2026-04-20 11:30:00', completed_at: null,                  resolution_notes: null },
  { assignment_id: 2,  report_id: 3,  staff_id: 10, assigned_at: '2026-04-20 10:00:00', completed_at: null,                  resolution_notes: null },
  { assignment_id: 3,  report_id: 4,  staff_id: 9,  assigned_at: '2026-04-15 10:00:00', completed_at: '2026-04-17 16:00:00', resolution_notes: 'Replaced two ballasts.' },
  { assignment_id: 4,  report_id: 5,  staff_id: 13, assigned_at: '2026-04-10 15:00:00', completed_at: '2026-04-13 11:00:00', resolution_notes: 'Replaced damaged chair.' },
  { assignment_id: 5,  report_id: 6,  staff_id: 9,  assigned_at: '2026-04-21 09:00:00', completed_at: null,                  resolution_notes: null },
  { assignment_id: 6,  report_id: 7,  staff_id: 12, assigned_at: '2026-04-13 09:00:00', completed_at: '2026-04-14 18:00:00', resolution_notes: 'Treated and sealed entry points.' },
  { assignment_id: 7,  report_id: 9,  staff_id: 12, assigned_at: '2026-04-22 09:00:00', completed_at: null,                  resolution_notes: null },
  { assignment_id: 8,  report_id: 10, staff_id: 13, assigned_at: '2026-04-06 10:00:00', completed_at: '2026-04-08 14:00:00', resolution_notes: 'Window glass replaced.' },
  { assignment_id: 9,  report_id: 11, staff_id: 11, assigned_at: '2026-04-22 08:30:00', completed_at: null,                  resolution_notes: null },
  { assignment_id: 10, report_id: 13, staff_id: 9,  assigned_at: '2026-04-18 08:00:00', completed_at: '2026-04-18 14:00:00', resolution_notes: 'Replaced 8 fluorescent tubes.' },
  { assignment_id: 11, report_id: 14, staff_id: 13, assigned_at: '2026-04-20 09:00:00', completed_at: null,                  resolution_notes: null },
  { assignment_id: 12, report_id: 15, staff_id: 9,  assigned_at: '2026-04-09 10:00:00', completed_at: '2026-04-10 13:00:00', resolution_notes: 'Replaced bulb and tested.' },
  { assignment_id: 13, report_id: 16, staff_id: 11, assigned_at: '2026-03-29 10:00:00', completed_at: '2026-04-01 17:00:00', resolution_notes: 'Cleared blocked condensate line.' },
  { assignment_id: 14, report_id: 18, staff_id: 12, assigned_at: '2026-04-22 10:00:00', completed_at: null,                  resolution_notes: null },
  { assignment_id: 15, report_id: 19, staff_id: 10, assigned_at: '2026-04-16 07:00:00', completed_at: '2026-04-16 12:00:00', resolution_notes: 'Cleared blockage and replaced flush valve.' },
  { assignment_id: 16, report_id: 20, staff_id: 13, assigned_at: '2026-04-22 09:30:00', completed_at: null,                  resolution_notes: null },
  { assignment_id: 17, report_id: 21, staff_id: 13, assigned_at: '2026-04-02 09:00:00', completed_at: '2026-04-04 11:00:00', resolution_notes: 'Tightened and re-fitted door handle; fully operational.' },
  { assignment_id: 18, report_id: 22, staff_id: 12, assigned_at: '2026-04-17 10:00:00', completed_at: '2026-04-19 14:00:00', resolution_notes: 'Applied treatment and sealed entry points near storage.' },
  { assignment_id: 19, report_id: 23, staff_id: 9,  assigned_at: '2026-04-19 08:00:00', completed_at: '2026-04-20 11:00:00', resolution_notes: 'Replaced three faulty ceiling light fixtures in hallway.' }
];

export const status_logs = [
  { log_id: 1,  report_id: 2,  changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-20 11:30:00', note: 'Acknowledged by admin, dispatched to mechanical.' },
  { log_id: 2,  report_id: 3,  changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-19 15:00:00', note: 'Acknowledged.' },
  { log_id: 3,  report_id: 3,  changed_by: 10, old_status_id: 2, new_status_id: 3, changed_at: '2026-04-20 10:00:00', note: 'On site, beginning work.' },
  { log_id: 4,  report_id: 4,  changed_by: 15, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-15 09:30:00', note: 'Acknowledged.' },
  { log_id: 5,  report_id: 4,  changed_by: 9,  old_status_id: 2, new_status_id: 3, changed_at: '2026-04-15 10:00:00', note: 'Diagnostics started.' },
  { log_id: 6,  report_id: 4,  changed_by: 9,  old_status_id: 3, new_status_id: 4, changed_at: '2026-04-17 16:00:00', note: 'Lights replaced; verified working.' },
  { log_id: 7,  report_id: 5,  changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-10 14:30:00', note: 'Acknowledged.' },
  { log_id: 8,  report_id: 5,  changed_by: 13, old_status_id: 2, new_status_id: 3, changed_at: '2026-04-10 15:00:00', note: 'Inspected damaged chair.' },
  { log_id: 9,  report_id: 5,  changed_by: 13, old_status_id: 3, new_status_id: 4, changed_at: '2026-04-13 11:00:00', note: 'Replaced.' },
  { log_id: 10, report_id: 5,  changed_by: 14, old_status_id: 4, new_status_id: 5, changed_at: '2026-04-14 09:00:00', note: 'Closed after user confirmation.' },
  { log_id: 11, report_id: 6,  changed_by: 15, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-21 08:00:00', note: 'Flagged urgent.' },
  { log_id: 12, report_id: 6,  changed_by: 9,  old_status_id: 2, new_status_id: 3, changed_at: '2026-04-21 09:00:00', note: 'On site.' },
  { log_id: 13, report_id: 7,  changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-13 08:00:00', note: 'Forwarded to cleaning.' },
  { log_id: 14, report_id: 7,  changed_by: 12, old_status_id: 2, new_status_id: 3, changed_at: '2026-04-13 09:00:00', note: 'Inspecting.' },
  { log_id: 15, report_id: 7,  changed_by: 12, old_status_id: 3, new_status_id: 4, changed_at: '2026-04-14 18:00:00', note: 'Treated and resolved.' },
  { log_id: 16, report_id: 9,  changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-22 09:00:00', note: 'Sent to cleaning unit.' },
  { log_id: 17, report_id: 10, changed_by: 15, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-06 09:00:00', note: 'Acknowledged.' },
  { log_id: 18, report_id: 10, changed_by: 13, old_status_id: 2, new_status_id: 3, changed_at: '2026-04-06 10:00:00', note: 'Glass measured for replacement.' },
  { log_id: 19, report_id: 10, changed_by: 13, old_status_id: 3, new_status_id: 4, changed_at: '2026-04-08 14:00:00', note: 'Window replaced.' },
  { log_id: 20, report_id: 10, changed_by: 14, old_status_id: 4, new_status_id: 5, changed_at: '2026-04-09 10:00:00', note: 'Closed after follow-up.' },
  { log_id: 21, report_id: 11, changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-22 08:00:00', note: 'Acknowledged.' },
  { log_id: 22, report_id: 11, changed_by: 11, old_status_id: 2, new_status_id: 3, changed_at: '2026-04-22 08:30:00', note: 'Investigating.' },
  { log_id: 23, report_id: 13, changed_by: 15, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-18 07:30:00', note: 'Acknowledged.' },
  { log_id: 24, report_id: 13, changed_by: 9,  old_status_id: 2, new_status_id: 3, changed_at: '2026-04-18 08:00:00', note: 'On site.' },
  { log_id: 25, report_id: 13, changed_by: 9,  old_status_id: 3, new_status_id: 4, changed_at: '2026-04-18 14:00:00', note: 'All lights restored.' },
  { log_id: 26, report_id: 14, changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-20 09:00:00', note: 'Forwarded to construction unit.' },
  { log_id: 27, report_id: 15, changed_by: 15, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-09 09:00:00', note: 'Acknowledged.' },
  { log_id: 28, report_id: 15, changed_by: 9,  old_status_id: 2, new_status_id: 3, changed_at: '2026-04-09 10:00:00', note: 'Investigating.' },
  { log_id: 29, report_id: 15, changed_by: 9,  old_status_id: 3, new_status_id: 4, changed_at: '2026-04-10 13:00:00', note: 'Replaced and verified.' },
  { log_id: 30, report_id: 16, changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-03-29 09:00:00', note: 'Acknowledged.' },
  { log_id: 31, report_id: 16, changed_by: 11, old_status_id: 2, new_status_id: 3, changed_at: '2026-03-29 10:00:00', note: 'On site.' },
  { log_id: 32, report_id: 16, changed_by: 11, old_status_id: 3, new_status_id: 4, changed_at: '2026-04-01 17:00:00', note: 'Issue resolved.' },
  { log_id: 33, report_id: 16, changed_by: 14, old_status_id: 4, new_status_id: 5, changed_at: '2026-04-02 09:00:00', note: 'Closed after monitoring.' },
  { log_id: 34, report_id: 18, changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-22 09:30:00', note: 'Forwarded to cleaning.' },
  { log_id: 35, report_id: 18, changed_by: 12, old_status_id: 2, new_status_id: 3, changed_at: '2026-04-22 10:00:00', note: 'Crew dispatched.' },
  { log_id: 36, report_id: 19, changed_by: 15, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-16 06:30:00', note: 'Urgent acknowledgment.' },
  { log_id: 37, report_id: 19, changed_by: 10, old_status_id: 2, new_status_id: 3, changed_at: '2026-04-16 07:00:00', note: 'On site, isolating.' },
  { log_id: 38, report_id: 19, changed_by: 10, old_status_id: 3, new_status_id: 4, changed_at: '2026-04-16 12:00:00', note: 'Cleared and tested.' },
  { log_id: 39, report_id: 20, changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-22 09:30:00', note: 'Acknowledged; safety concern.' },
  { log_id: 40, report_id: 21, changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-01 10:30:00', note: 'Acknowledged; forwarded to construction unit.' },
  { log_id: 41, report_id: 21, changed_by: 13, old_status_id: 2, new_status_id: 3, changed_at: '2026-04-02 09:00:00', note: 'Staff on site, assessing handle.' },
  { log_id: 42, report_id: 21, changed_by: 13, old_status_id: 3, new_status_id: 4, changed_at: '2026-04-04 11:00:00', note: 'Handle repaired and tested.' },
  { log_id: 43, report_id: 21, changed_by: 14, old_status_id: 4, new_status_id: 5, changed_at: '2026-04-04 15:00:00', note: 'Closed after user confirmation. No further issues reported.' },
  { log_id: 44, report_id: 22, changed_by: 14, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-17 09:30:00', note: 'Acknowledged; forwarded to cleaning services.' },
  { log_id: 45, report_id: 22, changed_by: 12, old_status_id: 2, new_status_id: 3, changed_at: '2026-04-17 10:00:00', note: 'On site, inspecting gym storage area.' },
  { log_id: 46, report_id: 22, changed_by: 12, old_status_id: 3, new_status_id: 4, changed_at: '2026-04-19 14:00:00', note: 'Treatment applied; entry points sealed. Resolved.' },
  { log_id: 47, report_id: 23, changed_by: 15, old_status_id: 1, new_status_id: 2, changed_at: '2026-04-18 20:30:00', note: 'Acknowledged; forwarded to electrical maintenance.' },
  { log_id: 48, report_id: 23, changed_by: 9,  old_status_id: 2, new_status_id: 3, changed_at: '2026-04-19 08:00:00', note: 'On site, diagnosing hallway lighting.' },
  { log_id: 49, report_id: 23, changed_by: 9,  old_status_id: 3, new_status_id: 4, changed_at: '2026-04-20 11:00:00', note: 'All three fixtures replaced and tested. Resolved.' }
];
