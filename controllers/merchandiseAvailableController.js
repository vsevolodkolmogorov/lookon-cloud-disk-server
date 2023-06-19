const {MerchandiseAvailable} = require('../models/models')
const ApiError = require('../error/apiError')
const userService = require("../service/userService");
const UserDto = require("../dtos/userDtos");
const tokenService = require("../service/tokenService");

class MerchandiseAvailableController {
    async create(req, res, next) {
        try {
            let {count, discount, merchandiseId, sizeId} = req.body

            let merchandise;
            const available = await MerchandiseAvailable.findOne({where: {merchandiseId: merchandiseId,sizeId: sizeId}})

            if (!available) {
                merchandise = await MerchandiseAvailable.create({
                    count,
                    discount,
                    merchandiseId,
                    sizeId
                });
            } else {
                try {
                    let countNew = available.count + Number(count);
                    merchandise = await MerchandiseAvailable.update({count:countNew,discount:discount},{where: {merchandiseId:merchandiseId,sizeId:sizeId}});
                } catch (e) {
                    console.log(e);
                }

            }

            return res.json(merchandise);
        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const merchandise = await MerchandiseAvailable.findAll();
        return res.json(merchandise);
    }

    async update(req, res, next) {
        try {
            const {count, merchandiseId, sizeId, isCancel} = req.body;
            const available = await MerchandiseAvailable.findOne({where: {merchandiseId: merchandiseId,sizeId: sizeId}})
            if (isCancel) {
                await MerchandiseAvailable.update({count:count},{where: {merchandiseId: merchandiseId,sizeId: sizeId}});
            } else {
                await MerchandiseAvailable.update({count:available.count - count},{where: {merchandiseId: merchandiseId,sizeId: sizeId}});
            }
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res) {
        const {merchandiseId} = req.body
        const merchandise = await MerchandiseAvailable.destroy({where: {merchandiseId: merchandiseId}})
        return res.json(merchandise);
    }

}

module.exports = new MerchandiseAvailableController()