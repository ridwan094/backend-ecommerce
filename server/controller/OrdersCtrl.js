const findAll = async(req, res) => {
    const orders = await req.context.models.Orders.findAll({
        include:[{
            all: true
        }]
    });
    return res.send(orders);
}

//findOne
const findOne = async(req, res) => {
    const orders = await req.context.models.Orders.findOne({
        where: { shop_id: req.params.id},
        include:[{
            all: true
        }]
    });
    return res.send(orders);
}

const payment = async(req, res, next) => {
    const prices = req.cekcart
    const payment = {}
    let price = 0
    let discount = 0
    let tax = 0
    let due = 0
    let qty = 0
    for (const data of prices.line_items) {
        try {
            price += data.lite_price
            qty += data.lite_qty
            if(req.all.qty > 1){
                discount = 0.05 * price
            }
            tax = (price - discount) * 0.1
            due = price - discount + tax
            payment['price'] = price
            payment['discount'] = discount
            payment['tax'] = tax
            payment['due'] = due
            payment['qty'] = qty
        } catch(error) {
            return res.status(500).json({message: "Order Error " + error})
        }
    }
    req.payment = payment
    next()
}

const cekord = async(req, res, next) => {
    const user = req.cekUser
    try {
        const orders = await req.context.models.Orders.dindOne({
            where: { order_user_id: user.user_id,
                    order_status: 'open'},
        });
        req.cekord = orders
        next()
    } catch(error) {
        return res.status(500).json({ message: "Input Error" + error})
    }
}

const create = async(req, res, next) => {
    try {
        const user = req.cekuser
        const cekorder = req.cekord
        if(!cekorder) {
            const orders = await req.context.models.Orders.create({
                order_total_due: req.payment.due,
                order_subtotal: req.payment.price,
                order_discount: req.payment.discount,
                order_tax: req.payment.tax,
                order_total_qty: req.payment.qty,
                order_user_id: user.user_id,
                order_address: req.body.order_address,
                order_city: req.body.order_city,
                order_status: 'open'
            })
            req.orders = orders
        }
        next()
    } catch (error) {
        return res.status(500).json({ message: "Order Error" + error})
    }
}

export default {
    payment,
    create,
    cekord,
    findAll,
    findOne
}