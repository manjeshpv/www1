'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    uri: 'mysql://root:@localhost/test_ag?zeroDateTimeBehavior=convertToNull',
    options: {
      logging: false,
    }

  },

  // Seed database on startup
  seedDB: true

};
