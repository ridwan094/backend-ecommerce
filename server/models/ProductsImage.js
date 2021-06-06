const productsimage = (sequelize, DataTypes) => {
  const ProductsImage = sequelize.define('products_images', {
    prim_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    prim_filename: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    prim_filesize: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    prim_filetype: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    prim_primary: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    prim_prod_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'prod_id'
      }
    }
  }, {
    sequelize,
    tableName: 'products_images',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "products_images_pkey",
        unique: true,
        fields: [
          { name: "prim_id" },
        ]
      },
    ]
  });
  ProductsImage.associate = models => {
      ProductsImage.belongsTo(models.Products, {foreignKey: 'prod_user_id'})
  }
  return ProductsImage
};

export default productsimage