import { PrismaClient } from "@prisma/client";
import { wishes } from "../src/data/wishes";

const prisma = new PrismaClient();

async function main() {
  // Clear existing wishes
  await prisma.wish.deleteMany();

  // Seed all wishes
  for (const text of wishes) {
    await prisma.wish.create({
      data: { text, active: true },
    });
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
