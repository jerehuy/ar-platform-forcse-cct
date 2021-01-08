const router = require('express').Router();
const configFile =  '/../config.json';
const fs = require('fs');

router.route('/').get((req, res) => {
    fs.access(__dirname + configFile, err => {
        if (err) {
            console.log(err);
            res.status(400).send("config.json couldn't be read");
        }
        else {
            fs.readFile(__dirname + configFile, 'utf-8', function(err, data) {
                if (err) {
                    console.log(err);
                    res.status(400).send("config.json couldn't be read");
                }
                else {
                    res.json(JSON.parse(data))
                }
            });
        }
    })
})
router.route('/update').post((req, res) => {
    fs.access(__dirname + configFile, err => {
        if (err) {
            console.log(err);
            res.status(400).send("config.json couldn't be read");
        }
        else {
            var data = {path: req.body.path}
            fs.writeFile(__dirname + configFile, JSON.stringify(data, null, 4), 'utf-8', function(err, data) {
                if (err) {
                    console.log(err);
                    res.status(400).send("path couldn't be updated");
                }
                else {
                    res.send(data)
                }
            });
        }
    })
})

module.exports = router;