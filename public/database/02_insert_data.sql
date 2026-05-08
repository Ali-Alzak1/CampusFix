-- CampusFix - Sample Data
-- Run after 01_create_tables.sql

-- Maintenance units
INSERT INTO maintenance_units (unit_name, description) VALUES
    ('Electrical Maintenance',  'Wiring, outlets, lighting circuits, and power issues.'),
    ('Mechanical Maintenance',  'Plumbing, water systems, elevators, mechanical equipment.'),
    ('HVAC',                    'Heating, ventilation, and air-conditioning systems.'),
    ('Cleaning Services',       'Janitorial, pest control, and general cleanliness.'),
    ('Construction & Civil',    'Furniture, doors, walls, flooring, structural repairs.');

-- Facility types
INSERT INTO facility_types (type_name, type_desc) VALUES
    ('Academic Building', 'Classrooms, labs, and faculty offices.'),
    ('Student Housing',   'On-campus dormitories and residential blocks.'),
    ('Dining Facility',   'Cafeterias, food courts, and dining halls.'),
    ('Sports Facility',   'Gyms, courts, pools, and athletic areas.'),
    ('Medical Center',    'Campus clinic and health services.'),
    ('Common Area',       'Restrooms, lounges, malls, and shared spaces.');

-- Facilities
INSERT INTO facilities (type_id, name, building_name, area_description) VALUES
    (1, 'Lecture Hall A',        'Building 14',    'Ground floor, east wing'),
    (1, 'Computer Lab 2',        'Building 24',    'Second floor, ICS department'),
    (1, 'Main Library',          'Building 22',    'All floors, central campus'),
    (2, 'Dorm Block A',          'Building 800',   'Rooms 100-220'),
    (2, 'Dorm Block D',          'Building 803',   'Rooms 100-180'),
    (3, 'Food Court',            'Student Mall',   'First floor, north entrance'),
    (3, 'Cafeteria 1',           'Building 16',    'Adjacent to main entrance'),
    (4, 'Main Gym',              'Sports Complex', 'East side, weight area'),
    (4, 'Swimming Pool',         'Sports Complex', 'Indoor pool, west wing'),
    (5, 'Campus Medical Clinic', 'Medical Center', 'Reception and triage area'),
    (6, 'Restrooms 2F',          'Building 14',    'Second floor, near elevators'),
    (6, 'Student Lounge',        'Student Mall',   'Second floor, study area');

-- Priority levels (rank 1 = most urgent)
INSERT INTO priority_levels (level_name, rank, sla_hours, color_code) VALUES
    ('Critical', 1,   4, '#FF0000'),
    ('High',     2,  24, '#FF8C00'),
    ('Medium',   3,  72, '#FFD700'),
    ('Low',      4, 168, '#32CD32'),
    ('Trivial',  5, 336, '#87CEEB');

-- Report statuses (lifecycle order)
INSERT INTO report_statuses (status_name, sort_order) VALUES
    ('Submitted',    1),
    ('Acknowledged', 2),
    ('In Progress',  3),
    ('Resolved',     4),
    ('Closed',       5),
    ('Rejected',     6);

-- Issue categories (with default priority and responsible unit)
INSERT INTO issue_categories (category_name, default_priority_id, default_unit_id) VALUES
    ('Air Conditioning',   3, 3),
    ('Plumbing',           2, 2),
    ('Water Leak',         1, 2),
    ('Electrical Issue',   2, 1),
    ('Lighting',           3, 1),
    ('Damaged Furniture',  4, 5),
    ('Door / Lock Issue',  3, 5),
    ('Cleanliness',        3, 4),
    ('Pest Issue',         2, 4),
    ('Broken Window',      2, 5);

