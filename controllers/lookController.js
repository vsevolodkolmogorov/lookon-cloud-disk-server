const {Look, LookMerchandise, Order} = require('../models/models')
const ApiError = require('../error/apiError')

class LookController {
    async create(req, res, next) {
        try {
            let {name, description, merchandise} = req.body
            console.log(name,description,merchandise);

            const look = await Look.create({name, description});

            if (merchandise) {
                merchandise = JSON.parse(merchandise);
                merchandise.forEach(i => {
                    LookMerchandise.create({
                        merchandiseId: i.id,
                        lookId: look.id
                    })
                })
            }

            return res.json(look);

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const lookMerchandise = await LookMerchandise.findAll();
        const look = await Look.findAll();

        return res.json({look, lookMerchandise});
    }

}

module.exports = new LookController()