function allSuccess(res, message) {
  res
    .send({
      status: true,
      message: message,
    })
    .end();
}
function returnDataSuccess(res, message, data) {
  res
    .send({
      status: true,
      data: data,
      message: message,
    })
    .end();
}
module.exports = { allSuccess, returnDataSuccess };