-- Users (students, faculty, maintenance staff, admins)
INSERT INTO users (kfupm_id, unit_id, name, email, phone, role) VALUES
    ('S202250700', NULL, 'Ali Alzaki',          's202250700@kfupm.edu.sa',     '0551110001', 'student'),
    ('S202282700', NULL, 'Hussain Alsadah',     's202282700@kfupm.edu.sa',     '0551110002', 'student'),
    ('S202254380', NULL, 'Mhammed Aboalsaud',   's202254380@kfupm.edu.sa',     '0551110003', 'student'),
    ('S202231100', NULL, 'Khalid Al-Otaibi',    'k.alotaibi@kfupm.edu.sa',     '0551110004', 'student'),
    ('S202245612', NULL, 'Sara Al-Harbi',       's.alharbi@kfupm.edu.sa',      '0551110005', 'student'),
    ('S202267890', NULL, 'Omar Al-Qahtani',     'o.alqahtani@kfupm.edu.sa',    '0551110006', 'student'),
    ('F100200',    NULL, 'Dr. Yousef Al-Mulla', 'y.almulla@kfupm.edu.sa',      '0551120001', 'faculty'),
    ('F100201',    NULL, 'Dr. Layla Al-Sayegh', 'l.alsayegh@kfupm.edu.sa',     '0551120002', 'faculty'),
    ('M500301',    1,    'Ahmed Khan',          'ahmed.khan@kfupm.edu.sa',     '0551130001', 'maintenance_staff'),
    ('M500302',    2,    'Rashid Mansour',      'r.mansour@kfupm.edu.sa',      '0551130002', 'maintenance_staff'),
    ('M500303',    3,    'Tariq Al-Zahrani',    't.alzahrani@kfupm.edu.sa',    '0551130003', 'maintenance_staff'),
    ('M500304',    4,    'Saif Al-Dosari',      's.aldosari@kfupm.edu.sa',     '0551130004', 'maintenance_staff'),
    ('M500305',    5,    'Nasser Al-Ghamdi',    'n.alghamdi@kfupm.edu.sa',     '0551130005', 'maintenance_staff'),
    ('A900401',    NULL, 'Fahad Al-Otaibi',     'fahad.admin@kfupm.edu.sa',    '0551140001', 'admin'),
    ('A900402',    NULL, 'Mona Al-Rashid',      'mona.admin@kfupm.edu.sa',     '0551140002', 'admin');

-- Reports across all lifecycle states
INSERT INTO reports
    (user_id, facility_id, category_id, priority_id, status_id,
     title, description, submitted_at, updated_at, resolved_at)
