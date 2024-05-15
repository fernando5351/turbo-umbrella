const { Model, DataTypes, Sequelize } = require('sequelize');

const PRODUCT_TABLE = 'products';

const ProductModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        onUpdate: Sequelize.NOW
    }
};

class Product extends Model {
    static associate(models) {
        this.hasMany(models.Entry, { foreignKey: 'productId', as: 'Entries' });
        this.hasMany(models.Exit, { foreignKey: 'productId', as: 'Exits' });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'Product',
            tableName: PRODUCT_TABLE,
            timestamps: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
}

module.exports = {
    ProductModel, PRODUCT_TABLE, Product
};
