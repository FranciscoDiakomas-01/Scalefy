import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import EncriptService from "../../app/auth/services/EncriptService";

const prisma = new PrismaClient();
const defaultAdmin = {
  email: process.env.ADMIN_EMAIL!,
  password: new EncriptService().encript(process.env.ADMIN_PASSWORD!),
};
async function main() {
  const hasAdmin = await prisma.users.findFirst({
    where: {
      role: "ADMIN",
      email: defaultAdmin.email,
    },
  });
  if (!hasAdmin) {
    console.log("✅ creating admin");
    await prisma.users.create({
      data: {
        fullName: "Scalefy ADMIN",
        email: defaultAdmin.email,
        password: defaultAdmin.password,
        role: "ADMIN",
      },
    });
  }
  await Promise.all([
    prisma.plans.upsert({
      where: { title: "FREE" },
      update: {
        title: "FREE",
        description: "Plano gratuito",
        price: 0,
        features: [
          "1 conjunto de trackeadores",
          "5 trackeadores por conjuto",
          "Captura de evento ilimtados",
          "7 dias gratuito de uso",
          "suporte 24/24 via whatsapp",
        ],
        duration: "DAYS",
      },
      create: {
        title: "FREE",
        description: "Plano gratuito",
        price: 0,
        features: [
          "1 conjunto de trackeadores",
          "5 trackeadores por conjuto",
          "Captura de evento ilimtados",
          "7 dias gratuito de uso",
          "suporte 24/24 via whatsapp",
        ],
        duration: "DAYS",
      },
    }),
  ]);
  console.log("✅ Plan Seed runned");
  console.log("✅ Admin Seed runned");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
