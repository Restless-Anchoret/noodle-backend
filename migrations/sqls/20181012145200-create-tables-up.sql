create table account (
  id serial primary key,
  login varchar(50) unique not null,
  password_hash varchar(100) not null,
  name varchar(100) not null,
  last_login_date timestamp not null,
  registration_date timestamp not null
);

-- todo
