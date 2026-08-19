import crypto from 'crypto';
import path from 'path';
import Product from './product.model.js';
import { uploadImage, deleteImage } from '../../helpers/cloudinary-service.js';

const PRODUCT_IMAGE_TRANSFORMATION = [
    { width: 800, height: 800, crop: 'pad', background: 'white' },
    { quality: 'auto', fetch_format: 'auto' },
];

const uploadProductImage = async (file) => {
    const ext = path.extname(file.path);
    const randomHex = crypto.randomBytes(6).toString('hex');
    const cloudinaryFileName = `product-${randomHex}${ext}`;

    return uploadImage(file.path, cloudinaryFileName, PRODUCT_IMAGE_TRANSFORMATION);
};

const normalizeProduct = (product) => {
    if (!product) return null;

    const data = product.toJSON ? product.toJSON() : product;

    return {
        ...data,
        price: Number(data.price),
    };
};

/**
 * GET /api/v1/products
 * Público
 */
export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                isActive: true,
            },
            order: [['created_at', 'DESC']],
        });

        return res.status(200).json({
            success: true,
            data: products.map(normalizeProduct),
        });
    } catch (error) {
        console.error('Error obteniendo productos:', error);

        return res.status(500).json({
            success: false,
            message: 'Error al obtener los perfumes',
        });
    }
};

/**
 * GET /api/v1/products/:id
 * Público
 */
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            where: {
                id,
                isActive: true,
            },
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Perfume no encontrado',
            });
        }

        return res.status(200).json({
            success: true,
            data: normalizeProduct(product),
        });
    } catch (error) {
        console.error('Error obteniendo producto:', error);

        return res.status(500).json({
            success: false,
            message: 'Error al obtener el perfume',
        });
    }
};

/**
 * POST /api/v1/products
 * ADMIN / SUPER ADMIN
 */
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            brand,
            description,
            price,
            stock,
            category,
            gender,
            size,
        } = req.body;

        let imageUrl = null;

        if (req.file) {
            imageUrl = await uploadProductImage(req.file);
        }

        const product = await Product.create({
            name,
            brand,
            description,
            price,
            stock,
            image: imageUrl,
            category,
            gender,
            size,
        });

        return res.status(201).json({
            success: true,
            message: 'Perfume creado correctamente',
            data: normalizeProduct(product),
        });
    } catch (error) {
        console.error('Error creando producto:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors
                    .map((item) => item.message)
                    .join(', '),
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error al crear el perfume',
        });
    }
};

/**
 * PUT /api/v1/products/:id
 * ADMIN / SUPER ADMIN
 */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Perfume no encontrado',
            });
        }

        const {
            name,
            brand,
            description,
            price,
            stock,
            category,
            gender,
            size,
            isActive,
        } = req.body;

        let imageUrl = product.image;

        if (req.file) {
            if (product.image) {
                try {
                    await deleteImage(product.image);
                } catch (err) {
                    console.warn('No se pudo eliminar la imagen anterior de Cloudinary:', err.message);
                }
            }

            imageUrl = await uploadProductImage(req.file);
        }

        await product.update({
            name,
            brand,
            description,
            price,
            stock,
            image: imageUrl,
            category,
            gender,
            size,
            isActive,
        });

        return res.status(200).json({
            success: true,
            message: 'Perfume actualizado correctamente',
            data: normalizeProduct(product),
        });
    } catch (error) {
        console.error('Error actualizando producto:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors
                    .map((item) => item.message)
                    .join(', '),
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el perfume',
        });
    }
};

/**
 * DELETE /api/v1/products/:id
 * ADMIN / SUPER ADMIN
 */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Perfume no encontrado',
            });
        }

        await product.update({
            isActive: false,
        });

        return res.status(200).json({
            success: true,
            message: 'Perfume eliminado correctamente',
        });
    } catch (error) {
        console.error('Error eliminando producto:', error);

        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el perfume',
        });
    }
};