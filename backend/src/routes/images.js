const router = require('express').Router();
const fs = require('fs');


router.route('/').get((req, res) => {

  // implement later

});

router.route('/add').post((req, res) => {
  console.log(req.body);
  
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
        dataAR.images.push({
          name: req.files.image.name,
          description: req.body.description
        })
    
        fs.writeFile(__dirname + path + req.files.image.name, req.files.image.data, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send("Failed to download image file");
          }
          console.log('Image file downloaded successfully');
    
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