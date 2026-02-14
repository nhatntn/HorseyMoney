import { PrismaClient } from "@prisma/client";
import { wishesByAge } from "../src/data/wishes";

const prisma = new PrismaClient();

async function main() {
  await prisma.wish.deleteMany();

  for (const [ageGroup, texts] of Object.entries(wishesByAge)) {
    for (const text of texts) {
      await prisma.wish.create({
        data: { text, ageGroup, active: true },
      });
    }
  }

  const count = await prisma.wish.count();
  console.log(`Seeded ${count} wishes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
