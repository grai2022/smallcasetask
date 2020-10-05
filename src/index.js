const app = require('./app');
const config = require('./config/config');
const sequelize = require('./models');

let server;

/*
DB connection && Server Init
*/
sequelize.sync().then(() => {
  console.log('Connected to DB');
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
});

/*
Exit Handler
*/
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

/*
Error event Handlers
*/

const unexpectedErrorHandler = (error) => {
    console.log(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
