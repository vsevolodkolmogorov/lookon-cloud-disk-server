const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING},
    phoneNumber: {type: DataTypes.STRING(11), allowNull: true},
    firstName: {type: DataTypes.STRING, allowNull: true},
    secondName: {type: DataTypes.STRING, allowNull: true},
    patronymic: {type: DataTypes.STRING, allowNull: true},
    birthdayDate: {type: DataTypes.DATE, allowNull: true}
})

const Gender = sequelize.define('gender', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Address = sequelize.define('address', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    city: {type: DataTypes.STRING},
    index: {type: DataTypes.STRING(6)},
    street: {type: DataTypes.STRING},
    house: {type: DataTypes.STRING},
    corpus: {type: DataTypes.STRING},
    flat: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING, allowNull: true},
})

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING(550), required: true}
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.INTEGER},
    sizeId: {type: DataTypes.INTEGER},
    selectedSize: {type: DataTypes.STRING},
    orderNumber: {type: DataTypes.STRING, allowNull: true},
})

const OrderStatus = sequelize.define('order_status', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
})

const Merchandise = sequelize.define('merchandise', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING,unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    description: {type: DataTypes.STRING(550), allowNull: true},
    image: {type: DataTypes.STRING},
    imageExtra: {type: DataTypes.STRING},
    imageExtraSecond: {type: DataTypes.STRING},
    imageExtraThird: {type: DataTypes.STRING},
})

const MerchandiseAvailable = sequelize.define('merchandise_available', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.INTEGER, allowNull: true},
    discount: {type: DataTypes.DOUBLE, allowNull: true},
})

const MerchandiseInfo = sequelize.define('merchandise_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const Size = sequelize.define('size', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    size: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const TypeBrand = sequelize.define('type_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Look = sequelize.define('look', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const LookMerchandise = sequelize.define('look_merchandise', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    merchandiseId: {type: DataTypes.INTEGER, allowNull: false}
})

User.hasOne(Token)
Token.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

Merchandise.hasMany(Order)
Order.belongsTo(Merchandise)

Gender.hasMany(User)
User.belongsTo(Gender)

OrderStatus.hasMany(Order)
Order.belongsTo(OrderStatus)

Address.hasMany(Order)
Order.belongsTo(Address)

Address.hasMany(User)
User.belongsTo(Address)

Merchandise.hasMany(MerchandiseAvailable)
MerchandiseAvailable.belongsTo(Merchandise)

Size.hasMany(MerchandiseAvailable)
MerchandiseAvailable.belongsTo(Size)

Type.hasMany(Merchandise)
Merchandise.belongsTo(Type)

Brand.hasMany(Merchandise)
Merchandise.belongsTo(Brand)

Merchandise.hasMany(MerchandiseInfo, {as: 'info'})
MerchandiseInfo.belongsTo(Merchandise)

Look.hasMany(LookMerchandise, {as: 'merchandise'})
LookMerchandise.belongsTo(Look)

module.exports = {
    User,
    Order,
    Merchandise,
    Type,
    Brand,
    Size,
    TypeBrand,
    MerchandiseInfo,
    Look,
    LookMerchandise,
    MerchandiseAvailable,
    Token,
    Gender,
    Address,
}
