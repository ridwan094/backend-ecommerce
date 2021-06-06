const findAll = async(req, res) => {
    const lite = await req.context.models.LineItems.findAll({
        include:[{
            all: true
        }]
    });
    return res.send(lite);
}

//findOne
const findOne = async(req, res) => {
    const lite = await req.context.models.LineItems.findOne({
        where: { shop_id: req.params.id},
        include: [{
            all: true
        }]
    });
    return res.send(lite);
}

const ceklite = async(req, res, next) => {
    const ceklt = req.shop || req.cekcart
    const cekproducts = req.products
    try {
        const item = await req.context.models.LineItems.findOne({
            where: { lite_shop_id: ceklt.shop_id,
                    lite_prod_id: cekproducts.prod_id,
                    lite_status: 'cart'}
        });
        req.liteitem = item
        next()
    } catch (error) {
        return res.status(500).json({message: "Input Error" + error})
    }
}

const createlite = async(req, res) => {
    try{
        const products = req.products
        const shop = req.shop || req.cekcart
        const ceklite = req.liteitem
        const price = products.products_price * req.body.lite_qty
        if(!ceklite) {
            const item = await req.context.models.LineItems.create(
                {
                    lite_qty: req.body.lite_qty,
                    lite_status: 'cart',
                    lite_prod_id: products.prod_id,
                    lite_shop_id: shop.shop_id,
                    lite_price: price
                }
            )
            req.lite = item
        }
        next();
        return res.send(item)
    } catch(error) {
        return res.send(error);
    }
}

const findqty = async(req, res, next) => {
    try {
        const sum = await sequelize.query(
            'select count (lite_prod_id) as qty from line_items where (lite_shop_id = liteid)',
            {
                replacements: {liteid: parseint(req.body.lite_id)},
                type: sequelize.QueryTypes.SELECT
            }
        )
        req.all = sum[0]
        next()
    } catch (error) {
        return res.status(500).json({message: "Find error " + error})
    }
}

export default{
    createlite,
    findqty,
    ceklite,
    findOne,
    findAll
}