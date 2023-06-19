const Router = require('express')
const router = new Router()
const seasonsController = require('../controllers/SeasonsController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), seasonsController.create)

router.get('/', seasonsController.getAll)


module.exports = router