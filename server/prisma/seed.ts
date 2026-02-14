import { PrismaClient } from "@prisma/client";
import { wishes } from "../src/data/wishes";

const prisma = new PrismaClient();

async function main() {
  // Clear existing wishes
  await prisma.wish.deleteMany();

  // Seed formal wishes
  for (const text of wishes.formal) {
    await prisma.wish.create({
      data: { tone: "formal", text, active: true },
    });
  }

  // Seed funny wishes
  for (const text of wishes.funny) {
    await prisma.wish.create({
      data: { tone: "funny", text, active: true },
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
