import { Router } from 'express';

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from './product.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../middlewares/require-role.js';

const router = Router();

/*
 * RUTAS PÚBLICAS
 *
 * Los clientes NO necesitan autenticarse.
 */

router.get('/', getProducts);

router.get('/:id', getProductById);

/*
 * RUTAS ADMINISTRATIVAS
 *
 * Solamente SUPER_ADMIN_ROLE o ADMIN_ROLE.
 */

router.post(
    '/',
    validateJWT,
    requireRole('SUPER_ADMIN_ROLE', 'ADMIN_ROLE'),
    createProduct
);

router.put(
    '/:id',
    validateJWT,
    requireRole('SUPER_ADMIN_ROLE', 'ADMIN_ROLE'),
    updateProduct
);

router.delete(
    '/:id',
    validateJWT,
    requireRole('SUPER_ADMIN_ROLE', 'ADMIN_ROLE'),
    deleteProduct
);

export default router;