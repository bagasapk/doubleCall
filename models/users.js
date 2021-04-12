'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //users.hasMany(models.favorite_movies,{as: 'favorite_movies'});
    }
  };
  // const users = Sequelize.define('users', function(models) {
  // users.associate = function(models){
  //   users.hasMany(models.favorite_movies,{as: 'favorite_movies'});
  // }});
  users.init({
    name: DataTypes.STRING(50),
    password: DataTypes.STRING(50),
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};