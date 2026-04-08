import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
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
    prisma.plans.upsert({
      where: { title: "PRO" },
      update: {
        title: "PRO",
        description: "Plano pro",
        price: 10_000,
        features: [
          "1 mês de uso",
          "suporte 24/24 via whatsapp",
          "Conjuntos de trackeadores ilimitado",
          "Trackeadores limitados",
          "Captura de evento ilimtados",
          "7 dias gratuito de uso",
          "suporte 24/24 via whatsapp",
        ],
        duration: "MONTH",
      },
      create: {
        title: "PRO",
        description: "Plano pro",
        price: 10_000,
        features: [
          "1 mês de uso",
          "suporte 24/24 via whatsapp",
          "Conjuntos de trackeadores ilimitado",
          "Trackeadores limitados",
          "Captura de evento ilimtados",
          "7 dias gratuito de uso",
          "suporte 24/24 via whatsapp",
        ],
        duration: "MONTH",
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
