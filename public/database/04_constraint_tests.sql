-- Optional: tests that prove the CHECK constraints reject invalid data.
-- Each statement below should FAIL with a specific error.
-- Run them one at a time to see the constraint violation messages.

-- Test 1: a student should not be allowed to belong to a maintenance unit
INSERT INTO users (kfupm_id, unit_id, name, email, role)
VALUES ('TEST001', 1, 'Bad Student', 'bad1@kfupm.edu.sa', 'student');

-- Test 2: resolved_at cannot be before submitted_at
INSERT INTO reports (user_id, facility_id, category_id, priority_id, status_id,
                     title, submitted_at, updated_at, resolved_at)
VALUES (1, 1, 1, 3, 4, 'Bad time order',
        '2026-04-22 10:00:00', '2026-04-22 10:00:00', '2026-04-21 10:00:00');

-- Test 3: role must be one of the allowed values
INSERT INTO users (kfupm_id, name, email, role)
VALUES ('TEST002', 'Bad Role', 'bad2@kfupm.edu.sa', 'unknown');
