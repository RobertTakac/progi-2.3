CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(250) UNIQUE NOT NULL,
    user_type VARCHAR(20) NOT NULL, 
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	--neki hashing ili tokeni ili nesto za Oauth2
 );

CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id) ,
    location VARCHAR(250),
    can_rent BOOLEAN DEFAULT true, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


CREATE TABLE merchants (
    merchant_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id),
    busines_name VARCHAR(250) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Croatia',
    description VARCHAR(1000),
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    membership_active BOOLEAN DEFAULT false,
    membership_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership_prices (
    price_id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE membership_payments (
    payment_id SERIAL PRIMARY KEY,
    merchAnt_id INTEGER NOT NULL REFERENCES merchants(merchant_id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    payment_method VARCHAR(50) NOT NULL, 
    payment_status VARCHAR(50) NOT NULL, 
    transaction_id VARCHAR(250),
    paid_at TIMESTAMP,
    membership_start_date TIMESTAMP NOT NULL,
    membership_end_date TIMESTAMP NOT NULL
);

CREATE TABLE equipment_cateories (
	category_id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE,
	description VARCHAR(1000)
	--sigurno nesto za sliku ako ce je imati 
);

CREATE TABLE equipment_listings (
	listing_id SERIAL PRIMARY KEY,
	merchant_id INTEGER NOT NULL REFERENCES merchants(merchant_id),
	category_id INTEGER NOT NULL REFERENCES equipment_cateories(category_id),
	title VARCHAR(250),
	description VARCHAR(1000) NOT NULL,
	dAily_price DECIMAL(10, 2) NOT NULL,
	deposit_amount DECIMAL(10, 2) DEFAULT 0.00,
	currency VARCHAR(3) DEFAULT 'EUR',
	available_from DATE NOT NULL,
	available_until DATE NOT NULL,
	pickup_location VARCHAR(500) NOT NULL,
	--vjv latitude longitude kasnije ali provjeri s drugima
	return_location VARCHAR(500) NOT NULL,
	quantity_available INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

CREATE TABLE listing_images (
    image_id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES equipment_listings(listing_id)
    -- neki nacin kojim cemo stavljati sliku vjv url 
);


CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES equipment_listings(listing_id),
    client_id INTEGER NOT NULL REFERENCES clients(client_id),
    merchant_id INTEGER NOT NULL REFERENCES merchants(merchant_id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    quantity INTEGER DEFAULT 1,
    daily_price DECIMAL(10, 2) NOT NULL,
    total_days INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    --neki statusi vjv placanje i rezervacije opce
    equipment_condition_on_pickup VARCHAR(50), -- neka standardizacina ne pisanje sete opce
    equipment_condition_on_return VARCHAR(50)
 );

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES reservations(reservation_id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    payment_method VARCHAR(50) NOT NULL,
    payment_type VARCHAR(50) NOT NULL, --neki tip za sto je placeno neznam oce deposit i pyment bit odvojeno placaje 
    payment_status VARCHAR(50) NOT NULL, -- odbijeno proslo pending neki enumi
    paid_at TIMESTAMP
);

CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    method_type VARCHAR(50) NOT NULL -- 'credit_card', 'paypal', jos nesto ovo je  dokumentu 
    -- za kartice mozda brojn i jos nesto saznaj i za paypal i nacine placanja 
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES reservations(reservation_id),
    client_id INTEGER NOT NULL REFERENCES clients(client_id),
    merchant_id INTEGER NOT NULL REFERENCES merchants(merchant_id),
    listing_id INTEGER NOT NULL REFERENCES equipment_listings(listing_id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), -- vjerovatno biti neke opcije unosa ali provjera 
    comment VARCHAR(1000),
    UNIQUE(reservation_id)
	--MOZDA DATUM ?
);

CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES reservations(reservation_id),
    merchant_id INTEGER NOT NULL REFERENCES merchants(merchant_id),
    reported_client_id INTEGER NOT NULL REFERENCES clients(client_id),
    reason VARCHAR(100) NOT NULL, 
    description VARCHAR(1000) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by INTEGER REFERENCES users(user_id),-- mozda provjera za admin user ili nesto
    reviewed_at TIMESTAMP,
    action_taken VARCHAR(100), -- neke akcije nesto neki enumi isto 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

 -- napravi indekse kad se dogovorimo sto sve treba



	