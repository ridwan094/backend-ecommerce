import {sequelize} from '../../config/config-db'

//findAll
const findAll = async(req, res) => {
    const shopcart = await req.context.models.ShopCart.findAll({
        include: [{
            all: true
        }]
    });
    return res.send(shopcart)
}

//findOne
const findOne = async(req, res) => {
    const shopcart = await req.context.models.ShopCart.findOne({
        where: { shop_id: req.params.id},
        include: [{
            all: true
        }]
    });
    return res.send(shopcart);
}

const cekcart = async(req, res, next) => {
    const user = req.cekUser || req.cart
    try {
        const cart = await req.context.models.ShopCart.findOne({
            include:[{
                all: true
            }],
            where: {shop_user_id: user.user_id,
                    shop_status: 'open'},
        });
        req.cekcart = cart
        next();
    } catch(error) {
        return res.status(500).json({ message: "Input Error" + error})
    }
}

const closecart = async(req, res) => {
    const orderd = req.orders || req.cekord
    try {
        await req.context.models.ShopCart.update({
            shop_status: 'close',
        }, {returning: true, where:{shop_user_id : orderd.order_user_id}})
        return res.send(orderd)
    } catch(error) {

    }
}

//create
const create = async(req, res, next) => {
    const cekcr = req.cekcart
    const user = req.cekUser || req.cart
    try {
        if(!cekcr) {
            const result = await req.context.models.ShopCart.create({
                shop_created_on: new Date(),
                shop_status: "open",
                shop_user_id: user.user_id
            })
            req.shopcart = result
        }
        next()
    } catch(error) {
        return res.status(500).json({ message: "Input Error" + error})
    }
}

const findqty = async(req, res, next) => {
    const query = req.cekcart
    try {
        const sum = await sequelize.query(
            'select count (lite_prod_id) as qty from line_items where (lite_shop_id = :liteid)',
            {
                replacements: {liteid: parseInt(query.shop_id)},
                type: sequelize.QueryTypes.SELECT
            }
        )
        req.all = sum[0]
        next()
    } catch (error) {
        return res.status(500).json({ message: "Find error " + error})
    }
}

export default {
    findAll,
    findOne,
    findqty,
    create,
    cekcart,
    closecart
}