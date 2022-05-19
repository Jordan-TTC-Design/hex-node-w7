function allSuccess(res, message) {
  res
    .send({
      status: 'success',
      message: message,
    })
    .end();
}
function returnDataSuccess(res, message, data) {
  res
    .send({
      status: 'success',
      data: data,
      message: message,
    })
    .end();
}
module.exports = { allSuccess, returnDataSuccess };
