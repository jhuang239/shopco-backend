import { Request, Response } from "express";
import Cart, { CartAttributes } from "../models/cart";
import Product from "../models/product";
import ProductImg from "../models/product-img";
import { getFileByFileName } from "../middlewares/firebase";
import { Op, literal } from "sequelize";

const getCartQuantity = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user.username;
        const cartItems = await Cart.findAll({
            where: {
                user_id,
            },
            attributes: ["product_id"],
        });

        res.status(200).json(cartItems);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

const addProductToCart = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user.username;
        console.log(user_id);
        const { product_id, quantity, color, size } =
            req.body as CartAttributes;
        const cart = await Cart.create({
            user_id,
            product_id,
            quantity,
            color,
            size,
        });
        res.status(201).json(cart);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

const getCartFunction = async (user_id: string) => {
    const cart = await Cart.findAll({
        where: {
            user_id,
        },
        include: [
            {
                model: Product,
                attributes: [
                    "name",
                    "price",
                    [
                        literal(`(
            SELECT json_agg(
              json_build_object(
                'id', c.id,
                'name', c.name
              )
            )
            FROM categories c
            WHERE c.id = ANY("Product".category_ids::uuid[])
          )`),
                        "categories",
                    ],
                ],
                include: [
                    {
                        model: ProductImg,
                        attributes: ["id", "file_name"],
                        where: {
                            id: {
                                [Op.in]: literal(`(
                SELECT pi.id
                FROM product_imgs pi
                WHERE pi.product_id = "Product"."id"
                ORDER BY pi."createdAt" DESC
                limit 1
              )`),
                            },
                        },
                        required: false,
                    },
                ],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
    if (cart.length > 0) {
        console.log(cart);
        await Promise.all(
            cart.map(async (item: any) => {
                const file_name =
                    item.dataValues.Product.ProductImgs[0].dataValues.file_name;
                const url = await getFileByFileName(file_name);
                item.dataValues.Product.ProductImgs[0].dataValues.url = url;
                return item;
            })
        );
        return cart;
    } else {
        return null;
    }
};

const getCart = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user.username;
        const cart = await Cart.findAll({
            where: {
                user_id,
            },
            include: [
                {
                    model: Product,
                    attributes: [
                        "name",
                        "price",
                        [
                            literal(`(
            SELECT json_agg(
              json_build_object(
                'id', c.id,
                'name', c.name
              )
            )
            FROM categories c
            WHERE c.id = ANY("Product".category_ids::uuid[])
          )`),
                            "categories",
                        ],
                    ],
                    include: [
                        {
                            model: ProductImg,
                            attributes: ["id", "file_name"],
                            where: {
                                id: {
                                    [Op.in]: literal(`(
                SELECT pi.id
                FROM product_imgs pi
                WHERE pi.product_id = "Product"."id"
                ORDER BY pi."createdAt" DESC
                limit 1
              )`),
                                },
                            },
                            required: false,
                        },
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        if (cart.length > 0) {
            console.log(cart);
            await Promise.all(
                cart.map(async (item: any) => {
                    const file_name =
                        item.dataValues.Product.ProductImgs[0].dataValues
                            .file_name;
                    const url = await getFileByFileName(file_name);
                    item.dataValues.Product.ProductImgs[0].dataValues.url = url;
                    return item;
                })
            );
            res.status(200).json(cart);
        } else {
            res.status(200).json({ message: "Cart is empty" });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

const increaseProductQuantity = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user.username;
        const { id } = req.body as CartAttributes;
        console.log(user_id, id);
        const cart = await Cart.findOne({
            where: {
                user_id,
                id,
            },
        });
        if (!cart) {
            res.status(404).json({ error: "Product not found in cart" });
            return;
        }
        await Cart.update(
            { quantity: cart.quantity + 1 },
            {
                where: {
                    user_id,
                    id,
                },
            }
        );
        const updatedCart = await getCartFunction(user_id);
        res.status(200).json(updatedCart);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

const reduceProductQuantity = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user.username;
        const { id } = req.body as CartAttributes;
        const cart = await Cart.findOne({
            where: {
                user_id,
                id,
            },
        });
        if (!cart) {
            res.status(404).json({ error: "Product not found in cart" });
            return;
        }
        if (cart.quantity === 1) {
            await Cart.destroy({
                where: {
                    user_id,
                    id,
                },
            });
            res.status(200).json({ message: "Product removed from cart" });
            return;
        }
        await Cart.update(
            { quantity: cart.quantity - 1 },
            {
                where: {
                    user_id,
                    id,
                },
            }
        );
        const updatedCart = await getCartFunction(user_id);
        res.status(200).json(updatedCart);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

const updateProductQuantity = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user.username;
        const { product_id, quantity } = req.body as CartAttributes;
        const cart = await Cart.findOne({
            where: {
                user_id,
                product_id,
            },
        });
        if (!cart) {
            res.status(404).json({ error: "Product not found in cart" });
            return;
        }
        await Cart.update(
            { quantity },
            {
                where: {
                    user_id,
                    product_id,
                },
            }
        );
        const updatedCart = await getCartFunction(user_id);
        res.status(200).json(updatedCart);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

const removeProductFromCart = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user.username;
        const { id } = req.body as CartAttributes;
        await Cart.destroy({
            where: {
                user_id,
                id,
            },
        });
        const updatedCart = await getCartFunction(user_id);
        res.status(200).json(updatedCart);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

const clearCart = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user.username;
        await Cart.destroy({
            where: {
                user_id,
            },
        });
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

export {
    getCartQuantity,
    addProductToCart,
    getCart,
    increaseProductQuantity,
    reduceProductQuantity,
    updateProductQuantity,
    removeProductFromCart,
    clearCart,
};
