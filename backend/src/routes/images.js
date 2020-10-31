const router = require('express').Router();
const fs = require('fs');


router.route('/').get((req, res) => {

  // implement later

});

router.route('/add').post((req, res) => {
  console.log(req.body);
  /*
  var path = '../../../../ResourcesAR/'
  fs.readFile(__dirname + path + "data.json", 'utf-8', function(err, data) {
    if (err) {
      res.status(500).end();
    }
    var dataAR = JSON.parse(data)
    dataAR.images.push({
      name: req.files.image.name,
      description: req.body.description
    })

    fs.writeFile(__dirname + path + req.files.image.name, req.files.image.data, function (err) {
      if (err) {
        res.status(500).end();
      }
      console.log('Image file downloaded successfully');

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