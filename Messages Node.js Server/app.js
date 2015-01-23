var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'messages',
});

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

/***************************/
/***    API Endpoints    ***/
/***************************/

app.get('/api/register', function(req, res) {
    var username = req.query.username;
    var password = req.query.password;
    // Schema:
    // create table users (username varchar(255), password varchar(255));

    // *** Business Logic ***

    connection.query('SELECT username FROM users WHERE username = \'' + username + '\'', function (err, rows, fields) {
	    if (err) throw err;
	    if (rows.length == 0) {
    		  connection.query('INSERT INTO users (username, password) VALUES (\'' + username + '\', \'' + password + '\')', function(err, rows, fields) {
 	                if (err) throw err;
		            var respObj = { success: 'true', message: 'User registered'};
		            res.end (JSON.stringify (respObj));
		      });
	    }
	    else {
	          var respObj = { success: 'false', message: 'Username taken'};
              res.end (JSON.stringify (respObj));
	    }
	});
})

app.get('/api/login', function(req, res) {
    var username = req.query.username;
    var password = req.query.password;
    // Schema:
    // create table users (username varchar(255), password varchar(255));

    // *** Business Logic ***

    connection.query('SELECT username FROM users WHERE username = \'' + username + '\' and password = \'' + password + '\'', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            var respObj = { success: 'false', message: 'User/Pass pair not found'};
            res.end (JSON.stringify (respObj));
        }
        else {
            var respObj = { success: 'true', message: 'Welcome, ' + username};
            res.end (JSON.stringify (respObj));
        }
    });
})

app.get('/api/checkFriend', function(req, res) {
    var username = req.query.username;
    // Schema:
    // create table users (username varchar(255), password varchar(255));

    // *** Business Logic ***

    connection.query('SELECT username FROM users WHERE username = \'' + username + '\'', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            var respObj = { success: 'false', message: 'Your friend is not found on our server'};
            res.end (JSON.stringify (respObj));
        }
        else {
            var respObj = { success: 'true', message: 'Your friend is using Messages!'};
            res.end (JSON.stringify (respObj));
        }
    });
})

app.get('/api/getMyMessages', function(req, res) {
    var username = req.query.username;

    //create table messages (fromuser varchar(255), touser varchar(255), message varchar(255), sendtime timestamp, readM tinyint(1));

    connection.query('SELECT fromuser, touser, message, sendtime FROM messages WHERE touser = \'' + username + '\' AND readM = 0', function (err, result) {
        res.end (JSON.stringify (result));
    })
    connection.query('UPDATE messages SET readM = 1 WHERE touser = \'' + username + '\'', function (err, result) {})
})

app.get('/api/sendMessage', function(req, res) {
    var fromuser = req.query.fromuser;
    var touser = req.query.touser;
    var message = req.query.message;
    var sendtime = 'UTC_TIMESTAMP()';
    var readM = '0';

    //create table messages (fromuser varchar(255), touser varchar(255), message varchar(255), sendtime timestamp, readM tinyint(1));

    connection.query('INSERT INTO messages (fromuser, touser, message, sendtime, readM) VALUES (\'' + fromuser + '\', \'' + touser + '\', \'' + message + '\',' + sendtime + ',' + readM + ')', function (err, result) {
        if (err) {
            var respObj = { success: 'false', message: 'An error occurred'};
            res.end (JSON.stringify (respObj));
        } else {
            var respObj = { success: 'true', message: 'Success'};
            res.end (JSON.stringify (respObj));
        }
    })
})

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
