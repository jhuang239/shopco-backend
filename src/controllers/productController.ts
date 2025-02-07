import Product from "../models/product";
import { NextFunction, Request, Response } from "express";
import ProductImg from "../models/product-img";
import Category from "../models/category";
import Brand from "../models/brand";
import { ProductAttributes } from "../models/product";
import {
  getFileByFileName,
} from "../middlewares/firebase";
import { literal, Op, Sequelize } from "sequelize";
import Sale from "../models/sale";
import Review from "../models/review";




const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock, category_ids, brand_id, style_ids } =
      req.body;
    const ctg_ids = category_ids.split(",");
    const sty_ids = style_ids.split(",");
    console.log(ctg_ids);
    console.log(req.body);
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category_ids: ctg_ids,
      brand_id,
      style_ids: sty_ids,
    });
    console.log("product", product);
    req.body.result_product_id = product.dataValues.id;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, description, price, stock, category_ids, brand_id } =
    req.body as ProductAttributes;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const result = await Product.update(
      { name, description, price, stock, category_ids, brand_id },
      { where: { id } }
    );
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};


const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 9;
    const offset = (page - 1) * limit

    const { count, rows: products } = await Product.findAndCountAll({
      include: [
        {
          model: ProductImg,
          separate: true,
          limit: 1,
          attributes: ["id", "file_name"],
          order: [["createdAt", "ASC"]],
        },
        {
          model: Brand,
          attributes: ["id", "name"],
        },
        {
          model: Sale,
          separate: true,
          limit: 1,
          attributes: ["discount"],
          where: {
            start_date: {
              [Op.lte]: literal("CURRENT_DATE"),
            },
            end_date: {
              [Op.gte]: literal("CURRENT_DATE"),
            },
          },
        },
      ],
      attributes: {
        include: [
          [
            literal(`(
              SELECT ROUND(COALESCE(AVG(rating), 0), 2) 
              FROM reviews 
              WHERE reviews.product_id = "Product".id
            )`),
            'averageRating'
          ],
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
            'categories'
          ],
          [
            literal(`(
              SELECT json_agg(
                json_build_object(
                  'id', ds.id,
                  'name', ds.name
                )
              )
              FROM dress_styles ds
              WHERE ds.id = ANY("Product".style_ids::uuid[])
            )`),
            'styles'
          ]
        ]
      },
      limit,
      offset,
      raw: false,
      nest: true
    });

    // Handle image URLs
    await Promise.all(
      products.map(async (product: any) => {
        if (product.ProductImgs?.[0]) {
          const url = await getFileByFileName(product.ProductImgs[0].file_name);
          product.dataValues.ProductImgs[0].dataValues.url = url;
        }
        return product;
      })
    );

    const result = {
      items: products,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      limit
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product: any = await Product.findOne({
      where: { id },
      include: [
        {
          model: Review,
          separate: true,
          attributes: ["id", "rating", "comment", "user_id", "createdAt"],
          order: [["createdAt", "DESC"]],
        },
        {
          model: ProductImg,
          separate: true,
          attributes: ["id", "file_name"],
          order: [["createdAt", "ASC"]],
        },
        {
          model: Brand,
          attributes: ["id", "name"],
        },
        {
          model: Sale,
          separate: true,
          limit: 1,
          attributes: ["discount"],
          where: {
            start_date: {
              [Op.lte]: literal("CURRENT_DATE"),
            },
            end_date: {
              [Op.gte]: literal("CURRENT_DATE"),
            },
          },
        },
      ],
      attributes: {
        include: [
          [
            literal(`(
              SELECT ROUND(COALESCE(AVG(rating), 0), 2) 
              FROM reviews 
              WHERE reviews.product_id = "Product".id
            )`),
            'averageRating'
          ],
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
            'categories'
          ],
          [
            literal(`(
              SELECT json_agg(
                json_build_object(
                  'id', ds.id,
                  'name', ds.name
                )
              )
              FROM dress_styles ds
              WHERE ds.id = ANY("Product".style_ids::uuid[])
            )`),
            'styles'
          ]
        ]
      },
      raw: false,
      nest: true
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }

    await Promise.all(
      product.ProductImgs.map(async (img: any) => {
        const url = await getFileByFileName(img.file_name);
        img.dataValues.url = url;
        return img;
      })
    )

    res.status(200).json(product);
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// const getProductsByCategory = async (req: Request, res: Response) => {
//   try {

//     const page = parseInt(req.query.page as string) || 1;
//     const limit = 9;
//     const offset = (page - 1) * limit

//     const { category_ids } = req.body;
//     const { count, rows: products } = await Product.findAndCountAll({
//       include: [
//         {
//           model: ProductImg,
//           separate: true,
//           limit: 1,
//           attributes: ["id", "file_name"],
//           order: [["createdAt", "ASC"]],
//         },
//         {
//           model: Brand,
//           attributes: ["id", "name"],
//         },
//         {
//           model: Sale,
//           separate: true,
//           limit: 1,
//           attributes: ["discount"],
//           where: {
//             start_date: {
//               [Op.lte]: literal("CURRENT_DATE"),
//             },
//             end_date: {
//               [Op.gte]: literal("CURRENT_DATE"),
//             },
//           },
//         },
//       ],
//       attributes: {
//         include: [
//           [
//             literal(`(
//               SELECT ROUND(COALESCE(AVG(rating), 0), 2) 
//               FROM reviews 
//               WHERE reviews.product_id = "Product".id
//             )`),
//             'averageRating'
//           ],
//           [
//             literal(`(
//               SELECT json_agg(
//                 json_build_object(
//                   'id', c.id,
//                   'name', c.name
//                 )
//               )
//               FROM categories c
//               WHERE c.id = ANY("Product".category_ids::uuid[])
//             )`),
//             'categories'
//           ],
//           [
//             literal(`(
//               SELECT json_agg(
//                 json_build_object(
//                   'id', ds.id,
//                   'name', ds.name
//                 )
//               )
//               FROM dress_styles ds
//               WHERE ds.id = ANY("Product".style_ids::uuid[])
//             )`),
//             'styles'
//           ]
//         ]
//       },
//       raw: false,
//       nest: true,

//       where: {
//         category_ids: {
//           [Op.contains]: category_ids,
//         },
//       },
//     });

//     // Handle image URLs
//     await Promise.all(
//       products.map(async (product: any) => {
//         if (product.ProductImgs?.[0]) {
//           const url = await getFileByFileName(product.ProductImgs[0].file_name);
//           product.dataValues.ProductImgs[0].dataValues.url = url;
//         }
//         return product;
//       })
//     );

//     const result = {
//       items: products,
//       total: count,
//       currentPage: page,
//       totalPages: Math.ceil(count / limit),
//       limit
//     };

//     res.status(200).json(result);
//   } catch (error) {
//     console.error('Error:', error);
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "An unknown error occurred" });
//     }
//   }
// };

