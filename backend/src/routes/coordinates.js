const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const path = '../../../../ResourcesAR/';
const gpsDataFileName = 'gps_data.json';
const imageDataFileName = 'image_data.json';

// Reads gps_data.json and returns its contents
router.route('/').get((req, res) => {
  getData(__dirname + path + gpsDataFileName)
  .then(data => {
    res.json(JSON.parse(data));
  })
  .catch(err => {
    res.status(400).send("Resources folder could not be found. Check the path!");
  })
});

// Adds a new coordinate object
router.route('/add').post((req, res) => {
  getData(__dirname + path + gpsDataFileName)
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
    promiseList.push(addFile(__dirname + path + req.files.audio.name, req.files.audio.data));
    // Updates gps_data.json with the new object
    promiseList.push(updateData(gpsData));

    Promise.all([promiseList])
    .then(response => {
      return res.status(201).end();
    })
    .catch(err => {
      return res.status(500).send("Failed to add new coordinate object");
    })
  })
  .catch(err => {
    res.status(400).send("Resources folder could not be found. Check the path!");
  })
});

// Deletes a coordinate object
router.delete("/:coordId", (req, res) => {
  fs.access(__dirname + path + gpsDataFileName, err => {

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
      promiseList.push(updateData(dataJson));

      //Removes the old audio file if it isn't used by other objects
      if(oldAudioName &&  oldAudioFileCountGPS <= 1 && oldAudioFileCountImage <= 0) {
        promiseList.push(removeFile(oldAudioName));
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
});

// Updates an existing coordinate object
router.put("/:coordId", (req, res) => {

  // Gets coordinate objects 
  getData(__dirname + path + gpsDataFileName)
  .then(data1 => {
    var gpsData = JSON.parse(data1)
    // Gets image objects
    getData(__dirname + path + imageDataFileName)
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
        // Downloads a new audio file for the coordinate object
        promiseList.push(addFile(__dirname + path + req.files.audio.name, req.files.audio.data));

        // Removes the old audio file if it isn't used by other objects
        var oldAudioCountGPS = gpsData.data.filter (({audioName}) => audioName === oldAudioName).length;
        var oldAudioCountImage = imageData.data.filter (({audioName}) => audioName === oldAudioName).length;
        if(oldAudioName !== req.files.audio.name && oldAudioCountGPS <= 1 && oldAudioCountImage <= 0) {
          promiseList.push(removeFile(oldAudioName));
        }
        updatedCoord = {...updatedCoord, audioName: req.files.audio.name}
      }

      // Saves changes to gpsData
      gpsData.data[targetIndex] = updatedCoord;
      promiseList.push(updateData(gpsData));
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
function updateData(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + path + gpsDataFileName, JSON.stringify(data), 'utf-8', function (err) {
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
function getData(fullPath) {
  return new Promise((resolve, reject) => {
  fs.access(__dirname + path + gpsDataFileName, err => {
      if (err) {
        console.log(err);
        reject(err)
      }
      else {
        fs.readFile(fullPath, 'utf-8', function(err, data) {
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
function removeFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.access(__dirname + path + fileName, err => {
      if (err) {
        return reject(err);
      }
      else {
        fs.unlink(__dirname + path + fileName, function (err) {
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

module.exports = router;