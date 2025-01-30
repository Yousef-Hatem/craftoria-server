const productModel=require("../models/productModel")

let getProduct= async(req,res)=>{
try{
const products=await productModel.find().populate("id");
res.status(200).json({message:"Product fetched successfully",data:products})
}
catch(err){
res.status(400).json({message:err.message})
}
};


let postProduct=async(req,res)=>{
    const newProduct=req.body
    try{
const createProduct=await productModel.create(newProduct)

res.status(200).json({message:"The product created successfully",date:createProduct})
}
    catch(err){
        res.status(400).json({message:err.message})
    }
}


let getProductById=async(req,res)=>{
    const {id}=req.params
    try{
        const getProduct=await productModel.findById(id)

        if(getProduct){
            res.status(200).json({message:"Product found successfully",data:getProduct})
        }else{
            res.status(404).json({message:" Product not found"})
        }
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}



let deleteSpecificProduct= async(req,res)=>{
    const {id}=req.params
    try{
        const deleteProduct=await productModel.findByIdAndDelete(id)
        if( deleteProduct){
            res.status(200).json({message:"Product deleted successfully",data:deleteProduct})
        }else{
            res.status(404).json({message:"Product not found"})
        }
    }catch(err){
        res.status(400).json({message:err.message})
    }
}




let updatedProduct=async(req,res)=>{
    const {id}=req.params
    const updates=req.body
    try{
        const update=await productModel.findByIdAndUpdate(id,updates,{
            new:true,
            runValidators:true
        })
        if(!update){
            res.status(404).json({message:"Product not found"})
        }
        res.status(200).json({message:"Product updated",data:update})
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
};

module.exports ={getProduct,postProduct,getProductById,deleteSpecificProduct,updatedProduct}