const router = require('express').Router();
const fs = require('fs');

router.route('/').get((req, res) => {

  // implement later

});

router.route('/add').post((req, res) => {

  console.log("latitude: " + req.body.latitude)
  console.log("longitude: " + req.body.longitude)
  console.log("audio: " + req.files.audio.name)
  console.log("radius: " + req.body.radius)
  console.log("activation: " + req.body.activation)
  console.log("deactivation: " + req.body.deactivation)
  var path = '../../../../ResourcesAR/'
  
  fs.access(__dirname + path + "data.json", err => {
    if (err) {
      console.log(err);
      res.status(400).send("Resources folder could not be found. Check the path!");
    }
    else {
      fs.readFile(__dirname + path + "data.json", 'utf-8', function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).send("Resources folder could not be found. Check the path!");
        }
        var dataAR = JSON.parse(data)
        dataAR.gps.push({
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          radius: req.body.radius,
          activation: req.body.activation,
          deactivation: req.body.deactivation,
        })
    
        fs.writeFile(__dirname + path + req.files.audio.name, req.files.audio.data, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send("Failed to download audio file");
          }
          console.log('Audio file downloaded successfully');
    
          fs.writeFile(__dirname + path + "data.json", JSON.stringify(dataAR), 'utf-8', function(err) {
            if (err) {
              console.log(err);
              res.status(500).send("Failed to update data.json file");
            }
            console.log('data.json updated successfully!')
            res.status(201).end();
          })
        });
      });
    }
  });
});

module.exports = router;