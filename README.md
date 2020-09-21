# Portfolio Website Backend API

A backend interface hosting RESTful APIs and logging middleware, built with NodeJS, Express, and PostgreSQL

### `Websites:`

[abarbieux.com/api/](https://www.abarbieux.com/api/) || [barbieux.dev/api/](https://barbieux.dev/api/) Both currently point to the same source

---

## Contents:

1. [Related Repos](#Related-Repos)
2. [Features](#Features)
   1. [Notes REST API](#Notes-API)
   2. [Mailer API](#Mailer-API)
   3. [Request Logger](#Request-Logger)
3. [Setup](#Database-and-General-Setup)
4. [Reference Guides](#Reference-Guides)

---

## Related Repos

- #### `Front End:`

  - [portfolio-frontend](https://github.com/abarbieu/portfolio-frontend) ~ The front end of a fully fledged portfolio website built with ReactJS in Typescript. Includes scripts and components that automatically generate content from photo folders, JSON files, and a back end interface.

- #### `Production:`

  - [portfolio-production](https://github.com/abarbieu/portfolio-production) ~ Where optimized frontend and backend projects are combined and served with different routes and middleware.

- #### `Previously:`

  - [postgreSQL-playground](https://github.com/abarbieu/postgreSQL-playground) ~ A place to test database design and commands

## Features:

- #### [`Notes Database:`](#Todolist-API)

  - Manage Notes using a PostgreSQL database

- #### [`Auto Mailer:`](#Mailer-API)

  - Send email forms using nodemailer

- #### [`Logging Middleware:`](#Request-Logger)

  - Middleware that saves all visits to a logs file containing **time, location, and IP** information

---

---

## Notes Api

---

### `Features:`

Simple REST API commands:

All data should be sent in url encoded format

- `GET @/api/notes`
  - Returns all todos in database in the form
    ```ts
    [
      {
        title: String,
        content: String,
        severity: Real,
        date: Integer,
        archived: Boolean,
      },
    ];
    ```
- `GET @/api/notes/:id`
  - Returns single note with provided id in the same form as above:
- `POST @/api/notes/`
  - Provide Title, Content, and other data in body
  - Creates a single todo with provided data, returns todo
- `PUT @/api/todos/:id`
  - Updates a todo with given id, preserving any unspecified data
- `DELETE @/api/todos/:id`
  - Deletes note with given id

(@ represents https://barbieux.dev)

#### `Purpose:`

This API is meant purely to manage the <https://barbieux.dev/notes/> page

---

## Mailer API

---

#### `Features:`

Request format:

```ts
POST @/mail/?replyto=String&name=String&subject=String&content=String
```

(@ represents https://barbieux.dev, replace datatype after '=' with your data)

#### `Purpose:`

This utility is used to contact me through a form displayed in a Contact Me Modal

---

## Request Logger

---

#### `Features:`

Logs all http requests to my website to a postgres database indexed by IP address.

The following information is recorded:

- IP address
- Time requested
- Request protocol, method, domain, path, subdomains
- Geographic information
  - **Not accurate enough to be a privacy concern**
  - Rough Latitude/Longitude coordinates
  - Corresponding Country, Region, City
  - Area Code, Metro Code

#### `Purpose:`

To quantify traffic and reach, indentify malicious requests, and for some debugging

---

---

# Database and General Setup:

---

### `Install postgreSQL`

```bash
apt-get install postgresql postgresql-contrib   # install
update-rc.d postgresql enable                   # psql starts on boot
service postgresql start                        # start psql on port 5432 (default)
```

### `Setup Node.js stuff for a new project:`

---

```bash
npm init
npm i express pg

```

### `Basic commands to get started:`

---

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

### `Basic SQL:`

---

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

### `Basic API testing with curl:`

##### I recommend using [postman](https://www.postman.com/) instead

---

```bash
curl http://localhost:3000/users                                                          # GET request
curl --data "name=Elaine&email=elaine@example.com" http://localhost:3000/users            # POST request
curl -X PUT -d "name=Kramer" -d "email=kramer@example.com" http://localhost:3000/users/1  # Put request w id 1
curl -X "DELETE" http://localhost:3000/users/1                                            # DELETE request with id 1
```

### `Template for environment variables in a .env file:`

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

---

[Setting up a RESTful API with Node.js and PostgreSQL](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/)

[How to install PostgreSQL on Ubuntu 14.04](https://www.godaddy.com/garage/how-to-install-postgresql-on-ubuntu-14-04/)

[PostgreSQL documentation](https://www.postgresql.org/docs/)

[w3schools SQL tutorial](https://www.w3schools.com/sql/)

[PostgreSQL datatypes](https://www.guru99.com/postgresql-data-types.html)
