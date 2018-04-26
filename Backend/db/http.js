//success
exports.show200 = function(req, res, msg, data) {
  res.status(200);
  res.json({
    msg: msg,
    data: data
  })
};

//bad client request
exports.show400 = function(req, res, err) {
  res.status(400).json({
    err: err
  });
};

//not found
exports.show404 = function(req, res, next) {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
};

//conflict
exports.show409 = function(req, res, msg) {
  res.status(409).json({
    msg: msg
  });
};

//server error
exports.show500 = function(req, res, err) {
    res.status(500);
    res.json({
      error: {
        message: err.message
      }
    });
  }