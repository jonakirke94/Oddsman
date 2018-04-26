//success
exports.show200 = function(req, res, next, data) {
  res.status(200);
  res.json({
    message: "Success",
    data: data
  })
};


//not found
exports.show404 = function(req, res, next) {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
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