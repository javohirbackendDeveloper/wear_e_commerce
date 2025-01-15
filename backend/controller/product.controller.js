const redis = require("../libraries/redis");
const productSchema = require("../schema/product.schema");
const cloudinary = require("../libraries/cloudinary");

// GET ALL PRODUCTS

const getAllProducts = async (req, res) => {
  try {
    const products = await productSchema.find({});

    res.json({ products });
  } catch (error) {
    console.log(error);
    // res.json(error);
  }
};

// GET ONE PRODUCT

const getOneProduct = async (req, res) => {
  try {
    const products = await productSchema.find();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

// GET ALL FEATURED PRODUCTS

const featuredProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    featuredProducts = (await productSchema.find({ isFeatured: true })).lean();

    if (!featuredProducts) {
      return res.json({ message: "There is not any featured Products" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    console.log(error);
  }
};

// GET RECOMMENDATED PRODUCTS

const getRecommendetProducts = async (req, res) => {
  try {
    const products = await productSchema.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          desc: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

// GET BY CATEGORY OF PRODUCTS

const getProductByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await productSchema.find({ category });
    res.json({ products });
  } catch (error) {
    console.log(error);
  }
};
// CREATE PRODUCT

const createProduct = async (req, res) => {
  try {
    const { title, desc, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await productSchema.create({
      title,
      desc,
      price,
      category,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
    });

    res.json(product);
  } catch (error) {
    console.log(error);
  }
};

//

const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await productSchema.findById(req.params.id);

    if (product) {
      product.isFeatured = !product.isFeatured;

      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      return res.json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await productSchema
      .find({ isFeatured: true })
      .lean();

    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log(error);
  }
}

// DELETE PRODUCT

const deleteProduct = async (req, res) => {
  try {
    const product = await productSchema.findById(req.params.id);

    if (!product) {
      return res.json({
        message: "This product not found",
      });
    }

    await productSchema.deleteOne({ _id: product.id });

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];

      try {
        await cloudinary.uploader.destroy(`product/${publicId}`);
        console.log("Deleted image from cloudinary");
      } catch (error) {
        console.log(error);
      }
    }

    await productSchema.findByIdAndUpdate(req.params.id);
    res.json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  getOneProduct,
  featuredProducts,
  createProduct,
  deleteProduct,
  getRecommendetProducts,
  getProductByCategory,
  toggleFeaturedProduct,
};
