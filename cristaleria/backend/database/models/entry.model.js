const { Model, DataTypes, Sequelize } = require('sequelize');
const { PRODUCT_TABLE } = require('./product.model');

const ENTRY_TABLE = 'entries';

const EntryModel = {
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
    entryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true
    }
};

class Entry extends Model {

    static associate(models) {
        
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'Entry',
            tableName: ENTRY_TABLE,
            timestamps: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
}
module.exports = {
    EntryModel,
    ENTRY_TABLE,
    Entry
};
