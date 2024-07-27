var express = require('express');
var router = express.Router();

const Place = require('../models/place')

const { checkBody } = require('../functions/checkbody')

router.post('/places', (req, res) => {
    !checkBody(req.body, ['nickname', 'name', 'latitude', 'longitude']) && res.json({ result: false, error: 'checkbody returned false' })

    const newPlace = new Place({
        nickname: req.body.nickname,
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    })

    newPlace.save().then(() => {
        Place.find().then(data => { res.json({ result: true, data: data }) })

    })
        .catch(error => {
            res.json({ result: false, error })
        })

})

router.get('/places/:nickname', (req, res) => {
    Place.find({ nickname: req.params.nickname })
        .then((data) => {
            if (data.length > 0) {
                const places = data.map(e => {
                    return { nickname: e.nickname, name: e.name, latitude: e.latitude, longitude: e.longitude }
                })
                res.json({ result: true, places: places })
            } else {
                res.json({ result: true, message: 'No data' })
            }
        })
        .catch(error => {
            res.json({ result: false, error })
        })
})

router.delete('/places', (req, res) => {

    if (!checkBody(req.body, ['nickname', 'name'])) {
        res.json({ result: false, error: 'checkbody returned false' });
        return;
    }

    const { nickname, name } = req.body;

    Place.deleteOne({ nickname: { $regex: new RegExp(nickname, 'i') }, name: name })
        .then(data => {
            if (data.deletedCount > 0) {
                res.json({ result: true });
            } else {
                res.json({ result: false, error: 'No element deleted' })
            }
        })
})

module.exports = router;
