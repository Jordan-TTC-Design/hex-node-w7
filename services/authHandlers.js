function generateSendJWT(res, statusCode, user, message) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.status(statusCode).send({
    status: true,
    user: {
      token,
      id: user._id,
      name: user.name,
      message,
    },
  });
}

module.exports = { generateSendJWT };
