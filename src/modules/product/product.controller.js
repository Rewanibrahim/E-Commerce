import categoryModel from "../../../db/models/category.model.js";
import productModel from "../../../db/models/product.model.js";
import subCategoryModel from "../../../db/models/subCategory.model.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/classError.js";


// ===============================    createproduct    ===============================
export const createProduct = asyncHandler(async (req, res, next) => {
    const subcategoryExist = await subcategoryModel.findOne({ _id: subcategory, category });
    if (!subcategoryExist) {
      return next(new AppError("subcategory not exist", 404));
    }
  
    const brandExist = await brandModel.findOne({ _id: brand });
    if (!brandExist) {
      return next(new AppError("brand already exist", 404));
    }
  
    const productExist = await productModel.findOne({ title: title.toLowerCase() });
    if (productExist) {
      return next(new AppError("product already exist", 404));
    }
  
    const subPrice = price - (price * (discount || 0) / 100);

  
    if (!req.file) {
      return next(new AppError("image is required", 404));
    }

    for (const file of req.files.coverImages){
        const {secure_url,public_id } =await cloudinary.uploader.upload(file.path,{
            folder:`Ecommerce/products/${productExist.customId}/subCategories/${subCategoryExist.customId}`
        })
        list.push({secure_url,public_id})
    }
    const {secure_url,public_id} =await cloudinary.uploader.upload(req.files.image[0].path,{
      folder:`Ecommerce/products/${productExist.customId}/subCategories/${subCategoryExist.customId}`
    })

    const product = await productModel.create({
        title,
        slug: slugify(title, {
          lower: true,
          replacement: "-",
        }),
        description,
        price,
        discount,
        subPrice,
        stock,
        category,
        subCategory,
        brand,
        image: { secure_url, public_id },
        coverImages: list,
        customId,
        createdBy: req.user._id
      });
      
  
    res.status(201).json({ msg: "done", product });
  });

// ============================== getProducts ==============================
export const getProducts = asyncHandler(async (req, res, next) => {

const apiFeatures =new ApiFeatures(productModel.find(),req.query)
.pagination()
.filter()
.search()
.select()
.sort()
const products = await apiFeatures.mongooseQuery

res.status(200).json({ msg: "done", page, products });

});
//=============================== update products ==================================
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { stock, discount, price, brand, subCategory, category, description, title } = req.body;
  const {id} = req.params
  // Check if category exist
  const categoryExist = await categoryModel.findOne({ _id: category });
  if (!categoryExist) {
    return next(new AppError("category not exist", 404));
  }

  // Check if subCategory exist
  const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
  if (!subCategoryExist) {
    return next(new AppError("subCategory not exist", 404));
  }

  // Check if brand exist
  const brandExist = await brandModel.findOne({ _id: brand });
  if (!brandExist) {
    return next(new AppError("brand already exist", 404));
  }

  // Check if product exist
  const product = await productModel.findOne({ _id: id,createdBy:req.user._id});
  if (product) {
    return next(new AppError("product already exist", 404));
  }
  if (title) {
    if (title.toLowerCase() == product.title) {
      return next(new AppError("title match old title", 409));
    }
  
    if (await productModel.findOne({ title: title.toLowerCase() })) {
      return next(new AppError("title already exist before", 409));
    }
  
    product.title = title.toLowerCase();
    product.slug = slugify(title, {
      lower: true,
      replacement: "-"
    });
  }
  if (description) {
    product.description = description;
}

if (stock) {
    product.stock = stock;
}

if (price && discount) {
    product.subPrice = price - (price * (discount / 100));
    product.price = price;
    product.discount = discount;
} else if (price) {
    product.subPrice = price - (price * (product.discount / 100));
    product.price = price;
} else if (discount) {
    product.subPrice = product.price - (product.price * (discount / 100));
    product.discount = discount;
}

if (req.files) {
  if (req.files.image[0]) {
      await cloudinary.uploader.destroy(product.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
          folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/mainImage`
      });
      product.image = {secure_url,public_id}
  }
  if (req.files?.coverImages?.length) {
    await cloudinary.api.delete_resourices_by_prefix(`Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/coverImages`)
    let list = [];
for (const file of req.files.coverImages) {
  const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
      folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/coverImages`
  });

  list.push({ secure_url, public_id });
   }
   product.coverImages =list
  }
}
await product.save()

res.status(201).json({msg:"done",product})
})