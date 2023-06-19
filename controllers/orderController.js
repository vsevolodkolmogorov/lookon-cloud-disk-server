const {Order} = require("../models/models");
const {MailService} = require("../service/mailService");
const mailService = require("../service/mailService");

class OrderController {
    async create(req, res) {
        const {selectedSize, userId, merchandiseId, orderStatusId, sizeId} = req.body;
        const basketMerchandise = await Order.create({count: 1, selectedSize, sizeId, userId, merchandiseId, orderStatusId})
        return res.json(basketMerchandise);
    }

    async update(req, res) {
        const {createdAt, count, orderStatusId, orderNumber, addressId, email, price, names, sizes} = req.body;
        if (orderStatusId === null) {
            await Order.update({
                count: count,
            }, {where: {createdAt: createdAt, orderNumber: null}})
        } else {
            try {
                await Order.update({
                    orderStatusId: orderStatusId,
                    orderNumber: orderNumber,
                    addressId: addressId
                }, {where: {createdAt: createdAt, orderNumber: null}})
                console.log(email,names,price,sizes);
                await mailService.sendCheckMail(email,names,price,sizes);
            } catch (e) {
                console.log(e);
            }
        }
    }

    async getAll(req, res) {
        const basketMerchandise = await Order.findAll()
        return res.json(basketMerchandise);
    }

    async delete(req, res) {
        const {createdAt} = req.body;
        const merchandise = await Order.destroy({where: {createdAt: createdAt}})
        console.log(`deleted row(s): ${merchandise}`);
        return res.json(merchandise);
    }

}

module.exports = new OrderController()