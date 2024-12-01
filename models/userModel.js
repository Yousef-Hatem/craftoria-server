const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');
let userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name is Required'],
        match:/^[a-zA-Z\s]/
    },
    email:{
        type:String,
        required:[true,'Email is Required'],
        unique:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ 
    },
    password:{
        type:String,
        required:[true, 'Password is Required'],
        minlenth:8,
        match:/^(?=.[a-z])(?=.[A-Z])(?=.\d)[A-Za-z\d@$!%?&]{8}$ /
    },
    cart:{
        items:[{
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
            },
            quantity:Number
        }]
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    address:[{
        street:String,
        buildingNumber:String,
        city:String,
        governorate:String,
        zipCode:String,
        country:String
    }],
    mobileNumbers:[{
        type:string,
        match:/^01[0-5][0-9]{8}$/
    }],
    favorite:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }]
});

userSchema.pre('save',async function(next){
    const user =this;
    if(!user.isModified('password'))return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    next();
});



const userModel = mongoose.model("User", userSchema);
module.exports = userModel;