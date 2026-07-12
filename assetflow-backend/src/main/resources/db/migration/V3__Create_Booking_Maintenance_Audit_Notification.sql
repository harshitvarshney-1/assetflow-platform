-- 1. File Name: V3__Create_Booking_Maintenance_Audit_Notification.sql
-- 2. Folder Location: d:\PROJECTS\assetflow-platform\assetflow-backend\src\main\resources\db\migration
-- 3. Purpose: Create tables for Resource Booking, Maintenance Management, Audit Management, and Notification modules.

-- ==========================================
-- MODULE 1: RESOURCE BOOKING
-- ==========================================

CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    resource_id BIGINT NOT NULL, -- Assuming asset/resource ID is BIGINT
    booking_type VARCHAR(50) NOT NULL,
    booked_by BIGINT NOT NULL, -- Assuming employee ID is BIGINT
    department_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE NOT NULL,
    end_time TIME NOT NULL,
    purpose TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- Upcoming, Active, Completed, Cancelled
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking_history (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    performed_by BIGINT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_resource_id ON bookings(resource_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_department_id ON bookings(department_id);

-- ==========================================
-- MODULE 2: MAINTENANCE MANAGEMENT
-- ==========================================

CREATE TABLE IF NOT EXISTS maintenance (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL,
    issue_title VARCHAR(255) NOT NULL,
    issue_description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL, -- Low, Medium, High, Critical
    raised_by BIGINT NOT NULL,
    assigned_technician_id BIGINT,
    estimated_cost DECIMAL(10, 2) CHECK (estimated_cost >= 0),
    actual_cost DECIMAL(10, 2) CHECK (actual_cost >= 0),
    maintenance_type VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP,
    remarks TEXT,
    status VARCHAR(50) NOT NULL -- Pending, Approved, Rejected, Technician Assigned, In Progress, Resolved, Closed
);

CREATE TABLE IF NOT EXISTS maintenance_history (
    id BIGSERIAL PRIMARY KEY,
    maintenance_id BIGINT NOT NULL REFERENCES maintenance(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    performed_by BIGINT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_asset_id ON maintenance(asset_id);
CREATE INDEX idx_maintenance_status ON maintenance(status);
CREATE INDEX idx_maintenance_priority ON maintenance(priority);

-- ==========================================
-- MODULE 3: AUDIT MANAGEMENT
-- ==========================================

CREATE TABLE IF NOT EXISTS audits (
    id BIGSERIAL PRIMARY KEY,
    audit_name VARCHAR(255) NOT NULL,
    department_id BIGINT NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    assigned_auditor_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL, -- Scheduled, In Progress, Completed, Closed
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_items (
    id BIGSERIAL PRIMARY KEY,
    audit_id BIGINT NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    asset_id BIGINT NOT NULL,
    verification_status VARCHAR(50) NOT NULL, -- Verified, Missing, Damaged, Lost
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_history (
    id BIGSERIAL PRIMARY KEY,
    audit_id BIGINT NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    performed_by BIGINT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audits_department_id ON audits(department_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audit_items_audit_id ON audit_items(audit_id);
CREATE INDEX idx_audit_items_asset_id ON audit_items(asset_id);
CREATE INDEX idx_audit_items_status ON audit_items(verification_status);

-- ==========================================
-- MODULE 4: NOTIFICATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    recipient_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL, -- System Alert, Booking Approved, etc.
    read_status BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_read_status ON notifications(read_status);
