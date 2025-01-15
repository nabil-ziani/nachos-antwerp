-- Enable RLS on all tables
ALTER TABLE restaurant ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Restaurant policies
CREATE POLICY "Allow public read access to restaurants" ON restaurant
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to manage restaurants" ON restaurant
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Menu Categories policies
CREATE POLICY "Allow public read access to menu categories" ON menu_categories
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to manage menu categories" ON menu_categories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Menu Items policies
CREATE POLICY "Allow public read access to menu items" ON menu_items
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to manage menu items" ON menu_items
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Orders policies
CREATE POLICY "Allow users to create orders" ON orders
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow users to view their own orders" ON orders
    FOR SELECT
    TO public
    USING (customer_email = auth.current_user()->>'email');

CREATE POLICY "Allow authenticated users to manage all orders" ON orders
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Reservations policies
CREATE POLICY "Allow users to create reservations" ON reservations
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow users to view their own reservations" ON reservations
    FOR SELECT
    TO public
    USING (customer_email = auth.current_user()->>'email');

CREATE POLICY "Allow authenticated users to manage all reservations" ON reservations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Contact Messages policies
CREATE POLICY "Allow users to create contact messages" ON contact_messages
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow users to view their own contact messages" ON contact_messages
    FOR SELECT
    TO public
    USING (email = auth.current_user()->>'email');

CREATE POLICY "Allow authenticated users to manage all contact messages" ON contact_messages
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true); 