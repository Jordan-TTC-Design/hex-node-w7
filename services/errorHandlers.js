function allError(statusNumber, res, message) {
  res
    .status(statusNumber)
    .send({
      status: false,
      message: message,
    })
    .end();
}
function appError(httpStatus,errMessage,next){
	const error = new Error(errMessage);
	error.statusCode = httpStatus;
	error.isOperational = true;
	next(error);
}
module.exports = { allError , appError};
