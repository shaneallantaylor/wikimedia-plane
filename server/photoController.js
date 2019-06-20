const photoController = {};

// Middleware Methods

photoController.uploadPhoto = (req, res, next) => {
  console.log('we saved the photo somewhere');
  next();
}

photoController.saveAdditionalInformation = (req, res, next) => {
  console.log('we saved the additional information');
  next();
}

module.exports = photoController;
