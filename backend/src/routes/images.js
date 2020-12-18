const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dataFileName = 'image_data.json';
const path = '../../../../ResourcesAR/';

// Reads image_data.json and sends its contents
router.route('/').get((req, res) => {
  getData()
  .then(data => {
    res.json(JSON.parse(data));
  })
  .catch(err => {
    res.status(400).send("Resources folder could not be found. Check the path!");
  })
});

// Adds a new image object
router.route('/add').post((req, res) => {

  getData()
  .then(data => {

    // Creates a new image object
    var dataAR = JSON.parse(data)
    var newImageObject = {
      id: uuidv4(),
      name: req.body.name,
      trackedImageName: req.files.image.name,
      text: req.body.description,
      pictureName: req.files.image.name,
      contentImageNames: []
    }

    // Downloads new content images and adds their names to the image object
    contentImageNames = [];
    promiseList = [];
    if(req.files && req.files.contentImages) {
      [].concat(req.files.contentImages).forEach(function(img) {
        var newPromise = addFile(__dirname + path + img.name, img.data);
        promiseList.push(newPromise)
        contentImageNames.push(img.name)
      })
      newImageObject.contentImageNames = contentImageNames;
    }

    // Downloads a new audio file if it is given
    if(req.files && req.files.audio) {
      var newPromise = addFile(__dirname + path + req.files.audio.name, req.files.audio.data);
      promiseList.push(newPromise);
      newImageObject.audioName = req.files.audio.name;
    }

    dataAR.data.push(newImageObject)

    // Downloads a new image file used for image tracking
    promiseList.push(addFile(__dirname + path + req.files.image.name, req.files.image.data));

    // Adds the new object to image_data.json
    promiseList.push(updateData(dataAR));


    Promise.all([promiseList])
    .then(response => {
      return res.status(201).end();
    })
    .catch(err => {
      return res.status(500).send("Failed to add new image object");
    })
  })
  .catch(err => {
    res.status(400).send("Failed to add new image object");
  })
});

// Deletes an existing image object
router.delete("/:imageId", (req, res) => {
  fs.access(__dirname + path + dataFileName, err => {

    if (err) {
      console.log(err);
      res.status(400).send("Failed to remove image object");
    }
    else {

      // Finds the target image object from image_data.json data and removes it
      var targetImageId = req.params.imageId;
      var removedObject;
      var updatedData = req.body.imageData.filter(x => {
        if(x.id == targetImageId) {
          removedObject = x;
          oldImageName = x.trackedImageName;
        }
        return x.id != targetImageId;
      })

      var promiseList = [];

      //Removes the old image file if it isn't used by other objects
      var oldImageCount = updatedData.filter (({trackedImageName}) => trackedImageName === removedObject.trackedImageName).length;
      if(removedObject.trackedImageName &&  oldImageCount <= 0) {
        promiseList.push(removeFile(oldImageName));
      }

      //Removes the old audio file if it isn't used by other objects
      if(removedObject.audioName) {
        var oldAudioCountImage = req.body.imageData.filter(({audioName}) => audioName === removedObject.audioName).length;
        var oldAudioCountGPS = req.body.gpsData.filter(({audioName}) => audioName === removedObject.audioName).length;
        if(oldAudioCountImage <= 1 && oldAudioCountGPS <= 0) {
          promiseList.push(removeFile(removedObject.audioName));
        }
      }

      // Updates changes to the gps_data.json
      var dataJson = {data: updatedData}
      promiseList.push(updateData(dataJson));


      Promise.all([promiseList])
      .then(response => {
        res.status(201).send(dataJson);
      })
      .catch(err => {
        return res.status(500).send("Failed to remove image object");
      })
    }
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

// Function for updating image_data.json
function updateData(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + path + dataFileName, JSON.stringify(data), 'utf-8', function (err) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      else {
        console.log(dataFileName + ' updated successfully');
        return resolve();
      }
    })
  })
}

