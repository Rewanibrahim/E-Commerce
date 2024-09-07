import mongoose, { Types } from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is required"],
        minLength:3,
        maxLength:305,
        trim:true,
        unique:true
    },
    slug:{
        type:String,
        minLength:3,
        maxLength:305,
        trim:true,
        unique:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:true
    },
    image:{
        secure_url:String,
        public_id:String
    },
    category:{
        type:Types.ObjectId,
        ref:"category",
        required:true
    },
    customId:String
},
{
    timestamps:true,
    versionKey:false
})

const subCategoryModel = mongoose.model("category",subCategorySchema)

export default subCategoryModel;