const ApiError = require('../error/apiError')
const userService = require("../service/userService")
const {validationResult} = require('express-validator')
const mailService = require("../service/mailService");
const {User} = require("../models/models");

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password, role, firstName} = req.body;
            const userData = await userService.registration(email, password, role, firstName);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async sendEmail(req, res, next) {
        try {
            const {email} = req.body;
            const candidate = await User.findOne({where: {email}});
            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${candidate.activationLink}`);
        } catch (e) {
            next(e);
        }
    }

    async sendCheck(req, res, next) {
        try {
            const {email, content} = req.body;
            let namesOfMerchandises = "";
            let price = 0;
            let sizes = "";
            content.map(item => {
                namesOfMerchandises = namesOfMerchandises + " " + item.name;
                price = item.price + price;
                sizes = sizes + " " + item.size;
            })
            await mailService.sendCheckMail(email, namesOfMerchandises, price, sizes);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL + "/login");
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req, res, next) {
        try {
            const {
                email,
                firstName,
                secondName,
                patronymic,
                genderCode,
                birthdayDate,
                phoneNumber,
                addressId,
                role
            } = req.body;
            console.log(email, firstName, secondName, patronymic, genderCode, birthdayDate, phoneNumber, addressId, role);
            const userData = await userService.updateUser(email, firstName, secondName, patronymic, genderCode, birthdayDate, phoneNumber, addressId, role);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async createAddress(req, res, next) {
        try {
            const {city, street, index, house, corpus, flat, description, userEmail, addressId, inBasket} = req.body;
            const userData = await userService.createAddress(city, street, index, house, corpus, flat, description, userEmail, addressId, inBasket);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getAllAddress(req, res, next) {
        try {
            const address = await userService.getAllAddress();
            return res.json(address);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController()