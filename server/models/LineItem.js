const  lineitems = (sequelize, DataTypes) => {
  const LineItems = sequelize.define('line_items', {
    lite_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    lite_qty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lite_status: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    lite_prod_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'prod_id'
      },
      unique: "line_items_lite_prod_id_key"
    },
    lite_shop_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'shopping_cart',
        key: 'shop_id'
      },
      unique: "line_items_lite_shop_id_key"
    },
    lite_order_name: {
      type: DataTypes.STRING(25),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'line_items',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "line_items_lite_prod_id_key",
        unique: true,
        fields: [
          { name: "lite_prod_id" },
        ]
      },
      {
        name: "line_items_lite_shop_id_key",
        unique: true,
        fields: [
          { name: "lite_shop_id" },
        ]
      },
      {
        name: "line_items_pkey",
        unique: true,
        fields: [
          { name: "lite_id" },
        ]
      },
    ]
  });
  LineItems.associate = models => {
      LineItems.belongsTo(models.ShopCart, {foreignKey: `lite_shop_id`}),
      LineItems.belongsTo(models.Products, {foreignKey: `lite_prod_id`})
  }
  return LineItems
};

export default lineitems