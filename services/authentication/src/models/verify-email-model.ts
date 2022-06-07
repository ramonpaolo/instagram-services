import { randomUUID } from 'crypto';
import { DataTypes } from 'sequelize'

import sequelize from '../settings/sequelize'

const VerifyEmail = sequelize.define('verify-email', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idUser: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    validate: {
        type: DataTypes.NUMBER,
        defaultValue: () => {
            return new Date().getTime();
        }
    },
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => {
            return randomUUID()
        }
    }
})

export default VerifyEmail