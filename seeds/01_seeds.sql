INSERT INTO users (name, email, password)
VALUES ('John Smith', 'John@smith.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Kate Hudson', 'Kate@hudosn.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Justin Bieber', 'Justin@bieber.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, num_of_bathrooms, num_of_bedrooms, country, street, city, province, post_code, active)
VALUES (2, 'Mansion', 'description', 'image.jpeg', 'image.png', 100, 5, 5, 5, 'U.S.A', '561 road', 'New York', 'New York', '12323', TRUE),
(1, 'House', 'description', 'image.jpeg', 'image.png', 50, 2, 3, 2, 'U.S.A', '678 road', 'L.A', 'California', '45423', FALSE),
(3, 'Apartment', 'description', 'image.jpeg', 'image.png', 40, 1, 1, 1, 'Canada', '41 road', 'Vancovuer', 'British Columbia', 'V8K4F0', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id) 
VALUES ('2019-09-01', '2019-09-06', 2, 1),
('2019-10-01', '2019-10-20', 1, 3),
('2019-11-01', '2019-11-09', 2, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 5, 'message'),
(3, 1, 2, 4, 'message'),
(3, 2, 3, 1, 'message');

