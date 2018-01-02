var mongoose = require('mongoose');
require('./locations');

var dbUri = 'mongodb://localhost/Loc8r';

var shutdown = function(msg, callback){
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

mongoose.connect(dbUri, {
    useMongoClient: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + dbUri);
});

mongoose.connection.on('error', err => {
    console.log("Mongoose connection error " + err)
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

process.once('SIGUSR2', () => {
    shutdown('Nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', () => {
    shutdown('App termination', () => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    shutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});