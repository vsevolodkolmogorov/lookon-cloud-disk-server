const Router = require('express')
const router = new Router()
const lookController = require('../controllers/lookController')

router.post('/', lookController.create)

router.get('/', lookController.getAll)

module.exports = router