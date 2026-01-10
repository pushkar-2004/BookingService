const express = require("express");
const { PORT } = require("./config/serverConfig");
const bodyParser = require("body-parser");
const apiRoutes = require('./routes/index');
const db = require('./models/index');

function setupAndStartServer() {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/api',apiRoutes);
  app.listen(PORT, () => {
    console.log(`Server started on port number ${PORT}`);
    if(process.env.DB_SYNC){
      db.sequelize.sync({alter:true});
    }
  });
}

setupAndStartServer();
