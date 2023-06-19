module.exports = class UserDto {
    firstName;
    lastName;
    secondName;
    patronymic;
    genderId;
    birthdayDate;
    phoneNumber;
    role;
    email;
    id;
    isActivated;

    constructor(model) {
        this.firstName = model.firstName;
        this.secondName = model.secondName;
        this.lastName = model.lastName;
        this.patronymic = model.patronymic;
        this.genderId = model.genderId;
        this.birthdayDate = model.birthdayDate;
        this.phoneNumber = model.phoneNumber;
        this.email = model.email;
        this.id = model.id;
        this.role = model.role;
        this.isActivated = model.isActivated;
    }
}