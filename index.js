require('dotenv').config({path: __dirname + '/.env'})
const express = require('express');
const  router = express.Router();
const  app = express();
const routes = require("./server/routes");
const path = require("path");
const http = require("http");
const cors = require('cors')
const PORT = process.env.PORT || '3000';

const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // mongoose module

app.use(cors());
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

app.use(express.static(__dirname + '/dist'));

/** SERVE PUBLIC FILES */
app.use(express.static(__dirname + '/dist/web-driver'));

//if(String(process.env).toLowerCase() ==="production"){
  app.get('/web-driver', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/web-driver/index.html'));
  });
  app.get('/web-tracker', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/web-tracker/index.html'));
  });
  app.get('/web-admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/web-admin/index.html'));
  });
//}
// any route starting with '/api' will be interfacing our API
app.use('/api', router);

//dynamic routing
for(let i in routes){
  app.use(i,routes[i]); 
}

/** RUN APP */
const server = http.createServer(app);

/****
  socket IO server
*/
const io = require("./server/socket").init(server);
server.listen(PORT, () => console.log(`I'm listening on : ${PORT}`));
module.exports.socketIo = io;

//connect mongo db
connectWithRetry();

module.exports.server = server;
module.exports.mongo = mongoose;