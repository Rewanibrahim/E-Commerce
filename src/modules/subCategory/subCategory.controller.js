import subCategoryModel from "../../../db/models/subCategory.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/classError.js";


//<<<<<<<<<<<<<<<<<<<<<<<<<<<< create category >>>>>>>>>>>>>>>>>>>>>>
// ===============================    createCategory    ===============================
export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    const categoryExist = await subCategoryModel.findOne({ name: name.toLowerCase() });
    if (categoryExist) {
        return next(new AppError("Category already exist", 409));
    }

    if (!req.file) {
        return next(new AppError("image is required", 404));
    }

    const customId = nanoid(5);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `EcommerceC42/categories/${customId}`
    });

    const category = await subCategoryModel.create({
        name,
        slug: slugify(name, {
            replacement: "-",
            lower: true
        }),
        image: { secure_url, public_id },
        customId,
        createdBy: req.user._id,
    });

    return res.status(201).json({ msg: "done", category });
});

//================== Update category ==========================
export const updateCategory = asyncHandler(async(req,res,next) =>{
    const {name} = req.body
    const {id} = req.params

    const category = await subCategoryModel.findOne({_id: id,createdBy:req.user._id})
    if(!category){
        return next(new AppError("category not exist",404))
    }

    if(name){
        if(name.toLowerCase() ===category.name){
            return next(new AppError("name should be different",400))
        }
        if(await subCategoryModel.findOne({name:name.toLowerCase()})){
            return next(new AppError("name already exist",409))
        }
        category.name = name.toLowerCase()
        category.slug = slugify(name, {
            replacement: "_",
            lower:true
        })
    }
    if (req.file){
        await cloudinary.uploader.destroy(category.image.public_id)
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
            folder:`e-commerce/categories/${category.customId}`
        })
        category.image = {secure_url , public_id}
    }
    await category.save()
    return res.status(201).json({msg:"done",category})
})