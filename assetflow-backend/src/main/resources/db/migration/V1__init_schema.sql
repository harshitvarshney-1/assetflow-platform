CREATE TABLE assets (
    id UUID PRIMARY KEY,
    asset_tag VARCHAR(100) UNIQUE NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    current_holder VARCHAR(255),
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    purchase_date DATE NOT NULL,
    purchase_cost NUMERIC(15, 2) NOT NULL CHECK (purchase_cost >= 0.0),
    manufacturer VARCHAR(100),
    model_number VARCHAR(100),
    warranty_expiry DATE,
    condition VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    image VARCHAR(500),
    documents VARCHAR(500),
    description TEXT,
    status VARCHAR(50) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE allocations (
    id UUID PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES assets(id),
    employee VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    allocated_date DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE transfers (
    id UUID PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES assets(id),
    from_employee VARCHAR(255) NOT NULL,
    to_employee VARCHAR(255) NOT NULL,
    requested_by VARCHAR(255) NOT NULL,
    approved_by VARCHAR(255),
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE asset_history (
    id UUID PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES assets(id),
    action VARCHAR(100) NOT NULL,
    action_by VARCHAR(255) NOT NULL,
    description TEXT,
    action_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE return_logs (
    id UUID PRIMARY KEY,
    allocation_id UUID REFERENCES allocations(id),
    asset_id UUID NOT NULL REFERENCES assets(id),
    return_date TIMESTAMP NOT NULL,
    returned_by VARCHAR(255) NOT NULL,
    condition VARCHAR(50) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- CREATE INDEXES FOR OPTIMAL SEARCHING & FILTERING
CREATE INDEX idx_assets_tag ON assets(asset_tag);
CREATE INDEX idx_assets_serial ON assets(serial_number);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_department ON assets(department);
CREATE INDEX idx_assets_condition ON assets(condition);
CREATE INDEX idx_allocations_asset ON allocations(asset_id);
CREATE INDEX idx_allocations_employee ON allocations(employee);
CREATE INDEX idx_transfers_asset ON transfers(asset_id);
CREATE INDEX idx_asset_history_asset ON asset_history(asset_id);
