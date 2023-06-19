const ApiError = require("../error/apiError");
const {User, Basket, Address} = require("../models/models");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mailService");
const UserDto = require("../dtos/userDtos");
const tokenService = require("./tokenService");

class UserService {
    async registration(email, password, role, firstName) {
        const candidate = await User.findOne({where: {email}});

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} уже существует!`);
        }

        try {
            const hashPassword = await bcrypt.hash(password, 5);
            const activationLink = uuid.v4();
            const user = await User.create({email, role, password: hashPassword, activationLink, firstName});
            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {...tokens, user: userDto}
        } catch (e) {
            console.log(e)
        }
    }

    async login(email, password) {
        const user = await User.findOne({where: {email}});

        if (!user) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} не найден!`);
        }
        let comparePassword = bcrypt.compareSync(password, user.password);

        if (!comparePassword) {
            throw ApiError.BadRequest('Указан неверный пароль!');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await User.findOne({where: {activationLink}});
        if (!user) {
            throw ApiError.BadRequest(`Неккоректная ссылка активации`);
        }
        user.isActivated = true;
        await user.save();
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        let address;

        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findOne({where: {id: userData.id}});
        const userAddress = await Address.findOne({where: {id: user.addressId}});
        userAddress === undefined ? address = null : address = userAddress

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto, address: address};
    }

    async updateUser(email,firstName,secondName,patronymic,genderCode, birthdayDate, phoneNumber,addressId,role) {
        try {
            console.log(email,firstName,secondName,patronymic,genderCode, birthdayDate, phoneNumber,addressId,role);
            const data = await User.update({firstName:firstName,secondName:secondName,patronymic:patronymic,genderId:genderCode,birthdayDate:birthdayDate,phoneNumber:phoneNumber,addressId:addressId,role:role},{where:{email: email}});
            const user = await User.findOne({where: {email: email}});
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            return {...tokens, user: userDto};
        } catch (e) {
            console.log(e)
        }
    }

    async createAddress(city, street, index, house, corpus, flat, description, userEmail, addressId, inBasket) {
        try {
            let address;
            if (addressId === undefined) {
                let check = await Address.findOne({where: {city:city,street:street,index:index,house:house,corpus:corpus,flat:flat,description:description}});
                if (check) {
                    address = check;
                } else {
                    address = await Address.create({city:city,street:street,index:index,house:house,corpus:corpus,flat:flat,description:description});
                }

                if (!inBasket) {
                    await User.update({addressId:address.id},{where:{email: userEmail}});
                }
            } else {
                await Address.update({city:city,street:street,index:index,house:house,corpus:corpus,flat:flat,description:description}, {where: {id: addressId}});
                address = await Address.findOne({where: {id: addressId}});
            }
            const user = await User.findOne({where: {email: userEmail}});
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {...tokens, address: address};
        } catch (e) {
            console.log(e)
        }
    }
    
    async getAllUsers() {
        const users = await User.findAll();
        return users;
    }

    async getAllAddress() {
        const address = await Address.findAll();
        return address;
    }

}

module.exports = new UserService();