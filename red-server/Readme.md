# For learning purpose...

##Install Postgress

#Ubuntu

```
sudo apt update
```

```
sudo apt install postgresql postgresql-contrib
```
```
sudo systemctl start postgresql.service
```

#Add user to postgresssql


```
sudo passwd postgres

su - postgres

psql

CREATE USER <username>;
ALTER USER buffmomo WITH SUPERUSER CREATEDB CREATEROLE; 

\du   --->list users
CREATE DATABASE red;
\l     ------> list dbs
\c red;  select db
----
psql -h localhost -p 5432 -U buffmomo red
sudo -u buffmomo  psql red

------

```


```
npm install
```

```
Redis connect error

sudo apt-get install redis-server
sudo service redis-server status


```