const Router = require('express')
const router = new Router()

const brand = require('./brandRouter')
const type = require('./typeRouter')
const size = require('./sizeRouter')
const user = require('./userRouter')
const merchandise = require('./merchandiseRouter')
const merchandiseAvailable = require('./merchandiseAvailableRouter')
const basket = require('./basketRouter')
const look = require('./lookRouter')

router.use('/user', user)
router.use('/look', look)
router.use('/type', type)
router.use('/size', size)
router.use('/brand', brand)
router.use('/merchandise', merchandise)
router.use('/merchandiseAvailable', merchandiseAvailable)
router.use('/basket', basket)


module.exports = router