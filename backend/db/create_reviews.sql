-- Create the reviews and bookings tables used by the Django app
-- You can import this file in pgAdmin4 (Tools > Query Tool > open and run)

create schema if not exists public;

-- Reviews table
create table if not exists public.reviews_review (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  name varchar(200) not null,
  role varchar(200) not null,
  company varchar(200) not null,
  email varchar(254),
  rating smallint not null check (rating between 1 and 5),
  review text not null
);

create index if not exists idx_reviews_review_created_at on public.reviews_review (created_at desc);

-- Bookings table
create table if not exists public.reviews_booking (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  name varchar(200) not null,
  email varchar(254) not null,
  phone varchar(20) not null,
  company varchar(200),
  project_type varchar(100) not null,
  project_description text not null,
  timeline varchar(50) not null,
  budget varchar(50),
  preferred_contact varchar(50) not null,
  preferred_date date,
  preferred_time time,
  additional_notes text
);

create index if not exists idx_reviews_booking_created_at on public.reviews_booking (created_at desc);
create index if not exists idx_reviews_booking_project_type on public.reviews_booking (project_type);

