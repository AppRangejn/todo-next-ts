'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const now = new Date();

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          full_name: 'Олександр Коваленко',
          email: 'oleksandr@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
        {
          full_name: 'Марія Шевченко',
          email: 'maria@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
        {
          full_name: 'Дмитро Бондаренко',
          email: 'dmytro@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
        {
          full_name: 'Анна Мельник',
          email: 'anna@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
        {
          full_name: 'Максим Ткаченко',
          email: 'maksym@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
        {
          full_name: 'Олена Кравченко',
          email: 'olena@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
        {
          full_name: 'Артем Мороз',
          email: 'artem@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
        {
          full_name: 'Софія Лисенко',
          email: 'sofia@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
        {
          full_name: 'Богдан Савченко',
          email: 'bohdan@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
        {
          full_name: 'Вікторія Руденко',
          email: 'viktoria@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
