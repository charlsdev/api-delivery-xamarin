const mongoose = require('mongoose');

const mongoDB = process.env.MONGO_DB;

mongoose.connect(mongoDB)
   .then((db) =>
      console.log(`DB is connect to ${db.connection.host} - ${db.connection.name}...`)
   )
   .catch((err) =>
      console.log(err)
   );