VALUES
    (1,  1, 1, 3, 1, 'AC not cooling in Lecture Hall A',
     'Temperature is high; AC running but no cold air.',
     '2026-04-20 09:15:00', '2026-04-20 09:15:00', NULL),

    (2,  4, 3, 1, 2, 'Water leak under sink in Dorm 800',
     'Significant water on floor in room 142.',
     '2026-04-20 11:00:00', '2026-04-20 11:30:00', NULL),

    (3,  7, 2, 2, 3, 'Clogged drain in Cafeteria 1',
     'Sink in dishwashing area is fully blocked.',
     '2026-04-19 14:00:00', '2026-04-20 10:00:00', NULL),

    (4,  3, 5, 3, 4, 'Flickering lights in study area',
     'Two ceiling lights flicker on the second floor.',
     '2026-04-15 08:30:00', '2026-04-17 16:00:00', '2026-04-17 16:00:00'),

    (5,  2, 6, 4, 5, 'Broken chair in Computer Lab 2',
     'Chair leg is bent; unsafe to sit on.',
     '2026-04-10 13:45:00', '2026-04-14 09:00:00', '2026-04-13 11:00:00'),

    (6,  8, 4, 2, 3, 'Power outlet sparking in gym',
     'Outlet near treadmills sparks when used.',
     '2026-04-21 07:20:00', '2026-04-21 09:00:00', NULL),

    (1,  6, 9, 2, 4, 'Cockroach sighting in Food Court',
     'Multiple sightings near trash area.',
     '2026-04-12 19:00:00', '2026-04-14 18:00:00', '2026-04-14 18:00:00'),

    (2,  5, 7, 3, 1, 'Door lock not working - room 105',
     'Key turns but bolt does not retract.',
     '2026-04-22 08:00:00', '2026-04-22 08:00:00', NULL),

    (3, 11, 8, 3, 2, 'Restrooms not cleaned 2F Building 14',
     'No cleaning observed for 2 days.',
     '2026-04-21 16:00:00', '2026-04-22 09:00:00', NULL),

    (4, 12, 10, 2, 5, 'Cracked window in Student Lounge',
     'Glass cracked, possibly from impact.',
     '2026-04-05 12:00:00', '2026-04-09 10:00:00', '2026-04-08 14:00:00'),

    (5,  4, 1, 3, 3, 'AC noisy and weak in Dorm A',
     'Loud rattling and barely cools the room.',
     '2026-04-21 22:00:00', '2026-04-22 08:30:00', NULL),

    (7,  9, 2, 2, 1, 'Leaking shower head - pool changing room',
     'Leak continuous, water pooling.',
     '2026-04-22 10:00:00', '2026-04-22 10:00:00', NULL),

    (8, 10, 5, 2, 4, 'Lights out in clinic waiting area',
     'Most ceiling lights are off.',
     '2026-04-18 07:00:00', '2026-04-18 14:00:00', '2026-04-18 14:00:00'),

    (1,  1, 6, 4, 2, 'Two desks damaged in Lecture Hall A',
     'Desks have broken hinges.',
     '2026-04-19 11:00:00', '2026-04-20 09:00:00', NULL),

    (4,  3, 5, 4, 4, 'Reading lamp not working - shelf 12',
     'Dead bulb on study desk lamp.',
     '2026-04-08 15:00:00', '2026-04-10 13:00:00', '2026-04-10 13:00:00'),

    (6,  6, 1, 2, 5, 'AC dripping water onto tables',
     'Drip from ceiling vent over seating area.',
     '2026-03-28 12:00:00', '2026-04-02 09:00:00', '2026-04-01 17:00:00'),

    (3,  2, 4, 1, 1, 'Burning smell from lab outlet',
     'Smell coming from outlet near workstation 4.',
     '2026-04-22 11:30:00', '2026-04-22 11:30:00', NULL),

    (5,  6, 8, 3, 3, 'Tables dirty in Food Court',
     'Tables not wiped during peak hours.',
     '2026-04-21 13:00:00', '2026-04-22 10:00:00', NULL),

    (2,  5, 2, 2, 4, 'Toilet overflow - room 130',
     'Water overflowing, isolated for now.',
     '2026-04-16 06:00:00', '2026-04-16 12:00:00', '2026-04-16 12:00:00'),

    (7,  4, 10, 2, 2, 'Cracked window dorm room 220',
     'Window cracked, possible safety risk.',
     '2026-04-22 07:30:00', '2026-04-22 09:30:00', NULL),

    -- FINISHED DUMMY: full lifecycle Submitted → Closed
    (6,  3, 7, 3, 5, 'Broken door handle - Library entrance',
     'Main entrance door handle is loose and difficult to operate.',
     '2026-04-01 10:00:00', '2026-04-04 15:00:00', '2026-04-04 11:00:00'),

    -- RESOLVED DUMMY 1: pest issue in gym, status = Resolved
    (4,  8, 9, 2, 4, 'Pest sighting near gym storage room',
     'Ants observed around the storage area next to the weight room.',
     '2026-04-17 09:00:00', '2026-04-19 14:00:00', '2026-04-19 14:00:00'),

    -- RESOLVED DUMMY 2: lighting issue in dorm, status = Resolved
    (5,  5, 5, 3, 4, 'Hallway lights out in Dorm Block D',
     'Three hallway ceiling lights on the ground floor are not working.',
     '2026-04-18 20:00:00', '2026-04-20 11:00:00', '2026-04-20 11:00:00');

