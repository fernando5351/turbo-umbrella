const { Model, DataTypes, Sequelize } = require('sequelize');
const { PRODUCT_TABLE } = require('./product.model');

const EXIT_TABLE = 'exits';

const ExitModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PRODUCT_TABLE,
            key: 'id'
        },
        onDelete: "CASCADE",
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    exitDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true
    }
};

class Exit extends Model {
    static associate(models) {
        
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'Exit',
            tableName: EXIT_TABLE,
            timestamps: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
}

module.exports = {
    Exit, ExitModel, EXIT_TABLE
};
