const shopcart = (sequelize, DataTypes) => {
  const ShopCart = sequelize.define('shopping_cart', {
    shop_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shop_created_on: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    shop_status: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    shop_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'shopping_cart',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "shopping_cart_pkey",
        unique: true,
        fields: [
          { name: "shop_id" },
        ]
      },
    ]
  });
  ShopCart.associate = models => {
      ShopCart.hasMany(models.LineItems, {foreignKey: `lite_shop_id`, onDelete: `CASCADE`}),
      ShopCart.hasMany(models.LineItems, {foreignKey: `shop_user_id`})
  }
  return ShopCart
};

export default shopcart