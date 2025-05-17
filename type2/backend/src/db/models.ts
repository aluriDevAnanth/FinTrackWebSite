import { Sequelize, DataTypes } from 'sequelize';
import { ulid } from 'ulid';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/db.db',
});

const User = sequelize.define('users', {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userUlid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: () => ulid()
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true });

const Income = sequelize.define('incomes', {
    incomeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    incomeUlid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: () => ulid()
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    amount: {
        type: DataTypes.DECIMAL
    },
    description: {
        type: DataTypes.STRING
    },
    incomeDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, { timestamps: true });

/* (async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synced successfully.");
    } catch (error) {
        console.error("Error syncing database:", error);
    } finally {
        await sequelize.close();
    }
})(); */

export const db = {
    sequelize,
    User,
    Income
};
