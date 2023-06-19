const jwt = require('jsonwebtoken')
const ApiError = require("../error/apiError");
const tokenService = require("../service/tokenService");

module.exports = function (role) {
    return function (req,res,next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const authorizationHeader = req.headers.authorization;
            console.log(req.headers);

            if (!authorizationHeader) {
                console.log("authorizationHeader");
                return next(ApiError.UnauthorizedError())
            }

            const accessToken = req.headers.authorization.split(' ')[1]

            if (!accessToken) {
                console.log("accessToken");
                return next(ApiError.UnauthorizedError())
            }

            const userData = tokenService.validateAccessToken(accessToken, process.env.SECRET_KEY);
            if (!userData) {
                console.log("validateAccessToken");
                return next(ApiError.UnauthorizedError())
            }

            if (userData.role !== role) {
                res.status(403).json({message: "Нет доступа"})
            }
            req.user = userData;

            next()
        } catch (e) {
            res.status(401).json({message: "Не авторизован"})
        }
    }
}






