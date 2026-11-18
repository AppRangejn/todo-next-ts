'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC;`,
    );

    if (!users.length) return;

    const householdTasks = [
      {
        title: 'Купити продукти на тиждень',
        description:
          'Молоко, яйця, куряче філе, гречка, овочі для салату та хліб.',
        status: 'todo',
      },
      {
        title: 'Оплатити комунальні послуги',
        description:
          'Передати показники лічильників за світло, воду та газ у додатку.',
        status: 'done',
      },
      {
        title: 'Прибрати на кухні та помити духовку',
        description: 'Протерти стільницю, помити плиту та винести сміття.',
        status: 'in progress',
      },
      {
        title: 'Записатися до стоматолога',
        description:
          'Плановий огляд та професійна чистка зубів на наступний тиждень.',
        status: 'todo',
      },
      {
        title: 'Попрати та розвісити речі',
        description: 'Запустити прання постільної білизни на 40 градусів.',
        status: 'done',
      },
      {
        title: 'Забрати посилку з Нової Пошти',
        description: 'Відділення №4, потрібно встигнути до 19:00.',
        status: 'todo',
      },
      {
        title: 'Полити кімнатні рослини',
        description: 'Полити фікус, монстеру та протерти листя від пилу.',
        status: 'done',
      },
      {
        title: 'Почистити фільтр у пральній машині',
        description: 'Злити залишки води та промити зливний фільтр знизу.',
        status: 'todo',
      },
      {
        title: 'Приготувати обід на два дні',
        description: 'Запекти картоплю з куркою та зробити легкий салат.',
        status: 'in progress',
      },
      {
        title: 'Перебрати зимовий одяг у шафі',
        description: 'Скласти теплі светри та віднести куртку в хімчистку.',
        status: 'todo',
      },
      {
        title: 'Замінити лампочку в коридорі',
        description:
          'Купити світлодіодну лампу E27 на 4000K нейтрального світла.',
        status: 'done',
      },
      {
        title: 'Зробити вологе прибирання у кімнаті',
        description:
          'Пропилососити килим, помити підлогу та провітрити приміщення.',
        status: 'in progress',
      },
      {
        title: 'Поповнити домашню аптечку',
        description:
          'Докупити пластирі, знеболювальне, хлоргексидин та вітамін D.',
        status: 'todo',
      },
      {
        title: 'Помити вікна на балконі',
        description:
          'Протерти скло з обох боків засобом для скла та мікрофіброю.',
        status: 'todo',
      },
      {
        title: 'Розібрати документи та чеки',
        description: 'Скласти гарантійні талони на техніку в окрему папку.',
        status: 'done',
      },
    ];

    const now = new Date();
    const tasksToInsert = [];

    users.forEach((user, userIndex) => {
      const tasksCount = 4 + ((userIndex * 3) % 6);

      for (let i = 0; i < tasksCount; i++) {
        const template =
          householdTasks[(userIndex * 2 + i) % householdTasks.length];

        tasksToInsert.push({
          title: template.title,
          description: template.description,
          status: template.status,
          userId: user.id,
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    await queryInterface.bulkInsert('Tasks', tasksToInsert, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tasks', null, {});
  },
};
