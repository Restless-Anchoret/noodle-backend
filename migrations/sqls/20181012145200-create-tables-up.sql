create table account (
  id serial primary key,
  login varchar(50) unique not null,
  password_hash varchar(100) not null,
  name varchar(100) not null,
  last_login_date timestamptz not null,
  registration_date timestamptz not null
);

create table list (
  id serial primary key,
  title varchar(100) not null,
  index integer not null,
  account_id integer not null references account(id)
);

create table tag (
  id serial primary key,
  name varchar(100) not null,
  account_id integer not null references account(id)
);

create table task (
  id bigserial primary key,
  title varchar(400) not null,
  description varchar(2000) not null,
  status varchar(20) not null,
  parent_task_id bigint references task(id),
  has_children boolean not null,
  list_id integer not null references list(id),
  index integer not null,
  creation_date timestamptz not null,
  start_date timestamptz,
  end_date timestamptz,
  planning_date timestamptz,
  deadline timestamptz,
  check (status in ('TO_DO', 'IN_PROGRESS', 'DONE'))
);

create table task_tag (
  task_id bigint not null references task(id),
  tag_id integer not null references tag(id),
  primary key(task_id, tag_id)
);