// const getProductsByStyles = async (req: Request, res: Response) => {
//   try {
//     const { style_ids } = req.body;
//     let products = await Product.findAll({
//       include: [
//         {
//           model: ProductImg,
//           separate: true,
//           limit: 1,
//           attributes: ["id", "file_name"],
//           order: [["createdAt", "ASC"]],
//         },
//         {
//           model: Brand,
//           attributes: ["id", "name"],
//         },
//         {
//           model: Sale,
//           separate: true,
//           limit: 1,
//           attributes: ["discount"],
//           where: {
//             start_date: {
//               [Op.lte]: literal("CURRENT_DATE"),
//             },
//             end_date: {
//               [Op.gte]: literal("CURRENT_DATE"),
//             },
//           },
//         },
//       ],
//       attributes: {
//         include: [
//           [
//             literal(`(
//               SELECT ROUND(COALESCE(AVG(rating), 0), 2) 
//               FROM reviews 
//               WHERE reviews.product_id = "Product".id
//             )`),
//             'averageRating'
//           ],
//           [
//             literal(`(
//               SELECT json_agg(
//                 json_build_object(
//                   'id', c.id,
//                   'name', c.name
//                 )
//               )
//               FROM categories c
//               WHERE c.id = ANY("Product".category_ids::uuid[])
//             )`),
//             'categories'
//           ],
//           [
//             literal(`(
//               SELECT json_agg(
//                 json_build_object(
//                   'id', ds.id,
//                   'name', ds.name
//                 )
//               )
//               FROM dress_styles ds
//               WHERE ds.id = ANY("Product".style_ids::uuid[])
//             )`),
//             'styles'
//           ]
//         ]
//       },
//       raw: false,
//       nest: true,
//       where: {
//         style_ids: {
//           [Op.contains]: style_ids,
//         },
//       },
//     });

