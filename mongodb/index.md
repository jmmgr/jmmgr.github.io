# MongoDB

Mongo help
```
mongo ——help
```

Mongo connect to db 
```
mongo ip:port/name_db
```

Check current queries running (once connected)
```
db.currentOp();
```

Do a mongodump
```
mongodump --port 27017 -h XXX.XXX.XXX.XXX -d db_production -c ecwid_users -o ~/temp/
```

Do a mongorestore
```
mongorestore --port 27017 -h dev.db.net -d db_development --drop -c ecwid_users ~/temp/db_production/ecwid_users.bson
```

Example script will dump and restore a table

```
#!/bin/bash
if [ “$#” -ne 1 ] ; then
  echo “Usage: mongo_dump_load_table.sh name_table”
  exit 1
fi
rm -f ~/temp/db_production/$1.bson && 
mongodump —port 27017 -h XXX.XXX.XXX.XXX -d db_production -c $1 -o ~/temp/ &&
mongorestore —port 27018 -h 127.0.0.1 -d db_development —drop -c $1 ~/temp/db_production/$1.bson
```

Mongo start Aftership

```
sudo mongod —config /usr/local/etc/mongod-27017.yml &
sudo mongod —config /usr/local/etc/mongod-27018.yml &
```


