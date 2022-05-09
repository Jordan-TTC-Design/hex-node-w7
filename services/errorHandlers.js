function allError(statusNumber, res, message) {
  res
    .status(statusNumber)
    .send({
      status: false,
      message: message,
    })
    .end();
}
module.exports = { allError };
