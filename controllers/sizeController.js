const {Size} = require("../models/models");

class SizeController {
    async create(req, res) {
        try {
            const {name} = req.body;
            const size = await Size.create({size:name});
            return res.json(size);
        } catch (e) {
            console.log("ошибка тут");
            console.log(e);
        }
    }

    async getAll(req, res) {
        const sizes = await Size.findAll();
        return res.json(sizes);
    }

    async getSizes(req, res) {
        try {
            let {id} = req.params;
            const sizes = await Size.findOne({where: {id: id}});
            return res.json(sizes);
        } catch (e) {
            console.log(e);
        }

    }

}

module.exports = new SizeController()