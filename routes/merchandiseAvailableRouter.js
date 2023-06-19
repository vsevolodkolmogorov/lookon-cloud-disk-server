const Router = require('express')
const router = new Router()
const merchandiseAvailableController = require('../controllers/merchandiseAvailableController')
const checkRole = require("../middleware/checkRoleMiddleware");
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");

router.post('/',checkRole('ADMIN'), merchandiseAvailableController.create)
router.post('/update', merchandiseAvailableController.update)
router.delete('/delete', merchandiseAvailableController.delete);
router.get('/', merchandiseAvailableController.getAll)


module.exports = router