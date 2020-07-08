# TodoList API
---
## A RESTful API to manage todolist items using a PostgreSQL database

# Setup:
---

## Install postgreSQL


```bash
apt-get install postgresql postgresql-contrib   # install
update-rc.d postgresql enable                   # psql starts on boot
service postgresql start                        # start psql on port 5432 (default)
```

Setup Node.js stuff for a new project:
-----

```bash
npm init
npm i express pg

```

Basic commands to get started:
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

Basic SQL:
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

Basic API testing with curl:
-----

```bash
curl http://localhost:3000/users                                                          # GET request
curl --data "name=Elaine&email=elaine@example.com" http://localhost:3000/users            # POST request
curl -X PUT -d "name=Kramer" -d "email=kramer@example.com" http://localhost:3000/users/1  # Put request w id 1
curl -X "DELETE" http://localhost:3000/users/1                                            # DELETE request with id 1
```

## Template for environment variables in a .env file:

```python
HOST=localhost
IP=ip
PORT=port
PGUSER=username
PGHOST=localhost
PGPASSWORD=password
PGDATABASE=database
PGPORT=5432
```

Reference Guides:
----

[Setting up a RESTful API with Node.js and PostgreSQL](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/)

[How to install PostgreSQL on Ubuntu 14.04](https://www.godaddy.com/garage/how-to-install-postgresql-on-ubuntu-14-04/)

[PostgreSQL documentation](https://www.postgresql.org/docs/)

[w3schools SQL tutorial](https://www.w3schools.com/sql/)

[PostgreSQL datatypes](https://www.guru99.com/postgresql-data-types.html)