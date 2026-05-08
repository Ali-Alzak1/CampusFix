-- CampusFix - Schema (PostgreSQL)
-- ICS 321 Project, T252

DROP TABLE IF EXISTS status_logs       CASCADE;
DROP TABLE IF EXISTS assignments       CASCADE;
DROP TABLE IF EXISTS reports           CASCADE;
DROP TABLE IF EXISTS issue_categories  CASCADE;
DROP TABLE IF EXISTS users             CASCADE;
DROP TABLE IF EXISTS facilities        CASCADE;
DROP TABLE IF EXISTS facility_types    CASCADE;
DROP TABLE IF EXISTS maintenance_units CASCADE;
DROP TABLE IF EXISTS priority_levels   CASCADE;
DROP TABLE IF EXISTS report_statuses   CASCADE;


CREATE TABLE maintenance_units (
    unit_id      SERIAL       PRIMARY KEY,
    unit_name    VARCHAR(100) NOT NULL UNIQUE,
    description  TEXT
);

CREATE TABLE facility_types (
    type_id    SERIAL       PRIMARY KEY,
    type_name  VARCHAR(100) NOT NULL UNIQUE,
    type_desc  TEXT
);

CREATE TABLE priority_levels (
    priority_id  SERIAL       PRIMARY KEY,
    level_name   VARCHAR(50)  NOT NULL UNIQUE,
    rank         INT          NOT NULL UNIQUE CHECK (rank > 0),
    sla_hours    INT          NOT NULL        CHECK (sla_hours > 0),
    color_code   VARCHAR(7)                   CHECK (color_code ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE report_statuses (
    status_id    SERIAL       PRIMARY KEY,
    status_name  VARCHAR(50)  NOT NULL UNIQUE,
    sort_order   INT          NOT NULL UNIQUE CHECK (sort_order >= 0)
);

CREATE TABLE facilities (
    facility_id      SERIAL       PRIMARY KEY,
    type_id          INT          NOT NULL,
    name             VARCHAR(150) NOT NULL,
    building_name    VARCHAR(100),
    area_description TEXT,
    CONSTRAINT fk_facility_type
        FOREIGN KEY (type_id) REFERENCES facility_types(type_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE issue_categories (
    category_id          SERIAL       PRIMARY KEY,
    category_name        VARCHAR(100) NOT NULL UNIQUE,
    default_priority_id  INT          NOT NULL,
    default_unit_id      INT          NOT NULL,
    CONSTRAINT fk_category_priority
        FOREIGN KEY (default_priority_id) REFERENCES priority_levels(priority_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_category_unit
        FOREIGN KEY (default_unit_id) REFERENCES maintenance_units(unit_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE users (
    user_id   SERIAL       PRIMARY KEY,
    kfupm_id  VARCHAR(20)  NOT NULL UNIQUE,
    unit_id   INT,
    name      VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    phone     VARCHAR(20),
    role      VARCHAR(20)  NOT NULL
              CHECK (role IN ('student','faculty','maintenance_staff','admin')),
    CONSTRAINT fk_user_unit
        FOREIGN KEY (unit_id) REFERENCES maintenance_units(unit_id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_user_unit_role
        CHECK ( (role = 'maintenance_staff' AND unit_id IS NOT NULL)
             OR (role <> 'maintenance_staff' AND unit_id IS NULL) )
);

CREATE TABLE reports (
    report_id    SERIAL       PRIMARY KEY,
    user_id      INT          NOT NULL,
    facility_id  INT          NOT NULL,
    category_id  INT          NOT NULL,
    priority_id  INT          NOT NULL,
    status_id    INT          NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    submitted_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at  TIMESTAMP,
    CONSTRAINT fk_report_user
        FOREIGN KEY (user_id)     REFERENCES users(user_id)              ON DELETE RESTRICT,
    CONSTRAINT fk_report_facility
        FOREIGN KEY (facility_id) REFERENCES facilities(facility_id)     ON DELETE RESTRICT,
    CONSTRAINT fk_report_category
        FOREIGN KEY (category_id) REFERENCES issue_categories(category_id) ON DELETE RESTRICT,
    CONSTRAINT fk_report_priority
        FOREIGN KEY (priority_id) REFERENCES priority_levels(priority_id)  ON DELETE RESTRICT,
    CONSTRAINT fk_report_status
        FOREIGN KEY (status_id)   REFERENCES report_statuses(status_id)    ON DELETE RESTRICT,
    CONSTRAINT chk_report_updated_after_submitted
        CHECK (updated_at >= submitted_at),
    CONSTRAINT chk_report_resolved_after_submitted
        CHECK (resolved_at IS NULL OR resolved_at >= submitted_at)
);

CREATE TABLE assignments (
    assignment_id    SERIAL    PRIMARY KEY,
    report_id        INT       NOT NULL,
    staff_id         INT       NOT NULL,
    assigned_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at     TIMESTAMP,
    resolution_notes TEXT,
    CONSTRAINT fk_assignment_report
        FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_staff
        FOREIGN KEY (staff_id)  REFERENCES users(user_id)     ON DELETE RESTRICT,
    CONSTRAINT chk_assignment_completed_after_assigned
        CHECK (completed_at IS NULL OR completed_at >= assigned_at)
);

CREATE TABLE status_logs (
    log_id        SERIAL    PRIMARY KEY,
    report_id     INT       NOT NULL,
    changed_by    INT       NOT NULL,
    old_status_id INT,
    new_status_id INT       NOT NULL,
    changed_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note          TEXT,
    CONSTRAINT fk_log_report
        FOREIGN KEY (report_id)     REFERENCES reports(report_id)        ON DELETE CASCADE,
    CONSTRAINT fk_log_user
        FOREIGN KEY (changed_by)    REFERENCES users(user_id)            ON DELETE RESTRICT,
    CONSTRAINT fk_log_old_status
        FOREIGN KEY (old_status_id) REFERENCES report_statuses(status_id) ON DELETE RESTRICT,
    CONSTRAINT fk_log_new_status
        FOREIGN KEY (new_status_id) REFERENCES report_statuses(status_id) ON DELETE RESTRICT,
    CONSTRAINT chk_log_status_changed
        CHECK (old_status_id IS NULL OR old_status_id <> new_status_id)
);


-- Indexes for common filters and joins
CREATE INDEX idx_reports_status      ON reports(status_id);
CREATE INDEX idx_reports_facility    ON reports(facility_id);
CREATE INDEX idx_reports_category    ON reports(category_id);
CREATE INDEX idx_reports_priority    ON reports(priority_id);
CREATE INDEX idx_reports_submitted   ON reports(submitted_at);
CREATE INDEX idx_status_logs_report  ON status_logs(report_id);
CREATE INDEX idx_assignments_report  ON assignments(report_id);
CREATE INDEX idx_assignments_staff   ON assignments(staff_id);
CREATE INDEX idx_users_role          ON users(role);
