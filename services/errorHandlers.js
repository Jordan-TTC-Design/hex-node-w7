function allError(httpStatus,errMessage,next){
	const error = new Error(errMessage);
	error.statusCode = httpStatus;
	error.isOperational = true;
	next(error);
}
module.exports = { allError };
