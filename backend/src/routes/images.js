const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


router.route('/').get((req, res) => {

  // implement later

});

router.route('/add').post((req, res) => {
  console.log(req.body);
  
  var path = '../../../../ResourcesAR/';
  var dataFileName = 'image_data.json';

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
module.exports = router;