'use strict';

const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { Role } = require("../../app/models");

const names = [
  {
    name: "Johnny",
    role_name: "ADMIN"
  }, {
    name: "Fikri",
    role_name: "ADMIN"
  }, {
    name: "Brian",
    role_name: "CUSTOMER"
  }, {
    name: "Ranggawarsita",
    role_name: "CUSTOMER"
  }, {
    name: "Jayabaya",
    role_name: "CUSTOMER"
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    const password = "123456";
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const timestamp = new Date();

    let users = []

    for (let index = 0; index < names.length; index++) {
      const { name, role_name } = names[index];
      const role = await Role.findOne({
        where: {
          name: role_name,
        }
      })
      users.push({
        name,
        email: `${name.toLowerCase()}@binar.co.id`,
        encryptedPassword,
        roleId: await role.id, 
        createdAt: timestamp,
        updatedAt: timestamp,
      })

    }
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { name: { [Op.in]: names.map(({ name }) => name) } }, {});
  }
};
