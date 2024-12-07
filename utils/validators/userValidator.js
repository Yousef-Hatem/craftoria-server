const mongoose = require('mongoose');
const {isEmail, isStrongPassword} = requier('validator');
const User = require('/models/userModel')


//Create User Validation
function createUser(userData){
    const errors = [];

    if (userData.name.length <3 || userData.name.length > 30){
        errors.push('Name must be between 3 and 30 characters');
    }

    if (!isEmail(userData.email)){
        errors.push('Email must be a valid email address');
    }

    if (isStrongPassword(userData.password,{
        minLength: 6,
        minLowercase:1,
        minUppercase:1,
        minNumber:1,
        minSymbols:1
    })){
        errors.push('Password must be at least 6 characters long');
    }

    if (userData.phoneNumber && !/^\+20\d{10}$/.test(userData.phoneNumber) && !/^\d{11}$/.test(userData.phoneNumber) ){
        errors.push('Invalid phone number');
    }
    
    return errors;
}

function isValidObjectId(id){
    return mongoose.Types.ObjectId.isValid(id);
}

//Get User Validation
async function getUser(userId){
    if (!isValidObjectId(userId)){
        throw new Error('Invalid user id');
    }

    const user = await User.findById(userId);
    if (!user){
        throw new Error('User not found');
    }
}

//Update User Validation
async function updateUser(userId, updatedData){
    if (!isValidObjectId(userId)){
        throw new Error('Invalid user ID');
    }

    const user = await User.findById(userId);
    if(!user){
        throw new Error('User not found');
    }

    Object.assign(user, updatedData);
    await user.save();

    return user;
}

//Delete User Validation
async function deleteUser(userId){
    if(!isValidObjectId(userId)){
        throw new Error('Invalid user ID');
    }

    const user = await User.findByIdAndDelete(userId);
    if(!user){
        throw new Error('User not found');
    }
}

async function updateLoggedUserData(userId, updatedData){
    if(!isValidObjectId(userId)){
        throw new Error('Invalid user ID');
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {new: true});
    if(!user){
        throw new Error('User not found');
    }

    return user;
}

module.exports ={createUser, getUser, updateUser, deleteUser, updateLoggedUserData}