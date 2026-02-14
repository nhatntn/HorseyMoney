import { PrismaClient } from "@prisma/client";
import { wishesByAge } from "../data/wishes";

const prisma = new PrismaClient();

export async function runSeed(): Promise<void> {
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

runSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
