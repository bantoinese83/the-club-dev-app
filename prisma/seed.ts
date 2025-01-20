import prisma from '../lib/prisma';
import { faker } from '@faker-js/faker';

async function main() {
  const users = [];
  const dailyLogs = [];
  const githubProfiles = [];
  const badges = [];
  const goals = [];
  const tags = [];

  for (let i = 0; i < 100; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.avatar(),
        streak: faker.number.int({ min: 0, max: 30 }),
        lastLogDate: faker.date.recent(),
      },
    });
    users.push(user);

    for (let j = 0; j < 10; j++) {
      const dailyLog = await prisma.dailyLog.create({
        data: {
          content: faker.lorem.paragraph(),
          userId: user.id,
          sentiment: faker.lorem.word(),
        },
      });
      dailyLogs.push(dailyLog);

      const tagName = faker.lorem.word();
      const existingTag = await prisma.tag.findUnique({
        where: {
          name_userId: {
            name: tagName,
            userId: user.id,
          },
        },
      });

      if (!existingTag) {
        const tag = await prisma.tag.create({
          data: {
            name: tagName,
            userId: user.id,
          },
        });
        tags.push(tag);
      } else {
        console.log(`Tag already exists: ${existingTag.name} for user ${user.id}`);
      }
    }

    const githubProfile = await prisma.githubProfile.create({
      data: {
        accessToken: faker.internet.password(),
        refreshToken: faker.internet.password(),
        userId: user.id,
      },
    });
    githubProfiles.push(githubProfile);

    const badge = await prisma.badge.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        image: faker.image.url(),
        userId: user.id,
      },
    });
    badges.push(badge);

    const goal = await prisma.goal.create({
      data: {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        status: 'NOT_STARTED',
        progress: faker.number.int({ min: 0, max: 100 }),
        userId: user.id,
      },
    });
    goals.push(goal);
  }

  console.log(
    'Database has been seeded with 1000 entries of realistic mock data.',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });