function allError(statusNumber, res, message) {
  res
    .status(statusNumber)
    .send({
      status: false,
      message: message,
    })
    .end();
}
const appError = (httpStatus,errMessage,next)=>{
	const error = newError(errMessage);
	error.statusCode = httpStatus;
	error.isOperational = true;
	next(error);
}
module.exports = { allError , appError};
