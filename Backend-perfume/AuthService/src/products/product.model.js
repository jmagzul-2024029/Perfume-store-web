import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre del perfume es requerido',
                },
                len: {
                    args: [2, 150],
                    msg: 'El nombre debe tener entre 2 y 150 caracteres',
                },
            },
        },

        brand: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La marca es requerida',
                },
            },
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La descripción es requerida',
                },
            },
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: 'El precio no puede ser negativo',
                },
            },
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: [0],
                    msg: 'El stock no puede ser negativo',
                },
            },
        },

        image: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },

        category: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        gender: {
            type: DataTypes.ENUM(
                'HOMBRE',
                'MUJER',
                'UNISEX'
            ),
            allowNull: false,
            defaultValue: 'UNISEX',
        },

        size: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'products',
        timestamps: true,
        underscored: true,
    }
);

export default Product;
export { Product };