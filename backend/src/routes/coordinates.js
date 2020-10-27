const router = require('express').Router();

router.route('/').get((req, res) => {

  // implement later

});

router.route('/add').post((req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  console.log("latitude: " + latitude)
  console.log("longitude: " + longitude)
});

module.exports = router;