//     // Handle image URLs
//     await Promise.all(
//       products.map(async (product: any) => {
//         if (product.ProductImgs?.[0]) {
//           const url = await getFileByFileName(product.ProductImgs[0].file_name);
//           product.dataValues.ProductImgs[0].dataValues.url = url;
//         }
//         return product;
//       })
//     );

//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Error:', error);
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "An unknown error occurred" });
//     }
//   }
// };

const getProductsWithFilters = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    console.log('page:', page);

    const limit = 9;
    const offset = (page - 1) * limit

    const { style_ids, brand_id, category_ids, product_name } = req.body;

    let condition: any = {}

    if (style_ids && style_ids.length > 0) {
      condition['style_ids'] = {
        [Op.contains]: style_ids,
      }
    }
    if (brand_id) {
      condition['brand_id'] = brand_id;
    }
    if (category_ids && category_ids.length > 0) {
      condition['category_ids'] = {
        [Op.contains]: category_ids,
      }
    }
    if (product_name) {
      condition['name'] = {
        [Op.iLike]: `%${product_name}%`,
      }
    }

    console.log('condition:', condition);

    const { count, rows: products } = await Product.findAndCountAll({
      include: [
        {
          model: ProductImg,
          separate: true,
          limit: 1,
          attributes: ["id", "file_name"],
          order: [["createdAt", "ASC"]],
        },
        {
          model: Brand,
          attributes: ["id", "name"],
        },
        {
          model: Sale,
          separate: true,
          limit: 1,
          attributes: ["discount"],
          where: {
            start_date: {
              [Op.lte]: literal("CURRENT_DATE"),
            },
            end_date: {
              [Op.gte]: literal("CURRENT_DATE"),
            },
          },
        },
      ],
      attributes: {
        include: [
          [
            literal(`(
              SELECT ROUND(COALESCE(AVG(rating), 0), 2) 
              FROM reviews 
              WHERE reviews.product_id = "Product".id
            )`),
            'averageRating'
          ],
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
            'categories'
          ],
          [
            literal(`(
              SELECT json_agg(
                json_build_object(
                  'id', ds.id,
                  'name', ds.name
                )
              )
              FROM dress_styles ds
              WHERE ds.id = ANY("Product".style_ids::uuid[])
            )`),
            'styles'
          ]
        ]
      },
      limit,
      offset,
      raw: false,
      nest: true,
      // where: condition
    });

    // Handle image URLs
    await Promise.all(
      products.map(async (product: any) => {
        if (product.ProductImgs?.[0]) {
          const url = await getFileByFileName(product.ProductImgs[0].file_name);
          product.dataValues.ProductImgs[0].dataValues.url = url;
        }
        return product;
      })
    );

    const result = {
      items: products,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      limit
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};


const getProductsByBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let products = await Product.findAll({
      include: [
        {
          model: ProductImg,
          separate: true,
          limit: 1,
          attributes: ["id", "file_name"],
          order: [["createdAt", "ASC"]],
        },
        {
          model: Brand,
          attributes: ["id", "name"],
        },
        {
          model: Sale,
          separate: true,
          limit: 1,
          attributes: ["discount"],
          where: {
            start_date: {
              [Op.lte]: literal("CURRENT_DATE"),
            },
            end_date: {
              [Op.gte]: literal("CURRENT_DATE"),
            },
          },
        },
      ],
      attributes: {
        include: [
          [
            literal(`(
              SELECT ROUND(COALESCE(AVG(rating), 0), 2) 
              FROM reviews 
              WHERE reviews.product_id = "Product".id
            )`),
            'averageRating'
          ],
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
            'categories'
          ],
          [
            literal(`(
              SELECT json_agg(
                json_build_object(
                  'id', ds.id,
                  'name', ds.name
                )
              )
              FROM dress_styles ds
              WHERE ds.id = ANY("Product".style_ids::uuid[])
            )`),
            'styles'
          ]
        ]
      },
      where: { brand_id: id },
      raw: false,
      nest: true
    });

    await Promise.all(
      products.map(async (product: any) => {
        if (product.ProductImgs?.[0]) {
          const url = await getFileByFileName(product.ProductImgs[0].file_name);
          product.dataValues.ProductImgs[0].dataValues.url = url;
        }
        return product;
      })
    );

    res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const result = await Product.destroy({ where: { id } });
    const result_img = await ProductImg.destroy({ where: { product_id: id } });

    res.status(200).json({ result, result_img });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export {
  addProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
  getProductsWithFilters
};
