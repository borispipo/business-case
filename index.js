const express = require('express');
const  router = express.Router();
const  app = express();
const routes = require("./server/routes");
const path = require("path");


const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // mongoose module

app.use(bodyParser.json()); // parse application/json

const connectWithRetry = function () {
    return mongoose.connect(`${process.env.MONGODB_URL}`, {}).then(
      () => {
        /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
      },
      (err) => {
        /** handle initial connection error */
        console.error(
          "Failed to connect to mongo on startup - retrying in 5 sec",
          err
        );
        setTimeout(connectWithRetry, 5000);
      }
    );
};

// get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// get the default connection
const db = mongoose.connection;
// bind connection to error event (to get notification of connection errors)

db.on("connecting", function () {
    console.log("connecting to MongoDB...");
});
  
db.on("error", function (error) {
    console.error("Error in MongoDb connection: " + error);
    mongoose.disconnect();
});
db.on("connected", function () {
    console.log("MongoDB connected!");
    // console.log(mongoose.connection.readyState);
    logicalCtl.insertMany(Object.values(logicalNames));
});
db.once("open", function () {
    console.log("MongoDB connection opened!");
});
db.on("reconnected", function () {
    console.log("MongoDB reconnected!");
});

db.on("disconnected", function () {
    console.log("MongoDB disconnected!");
    // connectWithRetry();
});

/** SERVE PUBLIC FILES */
//app.use('/', express.static(__dirname + '/public'));

app.get('/web-driver', (req, res) => {
  console.log(req.url," is rrrrr")
  res.sendFile(path.join(__dirname, 'dist/web-driver/index.html'))
});

const sampleRouter = require('./server/sampleRouter');
// register controllers for endpoints
router.use('/sample', sampleRouter);//Api for devices
// any route starting with '/api' will be interfacing our API
app.use('/api', router);

//dynamic routing
for(let i in routes){
  app.use(i,routes[i]); 
}

/** RUN APP */
const server = app.listen(process.env.PORT || '3000', function () {
    console.log('[SERVER] I\'m listening on PORT: ' + (process.env.PORT || '3000'));
});

console.log(process.env.MONGODB_URL," is ddddddddddddddddddddddddddd")
//connectWithRetry();

module.exports.server = server;
module.exports.mongo = mongoose;