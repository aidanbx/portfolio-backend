# Portfolio Website Backend API

A backend interface hosting RESTful APIs and logging middleware, built with NodeJS, Express, and PostgreSQL

### `Websites:`

[abarbieux.com](https://www.abarbieux.com) || [barbieux.dev](https://barbieux.dev) Both currently point to the same source

---
## Related Repos


### `Front End:`

[portfolio-frontend](https://github.com/abarbieu/portfolio-frontend) ~ The front end of a fully fledged portfolio website built with ReactJS in Typescript. Includes scripts and components that automatically generate content from photo folders, JSON files, and a back end interface.

### `Production:`

[portfolio-production](https://github.com/abarbieu/portfolio-production) ~ Where optimized frontend and backend projects are combined and served with different routes and middleware.

### `Previously:`

[postgreSQL-playground](https://github.com/abarbieu/postgreSQL-playground) ~ A place to test database design and commands

## Features:

### [`Notes Database:`](#Todolist-API)

Manage todolist items using a PostgreSQL database
  
### [`Auto Mailer:`](#Auto-Mailer)

Send email forms using nodemailer

### [`Logging Middleware:`](#Logger)

Middleware that saves all visits to a logs file containing **time, location and IP** information

---

## Todolist Api

### `Features:`

### `Purpose:`

## Auto Mailer

### `Features:`

### `Purpose:`

## Logger

### `Features:`

### `Purpose:`

### `Considerations:`

---
# Database and General Setup:
---

## `Install postgreSQL`

```bash
apt-get install postgresql postgresql-contrib   # install
update-rc.d postgresql enable                   # psql starts on boot
service postgresql start                        # start psql on port 5432 (default)
```

## `Setup Node.js stuff for a new project:`
-----

```bash
npm init
npm i express pg

```

## `Basic commands to get started:`
-----

```bash
psql postgres           # Enter default db
psql -d db -U user -W   # Enter db via user with password
=> \conninfo            # Displays connection info
=> \q                   # Exit psql connection
=> \c                   # Connect to a new database
=> \dt                  # List all tables
=> \du                  # List all roles
=> \list                # List databases
```

## `Basic SQL:`
-----

```SQL
CREATE ROLE user WITH LOGIN PASSWORD 'password';

ALTER ROLE user CREATEDB;

CREATE DATABASE api;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30)
);

INSERT INTO users (name, email)
  VALUES ('Name1', 'email@example.com'), ('Name2', 'ex@example.com');

SELECT * FROM users;
```

## `Basic API testing with curl:`
#### I recommend using Postman instead
-----

```bash
curl http://localhost:3000/users                                                          # GET request
curl --data "name=Elaine&email=elaine@example.com" http://localhost:3000/users            # POST request
curl -X PUT -d "name=Kramer" -d "email=kramer@example.com" http://localhost:3000/users/1  # Put request w id 1
curl -X "DELETE" http://localhost:3000/users/1                                            # DELETE request with id 1
```

## `Template for environment variables in a .env file:`

```python
HOST=ip|domain|localhost
IP=ip|domain|localhost
PORT=port
PGUSER=username
PGHOST=localhost
PGPASSWORD=password
PGDATABASE=database
PGPORT=5432
TODOLIST_TABLE=todolist
DEVEMAIL=sendfromhere@domain.ext
TOEMAIL=inbox@domain.ext
DEVPASS=emailpassword
```

# Reference Guides:
----

[Setting up a RESTful API with Node.js and PostgreSQL](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/)

[How to install PostgreSQL on Ubuntu 14.04](https://www.godaddy.com/garage/how-to-install-postgresql-on-ubuntu-14-04/)

[PostgreSQL documentation](https://www.postgresql.org/docs/)

[w3schools SQL tutorial](https://www.w3schools.com/sql/)

[PostgreSQL datatypes](https://www.guru99.com/postgresql-data-types.html)
