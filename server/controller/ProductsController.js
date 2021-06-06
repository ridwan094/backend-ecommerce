//findAll
const findAll = async(req, res) => {
    const products = await req.context.models.Products.findAll();
    return res.send(products);
}

//findOne
const findOne = async(req, res) => {
    const products = await req.context.models.Products.findOne({
        where: {prod_id: req.params.id},
        include: [{
            all: true
        }]
    });
    return res.send(products);
}

const findout = async(req, res, next) => {
    try {
        const products = await req.context.models.Products.findOne({
            where: {prod_id: req.body.prod_id}
        })
        req.products = products;
        next()
    } catch (error) {
        return res.status(500).send({message: `Find products ${error}`})
    }
}

//create
const create = async(req, res, next) => {
    //jika gunakan spread operator
    const dataPD = req.dataPD;
    for(const data of dataPD) {
        await created(req, res, data);
    }
    //using middleware
    next();
}

const created = async(req, res, data) => {
    const {prod_name, prod_desc, prod_price, prod_stock, prod_expire, prod_weight, 
        prod_category, prod_brand, prod_condition, prod_total_sold, prod_rating, prod_views} = data;
    await req.context.models.Products.create({
        prod_name: prod_name,
        prod_desc: prod_desc,
        prod_price: prod_price,
        prod_stock: prod_stock,
        prod_expire: prod_expire,
        prod_weight: prod_weight,
        prod_category: prod_category,
        prod_brand: prod_brand,
        prod_condition: prod_condition,
        prod_total_sold: prod_total_sold,
        prod_rating: prod_rating,
        prod_views: prod_views
    }).catch(error => {
        console.log(error);
    });
}

//update
const update = async(req, res, next) => {
    //Jika gunakan spread operator
    const dataPD = req.dataPD;
    for (const data of dataPD) {
        await updated(req, res, data);
    }
    //usinng middleware
    next();
}

const updated = async(req, res, data) => {
    const {prod_name, prod_desc, prod_price, prod_stock, prod_expire, prod_weight, 
        prod_category, prod_brand, prod_condition, prod_total_sold, prod_rating, prod_views} = data;
    await req.context.models.Products.updated({
        prod_name: prod_name,
        prod_desc: prod_desc,
        prod_price: prod_price,
        prod_stock: prod_stock,
        prod_expire: prod_expire,
        prod_weight: prod_weight,
        prod_category: prod_category,
        prod_brand: prod_brand,
        prod_condition: prod_condition,
        prod_total_sold: prod_total_sold,
        prod_rating: prod_rating,
        prod_views: prod_views
    }, {returning: true, where:{prod_id: req.params.id}}).catch(error => {
        console.log(error);
    });
}

//delete
const Delete = async(req, res) => {
    await req.context.models.Products.destroy({
        where:{prod_id: req.params.id}
    }).then(result => {
        console.log(result);
        return res.send("delete " + result + " rows.")
    })
}

export default {
    findAll,
    findOne,
    create,
    findout,
    update,
    Delete   
}