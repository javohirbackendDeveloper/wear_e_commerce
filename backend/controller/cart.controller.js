const productSchema = require("../schema/product.schema");

// GET CART OF PRODUCTS

const getCartProducts = async (req, res) => {
  try {
    const products = await productSchema.find({
      _id: { $in: req.user.cartItems },
    });
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON, quantity: item.quantity };
    });
    res.json(cartItems);
  } catch (error) {
    console.log(error);
  }
};

// ADD CART

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = req.user;

    const existingItem = user.cartItems?.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();

    res.json(user.cartItems);
  } catch (error) {
    console.log(error);
  }
};

// DELETE CART

const deleteToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    await user.save();

    res.json(user.cartItems);
  } catch (error) {
    console.log(error);
  }
};

// UPDATE CART

const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCartProducts,
  addToCart,
  deleteToCart,
  updateQuantity,
};