-- Assignments to maintenance staff
INSERT INTO assignments
    (report_id, staff_id, assigned_at, completed_at, resolution_notes)
VALUES
    (2,  10, '2026-04-20 11:30:00', NULL, NULL),
    (3,  10, '2026-04-20 10:00:00', NULL, NULL),
    (4,   9, '2026-04-15 10:00:00', '2026-04-17 16:00:00', 'Replaced two ballasts.'),
    (5,  13, '2026-04-10 15:00:00', '2026-04-13 11:00:00', 'Replaced damaged chair.'),
    (6,   9, '2026-04-21 09:00:00', NULL, NULL),
    (7,  12, '2026-04-13 09:00:00', '2026-04-14 18:00:00', 'Treated and sealed entry points.'),
    (9,  12, '2026-04-22 09:00:00', NULL, NULL),
    (10, 13, '2026-04-06 10:00:00', '2026-04-08 14:00:00', 'Window glass replaced.'),
    (11, 11, '2026-04-22 08:30:00', NULL, NULL),
    (13,  9, '2026-04-18 08:00:00', '2026-04-18 14:00:00', 'Replaced 8 fluorescent tubes.'),
    (14, 13, '2026-04-20 09:00:00', NULL, NULL),
    (15,  9, '2026-04-09 10:00:00', '2026-04-10 13:00:00', 'Replaced bulb and tested.'),
    (16, 11, '2026-03-29 10:00:00', '2026-04-01 17:00:00', 'Cleared blocked condensate line.'),
    (18, 12, '2026-04-22 10:00:00', NULL, NULL),
    (19, 10, '2026-04-16 07:00:00', '2026-04-16 12:00:00', 'Cleared blockage and replaced flush valve.'),
    (20, 13, '2026-04-22 09:30:00', NULL, NULL),
    (21, 13, '2026-04-02 09:00:00', '2026-04-04 11:00:00', 'Tightened and re-fitted door handle; fully operational.'),
    -- Assignment for resolved dummy 1 (report 22)
    (22, 12, '2026-04-17 10:00:00', '2026-04-19 14:00:00', 'Applied treatment and sealed entry points near storage.'),
    -- Assignment for resolved dummy 2 (report 23)
    (23,  9, '2026-04-19 08:00:00', '2026-04-20 11:00:00', 'Replaced three faulty ceiling light fixtures in hallway.');

-- Status change log
INSERT INTO status_logs
    (report_id, changed_by, old_status_id, new_status_id, changed_at, note)
