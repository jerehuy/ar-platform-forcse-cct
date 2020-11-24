const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const path = '../../../../ResourcesAR/';
const dataFileName = 'gps_data.json';

router.route('/').get((req, res) => {

  fs.access(__dirname + path + dataFileName, err => {

    if (err) {
      console.log(err);
      res.status(400).send("Resources folder could not be found. Check the path!");
    }
    else {
      fs.readFile(__dirname + path + dataFileName, 'utf-8', function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).send("Resources folder could not be found. Check the path!");
        }
        res.json(JSON.parse(data));
      });
    }
  });
});

router.route('/add').post((req, res) => {
  /*
  console.log("latitude: " + req.body.latitude)
  console.log("longitude: " + req.body.longitude)
  console.log("audio: " + req.files.audio.name)
  console.log("radius: " + req.body.radius)
  console.log("activation: " + req.body.activation)
  console.log("deactivation: " + req.body.deactivation)
  */
 
  fs.access(__dirname + path + dataFileName, err => {
    if (err) {
      console.log(err);
      res.status(400).send("Resources folder could not be found. Check the path!");
    }
    else {
      fs.readFile(__dirname + path + dataFileName, 'utf-8', function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).send("Resources folder could not be found. Check the path!");
        }
        var dataAR = JSON.parse(data)
        dataAR.data.push({
          id: uuidv4(),
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          filename: req.files.audio.name,
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
    
          fs.writeFile(__dirname + path + dataFileName, JSON.stringify(dataAR), 'utf-8', function(err) {
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

router.delete("/:coordId", (req, res) => {
  console.log('Object ');
  fs.access(__dirname + path + dataFileName, err => {

    if (err) {
      console.log(err);
      res.status(400).send("Failed to remove!");
    }
    else {
      var targetCoord = req.params.coordId;
      var updatedData = req.body.filter(x => {
        return x.id != targetCoord;
      })
      var dataJson = {data: updatedData}

      fs.writeFile(__dirname + path + dataFileName, JSON.stringify(dataJson), 'utf-8', function(err) {
        if (err) {
          console.log(err);
          res.status(500).send("Failed to remove object from data.json file");
        }
        console.log('Object ' + targetCoord + ' removed from data.json successfully!');
        res.status(201).send(dataJson);
      })
    }
  })
});

module.exports = router;