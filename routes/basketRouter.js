const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/',  orderController.create);
router.post('/update',  orderController.update);

router.get('/', orderController.getAll);

router.delete('/', orderController.delete);


module.exports = router