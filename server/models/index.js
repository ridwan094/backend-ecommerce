import lineitems from './LineItem';
import users from './Users';
import orders from './Orders';
import products from './Products';
import productsimage from './ProductsImage';
import shopcart from './ShopCart';
import Sequelize from 'sequelize';
import {sequelize} from '../../config/config-db';

const models = {
    LineItems: lineitems(sequelize, Sequelize),
    Users: users(sequelize, Sequelize),
    Orders: orders(sequelize, Sequelize),
    Products: products(sequelize, Sequelize),
    ProductsImage: productsimage(sequelize, Sequelize),
    ShopCart: shopcart(sequelize, Sequelize)
}

Object.keys(models).forEach(key => {
    if('associate' in models[key]) {
        models[key].associate(models);
    }
});

export default models;