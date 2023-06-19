const {Merchandise, MerchandiseInfo, MerchandiseAvailable} = require('../models/models')
const ApiError = require('../error/apiError')
const uuid = require('uuid');
const path = require('path');
const {where} = require("sequelize");

class MerchandiseController {
    async create(req, res, next) {
        try {
            let {name, price, description, brandId, typeId, info} = req.body
            const file = req.files;

            let fileName;
            let fileNameExtra;
            let fileNameExtraS;
            let fileNameExtraT;

            if (!file) {
                fileName = null;
                fileNameExtra = null;
                fileNameExtraS = null;
                fileNameExtraT = null;
            } else {
                if (file.image) {
                    fileName = uuid.v4() + ".jpg";
                    file.image.mv(path.resolve(__dirname, "..", "static", fileName));
                } else {
                    fileName = null;
                }
                if (file.imageExtra) {
                    fileNameExtra = uuid.v4() + ".jpg";
                    file.imageExtra.mv(path.resolve(__dirname, "..", "static", fileNameExtra));
                } else {
                    fileNameExtra = null;
                }
                if (file.imageExtraSecond) {
                    fileNameExtraS = uuid.v4() + ".jpg";
                    file.imageExtraSecond.mv(path.resolve(__dirname, "..", "static", fileNameExtraS));
                } else {
                    fileNameExtraS = null;
                }
                if (file.imageExtraThird) {
                    fileNameExtraT = uuid.v4() + ".jpg";
                    file.imageExtraThird.mv(path.resolve(__dirname, "..", "static", fileNameExtraT));
                } else {
                    fileNameExtraT = null;
                }
            }

            let merchandise;
            merchandise = await Merchandise.create({
                name,
                price,
                description,
                image: fileName,
                imageExtra: fileNameExtra,
                imageExtraSecond: fileNameExtraS,
                imageExtraThird: fileNameExtraT,
                brandId,
                typeId
            });

            if (info) {
                info = JSON.parse(info);
                info.forEach(i => {
                    MerchandiseInfo.create({
                        merchandiseId: merchandise.id,
                        title: i.title,
                        description: i.description,
                    })
                })
            }

            return res.json(merchandise);

        } catch (e) {
            console.log(e);
            next(ApiError.BadRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            let {name, price, description, brandId, typeId, merchandiseId, info} = req.body
            const file = req.files;

            let fileName;
            let fileNameExtra;
            let fileNameExtraS;
            let fileNameExtraT;

            if (!file) {
                fileName = null;
                fileNameExtra = null;
                fileNameExtraS = null;
                fileNameExtraT = null;
            } else {
                if (file.image) {
                    fileName = uuid.v4() + ".jpg";
                    file.image.mv(path.resolve(__dirname, "..", "static", fileName));
                } else {
                    fileName = null;
                }
                if (file.imageExtra) {
                    fileNameExtra = uuid.v4() + ".jpg";
                    file.imageExtra.mv(path.resolve(__dirname, "..", "static", fileNameExtra));
                } else {
                    fileNameExtra = null;
                }
                if (file.imageExtraSecond) {
                    fileNameExtraS = uuid.v4() + ".jpg";
                    file.imageExtraSecond.mv(path.resolve(__dirname, "..", "static", fileNameExtraS));
                } else {
                    fileNameExtraS = null;
                }
                if (file.imageExtraThird) {
                    fileNameExtraT = uuid.v4() + ".jpg";
                    file.imageExtraThird.mv(path.resolve(__dirname, "..", "static", fileNameExtraT));
                } else {
                    fileNameExtraT = null;
                }
            }

            let merchandise;

            let merchandiseActual = await Merchandise.findOne({where: {id: merchandiseId}})
            merchandise = await Merchandise.update({
                name,
                price,
                description,
                image: fileName !== null ? fileName : merchandiseActual.image,
                imageExtra: fileNameExtra === null ? merchandiseActual.imageExtra : fileNameExtra,
                imageExtraSecond: fileNameExtraS === null ? merchandiseActual.imageExtraSecond : fileNameExtraS,
                imageExtraThird: fileNameExtraT === null ? merchandiseActual.imageExtraThird : fileNameExtraT,
                brandId: brandId === null ? merchandiseActual.brandId : brandId,
                typeId: typeId === null ? merchandiseActual.typeId : typeId
            }, {where: {id: merchandiseId}});

            if (info) {
                info = JSON.parse(info);
                info.forEach(i => {
                    MerchandiseInfo.update({
                        title: i.title,
                        description: i.description,
                    }, {where: {id: i.id}})
                })
            }

            return res.json(merchandise);

        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        let {brandId, typeId, limit, page, admin} = req.query
        try {
            page = page || 1;
            let offset = page * limit - limit;
            let merchandises;
            if (!brandId && !typeId) {
                if (admin) {
                    merchandises = await Merchandise.findAndCountAll()
                    merchandises.rows.map(m => {
                    })
                } else {
                    merchandises = await Merchandise.findAndCountAll({limit, offset})
                }
            }
            if (brandId && !typeId) {
                merchandises = await Merchandise.findAndCountAll({where: {brandId}, limit, offset})
            }
            if (typeId && !brandId) {
                merchandises = await Merchandise.findAndCountAll({where: {typeId}, limit, offset})
            }
            if (brandId && typeId) {
                merchandises = await Merchandise.findAndCountAll({where: {brandId, typeId}, limit, offset})
            }

            return res.json(merchandises);
        } catch (e) {
            console.log(e);
            next(ApiError.BadRequest(e.message));
        }
    }

    async getOne(req, res) {
        let {id} = req.params
        let merchandise = await Merchandise.findOne({
            where: {id},
            include: [{model: MerchandiseInfo, as: "info"}]
        })
        let merchandiseAvailable = await MerchandiseAvailable.findAll({where: {merchandiseId: id}})

        let result = {merchandise, merchandiseAvailable}
        return res.json(result);
    }

    async delete(req, res) {
        const {merchandiseId} = req.body
        const merchandise = await Merchandise.destroy({where: {id: merchandiseId}})
        return res.json(merchandise);
    }
}

module.exports = new MerchandiseController()