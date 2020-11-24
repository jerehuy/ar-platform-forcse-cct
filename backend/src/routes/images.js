const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dataFileName = 'image_data.json';
const path = '../../../../ResourcesAR/';

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
          trackedImageName: req.files.image.name,
          text: req.body.description,
          audioName: "",
          pictureName: req.files.image.name
        })
    
        fs.writeFile(__dirname + path + req.files.image.name, req.files.image.data, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send("Failed to download image file");
          }
          console.log('Image file downloaded successfully');
    
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

router.delete("/:imageId", (req, res) => {
  fs.access(__dirname + path + dataFileName, err => {

    if (err) {
      console.log(err);
      res.status(400).send("Failed to remove!");
    }
    else {
      var targetImage = req.params.imageId;
      var updatedData = req.body.filter(x => {
        return x.id != targetImage;
      })
      var dataJson = {data: updatedData}

      fs.writeFile(__dirname + path + dataFileName, JSON.stringify(dataJson), 'utf-8', function(err) {
        if (err) {
          console.log(err);
          res.status(500).send("Failed to remove object from data.json file");
        }
        console.log('Object ' + targetImage + ' removed from data.json successfully!');
        res.status(201).send(dataJson);
      })
    }
  })
});

module.exports = router;