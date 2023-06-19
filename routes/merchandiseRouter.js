const Router = require('express')
const router = new Router()
const merchandiseController = require('../controllers/merchandiseController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/',checkRole('ADMIN'), merchandiseController.create)
router.post('/update',checkRole('ADMIN'), merchandiseController.update)
router.get('/', merchandiseController.getAll)
router.get('/:id', merchandiseController.getOne)
router.delete('/', merchandiseController.delete)



module.exports = router