VALUES
    (2,  14, 1, 2, '2026-04-20 11:30:00', 'Acknowledged by admin, dispatched to mechanical.'),
    (3,  14, 1, 2, '2026-04-19 15:00:00', 'Acknowledged.'),
    (3,  10, 2, 3, '2026-04-20 10:00:00', 'On site, beginning work.'),
    (4,  15, 1, 2, '2026-04-15 09:30:00', 'Acknowledged.'),
    (4,   9, 2, 3, '2026-04-15 10:00:00', 'Diagnostics started.'),
    (4,   9, 3, 4, '2026-04-17 16:00:00', 'Lights replaced; verified working.'),
    (5,  14, 1, 2, '2026-04-10 14:30:00', 'Acknowledged.'),
    (5,  13, 2, 3, '2026-04-10 15:00:00', 'Inspected damaged chair.'),
    (5,  13, 3, 4, '2026-04-13 11:00:00', 'Replaced.'),
    (5,  14, 4, 5, '2026-04-14 09:00:00', 'Closed after user confirmation.'),
    (6,  15, 1, 2, '2026-04-21 08:00:00', 'Flagged urgent.'),
    (6,   9, 2, 3, '2026-04-21 09:00:00', 'On site.'),
    (7,  14, 1, 2, '2026-04-13 08:00:00', 'Forwarded to cleaning.'),
    (7,  12, 2, 3, '2026-04-13 09:00:00', 'Inspecting.'),
    (7,  12, 3, 4, '2026-04-14 18:00:00', 'Treated and resolved.'),
    (9,  14, 1, 2, '2026-04-22 09:00:00', 'Sent to cleaning unit.'),
    (10, 15, 1, 2, '2026-04-06 09:00:00', 'Acknowledged.'),
    (10, 13, 2, 3, '2026-04-06 10:00:00', 'Glass measured for replacement.'),
    (10, 13, 3, 4, '2026-04-08 14:00:00', 'Window replaced.'),
    (10, 14, 4, 5, '2026-04-09 10:00:00', 'Closed after follow-up.'),
    (11, 14, 1, 2, '2026-04-22 08:00:00', 'Acknowledged.'),
    (11, 11, 2, 3, '2026-04-22 08:30:00', 'Investigating.'),
    (13, 15, 1, 2, '2026-04-18 07:30:00', 'Acknowledged.'),
    (13,  9, 2, 3, '2026-04-18 08:00:00', 'On site.'),
    (13,  9, 3, 4, '2026-04-18 14:00:00', 'All lights restored.'),
    (14, 14, 1, 2, '2026-04-20 09:00:00', 'Forwarded to construction unit.'),
    (15, 15, 1, 2, '2026-04-09 09:00:00', 'Acknowledged.'),
    (15,  9, 2, 3, '2026-04-09 10:00:00', 'Investigating.'),
    (15,  9, 3, 4, '2026-04-10 13:00:00', 'Replaced and verified.'),
    (16, 14, 1, 2, '2026-03-29 09:00:00', 'Acknowledged.'),
    (16, 11, 2, 3, '2026-03-29 10:00:00', 'On site.'),
    (16, 11, 3, 4, '2026-04-01 17:00:00', 'Issue resolved.'),
    (16, 14, 4, 5, '2026-04-02 09:00:00', 'Closed after monitoring.'),
    (18, 14, 1, 2, '2026-04-22 09:30:00', 'Forwarded to cleaning.'),
    (18, 12, 2, 3, '2026-04-22 10:00:00', 'Crew dispatched.'),
    (19, 15, 1, 2, '2026-04-16 06:30:00', 'Urgent acknowledgment.'),
    (19, 10, 2, 3, '2026-04-16 07:00:00', 'On site, isolating.'),
    (19, 10, 3, 4, '2026-04-16 12:00:00', 'Cleared and tested.'),
    (20, 14, 1, 2, '2026-04-22 09:30:00', 'Acknowledged; safety concern.'),
    (21, 14, 1, 2, '2026-04-01 10:30:00', 'Acknowledged; forwarded to construction unit.'),
    (21, 13, 2, 3, '2026-04-02 09:00:00', 'Staff on site, assessing handle.'),
    (21, 13, 3, 4, '2026-04-04 11:00:00', 'Handle repaired and tested.'),
    (21, 14, 4, 5, '2026-04-04 15:00:00', 'Closed after user confirmation. No further issues reported.'),
    -- Status logs for resolved dummy 1 (report 22)
    (22, 14, 1, 2, '2026-04-17 09:30:00', 'Acknowledged; forwarded to cleaning services.'),
    (22, 12, 2, 3, '2026-04-17 10:00:00', 'On site, inspecting gym storage area.'),
    (22, 12, 3, 4, '2026-04-19 14:00:00', 'Treatment applied; entry points sealed. Resolved.'),
    -- Status logs for resolved dummy 2 (report 23)
    (23, 15, 1, 2, '2026-04-18 20:30:00', 'Acknowledged; forwarded to electrical maintenance.'),
    (23,  9, 2, 3, '2026-04-19 08:00:00', 'On site, diagnosing hallway lighting.'),
    (23,  9, 3, 4, '2026-04-20 11:00:00', 'All three fixtures replaced and tested. Resolved.');