// Function for image_data.json file
function getData() {
  return new Promise((resolve, reject) => {
  fs.access(__dirname + path + dataFileName, err => {
      if (err) {
        console.log(err);
        reject(err)
      }
      else {
        fs.readFile(__dirname + path + dataFileName, 'utf-8', function(err, data) {
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

// Updates an existing image object
router.put("/:imageId", (req, res) => {
  getData()
  .then(data => {

    // Finds an image object and updates it
    var dataAR = JSON.parse(data)
    var targetIndex = dataAR.data.findIndex(x => x.id == req.body.id);
    var updatedImage = {...dataAR.data[targetIndex],
                        name: req.body.name,
                        trackedImageName: req.body.trackedImageName,
                        text: req.body.text,
                        audioName: req.body.audioName,
                        pictureName: req.body.pictureName,
                        contentImageNames: []
    }

    // Downloads new image files if they are given and removes old images not needed anymore
    var promiseList = [];
    var imagesToRemove = [];

    var allTrackedImages = [...new Set(dataAR.data.map(img => img.trackedImageName))];
    var allContentImages = [...new Set((dataAR.data.map(img => {
      if(img.name === req.body.name) {
        return req.body.contentImageNames;
      }else {
        return img.contentImageNames
    }})).flat())];
    
    // Old image files are removed if they are not used by other image objects
    if(req.files && req.files.image) {
      var oldTrackedImageName = dataAR.data[targetIndex].trackedImageName;
      promiseList.push(addFile(__dirname + path + req.files.image.name, req.files.image.data))
      var oldTrackedImageCount = dataAR.data.filter (({trackedImageName}) => trackedImageName === oldTrackedImageName).length <= 1;
      if(oldTrackedImageName !== req.files.image.name && oldTrackedImageCount && !allContentImages.includes(oldTrackedImageName)) {
        imagesToRemove.push(oldTrackedImageName);
      }
    }

    // All content images that are not needed are removed
    if(req.body.removedImages) {
      var removedImages = req.body.removedImages;
      [].concat(removedImages).forEach(function(img){
        if(!allTrackedImages.includes(img) && !allContentImages.includes(img)) {
          imagesToRemove.push(img);
        }
      })
    }
    if(req.files && req.files.audio) {
      // Downloads a new audio file if it is given
      var oldAudioName = dataAR.data[targetIndex].audioName;
      promiseList.push(addFile(__dirname + path + req.files.audio.name, req.files.audio.data));

      // Removes the old audio file if it isn't used by other objects
      var oldAudioCountImage = dataAR.data.filter (({audioName}) => audioName === oldAudioName).length;
      var oldAudioCountGPS = 0;
      if(req.body.gpsAudioNames) {
        oldAudioCountGPS = [].concat(req.body.gpsAudioNames).filter (audioName => audioName === oldAudioName).length;
      }
      if(oldAudioName !== req.files.audio.name && oldAudioCountImage <= 1 && oldAudioCountGPS <= 0) {
        promiseList.push(removeFile(oldAudioName));
      }
    }
    // Removes old images
    var uniqueImagesToRemove = [...new Set(imagesToRemove)]
    uniqueImagesToRemove.forEach(img => {
      promiseList.push(removeFile(img));
    });

    // Downloads new content images if given
    if(req.files && req.files.contentImages) {

      [].concat(req.files.contentImages).forEach(function(img) {
        if(!(req.files.image && img.name === req.files.image.name)) {
          const newPromise = addFile(__dirname + path + img.name, img.data);
          promiseList.push(newPromise);
        }
      })
    }

    // Updates file names and saves changes image_data.json
    if(req.files && req.files.image) {
      updatedImage = {...updatedImage, trackedImageName: req.files.image.name}
    }
    if(req.body.contentImageNames) {
      updatedImage = {...updatedImage, contentImageNames: [].concat(req.body.contentImageNames)};
    }
    if(req.files && req.files.audio) {
      updatedImage = {...updatedImage, audioName: req.files.audio.name}
    }
    dataAR.data[targetIndex] = updatedImage;

    promiseList.push(updateData(dataAR));

    
    Promise.all([promiseList])
    .then(response => {
      return res.status(201).send(dataAR);
    })
    .catch(err => {
      return res.status(500).send("Failed to update image object");
    })
  })
  .catch(err => {
    res.status(400).send("Failed to update image object");
  })
});

module.exports = router;