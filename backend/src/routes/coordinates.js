const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const gpsDataFileName = 'gps_data.json';
const imageDataFileName = 'image_data.json';
const configFile =  '/../config.json';

// Reads gps_data.json and returns its contents
router.route('/').get((req, res) => {

  getPath()
  .then(pathData => {

    var path = pathData.path + "/";
    getData(path + gpsDataFileName)
    .then(data => {
      res.json(JSON.parse(data));
    })
    .catch(err => {
      res.status(400).send("Resources folder could not be found. Check the path!");
    })
  })
  .catch(err => {
    res.status(400).send("Resources folder could not be found. Check the path!");
  })
});

// Adds a new coordinate object
router.route('/add').post((req, res) => {

  getPath()
  .then(pathData => {

    var path = pathData.path + "/";

    getData(path + gpsDataFileName)
    .then(data => {
      var gpsData = JSON.parse(data)

      // Creates a new coordinate object
      gpsData.data.push({
        id: uuidv4(),
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        audioName: req.files.audio.name,
        radius: req.body.radius,
        activation: req.body.activation,
        deactivation: req.body.deactivation,
      })

      promiseList = [];

      // Downloads audio file
      promiseList.push(addFile(path + req.files.audio.name, req.files.audio.data));
      // Updates gps_data.json with the new object
      promiseList.push(updateData(gpsData,path));

      Promise.all([promiseList])
      .then(response => {
        return res.status(201).end();
      })
      .catch(err => {
        return res.status(500).send("Failed to add new coordinate object");
      })
    })
    .catch(err => {
      res.status(400).send("Failed to add new coordinate object");
    })
  })
  .catch(err => {
    res.status(400).send("Resources folder could not be found. Check the path!");
  })
});

// Deletes a coordinate object
router.delete("/:coordId", (req, res) => {

  getPath()
  .then(pathData => {

    var path = pathData.path + "/";

    fs.access(path + gpsDataFileName, err => {

      if (err) {
        console.log(err);
        res.status(400).send("Failed to remove!");
      }
      else {

        // Finds the target coordinate object from gps_data.json data and removes it
        var targetCoordId = req.params.coordId;
        var oldAudioName;
        var updatedData = req.body.gpsData.filter(x => {
          if(x.id == targetCoordId) {
            oldAudioName = x.audioName;
          }
          return x.id != targetCoordId;
        })

        // Counts the number of objects that are using the same audio file as the object to be removed 
        var oldAudioFileCountImage = 0;
        oldAudioFileCountGPS = req.body.gpsData.filter (({audioName}) => audioName === oldAudioName).length;
        if(req.body.gpsData) {
          oldAudioFileCountImage = [].concat(req.body.imageData).filter (({audioName}) => audioName === oldAudioName).length;
        }

        // Updates gps_data.json
        var dataJson = {data: updatedData}
        var promiseList = [];
        promiseList.push(updateData(dataJson,path));

        //Removes the old audio file if it isn't used by other objects
        if(oldAudioName &&  oldAudioFileCountGPS <= 1 && oldAudioFileCountImage <= 0) {
          promiseList.push(removeFile(oldAudioName, path));
        }
        Promise.all([promiseList])
        .then(response => {
          res.status(201).send(dataJson);
        })
        .catch(err => {
          return res.status(500).send("Failed to add new coordinate object");
        })
      }
    })
  })
  .catch(err => {
    return res.status(500).send("Failed to add new coordinate object");
  })
});

// Updates a coordinate object
router.put("/:coordId", (req, res) => {

  getPath()
  .then(pathData => {

    var path = pathData.path + "/";

    // Gets all coordinate objects 
    getData(path + gpsDataFileName)
    .then(data1 => {
      var gpsData = JSON.parse(data1)
      // Gets image objects
      getData(path + imageDataFileName)
      .then(data2 => {
        var imageData = JSON.parse(data2)

        // Finds the correct coordinate object and updates it
        var targetIndex = gpsData.data.findIndex(x => x.id == req.body.id);
        var oldAudioName = gpsData.data[targetIndex].audioName;
        var updatedCoord = {...gpsData.data[targetIndex],
                            name: req.body.name,
                            latitude: req.body.latitude,
                            longitude: req.body.longitude,
                            audioName: req.body.audioName,
                            radius: req.body.radius,
                            activation: req.body.activation,
                            deactivation: req.body.deactivation
                          }

        var promiseList = [];

        if(req.files && req.files.audio) {

          // Downloads the new audio file
          promiseList.push(addFile(path + req.files.audio.name, req.files.audio.data));

          // Removes the old audio file if it isn't used by other objects
          var oldAudioCountGPS = gpsData.data.filter (({audioName}) => audioName === oldAudioName).length;
          var oldAudioCountImage = imageData.data.filter (({audioName}) => audioName === oldAudioName).length;
          if(oldAudioName !== req.files.audio.name && oldAudioCountGPS <= 1 && oldAudioCountImage <= 0) {
            promiseList.push(removeFile(oldAudioName,path));
          }
          updatedCoord = {...updatedCoord, audioName: req.files.audio.name}
        }

        // Saves changes to gpsData
        gpsData.data[targetIndex] = updatedCoord;
        promiseList.push(updateData(gpsData,path));
        Promise.all([promiseList])
        .then(response => {
          return res.status(201).send(gpsData);
        })
        .catch(err => {
          return res.status(500).send("Failed to update coordinate object");
        })
      })
      .catch(err => {
        res.status(400).send("Resources folder could not be found. Check the path!");
      })
    })
    .catch(err => {
      res.status(400).send("Resources folder could not be found. Check the path!");
    })
  })
  .catch(err => {
    res.status(400).send("Resources folder could not be found. Check the path!");
  })
});

// Function for downloading image files
function addFile(fileName, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, function (err) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      else {
        console.log(fileName + ' downloaded successfully');
        return resolve();
      }
    })
  })
}

// Function for updating gps_data.json
function updateData(data, path) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path + gpsDataFileName, JSON.stringify(data, null, 4), 'utf-8', function (err) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      else {
        console.log(gpsDataFileName + ' updated successfully');
        return resolve();
      }
    })
  })
}

// Function for reading files
function getData(path) {
  return new Promise((resolve, reject) => {
  fs.access(path, err => {
      if (err) {
        console.log(err);
        reject(err)
      }
      else {
        fs.readFile(path, 'utf-8', function(err, data) {
          if (err) {
            console.log(err);
            reject(err);
          }
          return resolve(data);
        });
      }
    });
  });
}

// Function for removing files
function removeFile(fileName, path) {
  return new Promise((resolve, reject) => {
    fs.access(path + fileName, err => {
      if (err) {
        return reject(err);
      }
      else {
        fs.unlink(path + fileName, function (err) {
          if (err) {
            return reject(err);
          }
          else {
            console.log(fileName + ' deleted successfully!');
            return resolve();
          }
        })
      }
    })
  })
}

//Function for getting the location of the resources folder
function getPath() {
  return new Promise((resolve, reject) => {
    fs.access(__dirname + configFile, err => {
      if (err) {
          console.log(err);
          return reject(err);
      }
      else {
        fs.readFile(__dirname + configFile, 'utf-8', function(err, data) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          else {
            return resolve(JSON.parse(data));
          }
        });
      }
    })
  }) 
}

module.exports = router;