const update = async(req, res) => {
    console.log(req.fileName);
    const result = await req.context.models.ProductsImage.update(
        {prodile: req.fileName},
        {returning: true, where:{prod_id: parseInt(req.params.id)}}
    );
    return res.send(result);
};

const create = async(req, res, next) => {
    //jika gunakan spread operator
    const dataProductsImage = req.dataProductsImage;

    for (const data of dataProductsImage) {
        await createImage(req, res, data);
    }
    next();
}

const remove = async(req, res) => {
    const productsimage = await req.context.models.ProductsImage.destroy({
        where: {prim_id: req.params.id},
    });

    return res.send(true);
}

const createImage = async(req, res, data) => {
    const { empId, empName, prim_id, fileName, fileSize, fileType, prim_primary } = data;
    await req.context.models.ProductsImage.create({
        prim_filename: fileName,
        prim_filesize: fileSize,
        prim_file_type: fileType,
        prim_primary: prim_primary,
        prim_prod_id: empId
    }).catch((error) => {
        console.log(error);
    });
}

const findAll = async (req, res) => {
    const productsimage = await req.context.models.ProductsImage.findAll(
        {
            include: [{
                model: req.context.models.Products
            }],
            order: [
                ['prim_prod_id']
            ],
        }
    );
    return res.send(productsimage);
} 

export default {
    create,
    findAll,
    remove,
    createImage,
    update
}