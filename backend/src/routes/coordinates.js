const router = require('express').Router();
const fs = require('fs');

router.route('/').get((req, res) => {

  // implement later

});

router.route('/add').post((req, res) => {

  console.log("latitude: " + req.body.latitude)
  console.log("longitude: " + req.body.longitude)
  console.log("audio: " + req.files.audio.name)
  /*
  var path = '../../../../ResourcesAR/'
  fs.readFile(__dirname + path + "data.json", 'utf-8', function(err, data) {
    if (err) {
      res.status(500).end();
    }
    var dataAR = JSON.parse(data)
    dataAR.gps.push({
      latitude: req.body.latitude,
      longitude: req.body.longitude
    })

    fs.writeFile(__dirname + path + req.files.audio.name, req.files.audio.data, function (err) {
      if (err) {
        res.status(500).end();
      }
      console.log('Audio file downloaded successfully');

      fs.writeFile(__dirname + path + "data.json", JSON.stringify(dataAR), 'utf-8', function(err) {
        if (err) {
          res.status(500).end();
        }
        console.log('JSON file updated!')
        res.status(201).end();
      })
    });
  });
  */
});

module.exports = router;