module.exports = (req, res, next) => {
  res.locals.showDeleteLink = !!(req.session && req.session.userId);
  next();
};
