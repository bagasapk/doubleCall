'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favorite_movies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //favorite_movies.belongsTo(models.users, {foreignKey: 'user_id', as: 'users'});
    }
  };
  // const favorite_movies = sequelize.define('favorites_movies',{
  //   tut
  // })
  favorite_movies.init({
    title: DataTypes.STRING(50),
    user_id: DataTypes.INTEGER(5),
  }, {
    sequelize,
    modelName: 'favorite_movies',
  });
  return favorite_movies;
};