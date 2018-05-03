//success
exports.show200 = function(req, res, msg, data) {
  res.status(200);
  res.json({
    msg: msg,
    data: data
  })
  res.end()
};

//bad client request
exports.show400 = function(req, res, err) {
  res.status(400).json({
    err: err
  });
};

//unauthorized
exports.show401 = function(req, res, next) {
  res.status(401);
  res.end();
};


//not found
exports.show404 = function(req, res, next) {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
};

//conflict
exports.show409 = function(req, res, msg, err) {
  res.status(409).json({
    msg: msg,
    err: err
  });
};

//token refresh
exports.show419 = function(req, res) { 
  res.status(419);
  res.statusMessage = "Refreshing token";
  res.end();
}

//server error
exports.show500 = function(req, res, err) {
    res.status(500);
    res.json({
      error: {
        message: err.message
      }
    });
  }