const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { check , body} = require("express-validator");
const User = require("../../models/userModel");

exports.createUser = [
    check('name')
        .notEmpty()
        .isLength({min:3})
        .withMessage('Name must be at least 3 characters long.'),
    check('email')
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address"),
    check('password')
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 6 })
        .isStrongPassword()
        .withMessage('Password must be at least 6 characters long.')
]

exports.getUser = [
    check('userId')
        .isMongoId()
        .withMessage('Invalid user ID')
        .custom(async (value)=>{
            const user = await User.findById(value);
            if (!user){
                throw new Error('User not found');
            }
            return true;
        })
]

exports.updateUser = [
    check('userId')
        .isMongoId()
        .withMessage('Invalid user ID')
        .custom(async (value)=>{
            const user = await User.findById(value);
            if (!user){
                throw new Error('User not found');
            }
            return true;
        }),
        body('name')
            .optional()
            .isString()
            .trim(),
        body('email')
            .optional()
            .isEmail()
            .normaliseEmail()
]

exports.deleteUser = [
    check('userId')
        .isMongoId()
        .withMessage('Invalid user ID')
        .custom(async (value)=>{
            const user = await User.findById(value);
            if (!user){
                throw new Error('User not found');
            }
            return true;
        }),
        body('password')
            .optional()
            .custom(async (value,{req})=>{
                const user = req.user;
                const isMatch = await bcrypt.compare(value,user.password);
                if (!isMatch){
                    throw new Error('Incorrect password');
                }
                return true;
            })
]


exports.updateLoggedUserData = [
    check('userId')
        .isMongoId()
        .withMessage('Invalid user ID')
        .custom(async (value)=>{
            const user = await User.findById(value);
            if (!user){
                throw new Error('User not found');
            }
            return true;
        }),
        body('password')
            .custom(async (value,{req})=>{
                const user = req.user;
                const isMatch = await bcrypt.compare(value,user.password);
                if (!isMatch){
                    throw new Error('Incorrect password');
                }
                return true;
            }),
        body('newName')
            .optional()
            .isString()
            .trim(),
        body('newEmail')
            .optional()
            .isEmail()
            .normaliseEmail(),
        body('newPassword')
            .optional()
            .isStrongPassword()
            .custom(async (value, {req})=>{
                if(value){
                    const hashedPassword = await bcrypt.hash(value,10);
                    req.newPassword = hashedPassword;
                }
                return true;
            })

]