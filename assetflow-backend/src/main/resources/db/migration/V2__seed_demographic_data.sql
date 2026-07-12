-- Seed Initial Demo Assets
INSERT INTO assets (
    id, asset_tag, asset_name, category, department, current_holder, serial_number,
    purchase_date, purchase_cost, manufacturer, model_number, warranty_expiry,
    condition, location, image, documents, description, status, deleted, created_at, updated_at
) VALUES 
(
    '47e5b5d8-37fb-4a87-8d07-2856e4c730a1',
    'AST-2026-0001',
    'MacBook Pro 16" M3 Max',
    'Laptops',
    'Engineering',
    NULL,
    'C02F234XMD6M',
    '2026-01-15',
    3499.00,
    'Apple',
    'A2991',
    '2029-01-15',
    'NEW',
    'HQ - Floor 3',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    'https://www.apple.com/macbook-pro/specs/',
    'High-end laptop for developers.',
    'AVAILABLE',
    false,
    '2026-07-12 12:00:00',
    '2026-07-12 12:00:00'
),
(
    '18c7ea16-ea5a-49bb-b1d8-fb8d702d733b',
    'AST-2026-0002',
    'Dell XPS 15 9530',
    'Laptops',
    'Design',
    'John Doe',
    '7XYZ1234ABC',
    '2026-02-10',
    2199.50,
    'Dell',
    'XPS-15-9530',
    '2028-02-10',
    'GOOD',
    'HQ - Floor 2',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80',
    'https://www.dell.com/manuals/xps-15',
    'Standard laptop for design teams.',
    'ALLOCATED',
    false,
    '2026-07-12 12:00:00',
    '2026-07-12 12:00:00'
),
(
    'f9a1fde1-3e4b-4b2a-8d76-bc341490212f',
    'AST-2026-0003',
    'iPhone 15 Pro 256GB',
    'Mobile Phones',
    'Marketing',
    NULL,
    'MD6M47e5b5d8',
    '2026-03-01',
    1099.00,
    'Apple',
    'MTUX3LL/A',
    '2027-03-01',
    'NEW',
    'HQ - Storage Cabinet A',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=400&q=80',
    '',
    'Test phone for marketing department.',
    'AVAILABLE',
    false,
    '2026-07-12 12:00:00',
    '2026-07-12 12:00:00'
);

-- Seed Allocation History for the Allocated Asset
INSERT INTO allocations (
    id, asset_id, employee, department, allocated_date, expected_return_date, actual_return_date, status, notes, created_at, updated_at
) VALUES 
(
    'a2bc3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
    '18c7ea16-ea5a-49bb-b1d8-fb8d702d733b',
    'John Doe',
    'Design',
    '2026-02-15',
    '2027-02-15',
    NULL,
    'ALLOCATED',
    'Assigned for mobile design testing.',
    '2026-07-12 12:00:00',
    '2026-07-12 12:00:00'
);

-- Seed Asset History Log
INSERT INTO asset_history (
    id, asset_id, action, action_by, description, action_date, created_at, updated_at
) VALUES 
(
    '0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
    '47e5b5d8-37fb-4a87-8d07-2856e4c730a1',
    'CREATED',
    'System Admin',
    'Asset created in database.',
    '2026-07-12 12:00:00',
    '2026-07-12 12:00:00',
    '2026-07-12 12:00:00'
),
(
    '5d6e7f8a-9b0c-1d2e-3f4a-5b6c7d8e9f0a',
    '18c7ea16-ea5a-49bb-b1d8-fb8d702d733b',
    'CREATED',
    'System Admin',
    'Asset created in database.',
    '2026-07-12 12:00:00',
    '2026-07-12 12:00:00',
    '2026-07-12 12:00:00'
),
(
    '9f0a1b2c-3d4e-5f6a-7b8c-9d0e1f2a3b4c',
    '18c7ea16-ea5a-49bb-b1d8-fb8d702d733b',
    'ALLOCATED',
    'System Admin',
    'Asset allocated to John Doe.',
    '2026-02-15 10:00:00',
    '2026-07-12 12:00:00',
    '2026-07-12 12:00:00'
);
