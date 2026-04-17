import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@amdcocoa.com" },
    update: {},
    create: {
      name: "AMD Admin",
      email: "admin@amdcocoa.com",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create Categories
  const categoriesData = [
    { name: "Cacao Powder", slug: "cacao-powder", description: "Rich, premium cacao powder for baking and beverages." },
    { name: "Cacao Butter", slug: "cacao-butter", description: "Pure, natural cacao butter for culinary and cosmetic use." },
    { name: "Cacao Nibs", slug: "cacao-nibs", description: "Crunchy, raw cacao nibs packed with antioxidants." },
    { name: "Dark Chocolate", slug: "dark-chocolate", description: "Artisanal dark chocolate bars crafted for true connoisseurs." },
    { name: "Cacao Paste", slug: "cacao-paste", description: "100% pure unsweetened cacao paste." },
    { name: "Gift Sets", slug: "gift-sets", description: "Curated selections of our finest products." },
  ];

  const categories = [];
  for (const c of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories.push(category);
  }

  // Find IDs for mapping
  const beansCat = categories.find((c) => c.slug === "cacao-nibs") || categories[0];
  const chocolateCat = categories.find((c) => c.slug === "dark-chocolate") || categories[0];
  const butterCat = categories.find((c) => c.slug === "cacao-butter") || categories[0];
  const powderCat = categories.find((c) => c.slug === "cacao-powder") || categories[0];

  // Create Initial Products mapped from old data.ts
  const products = [
    {
      name: "Premium Roasted Cocoa Beans",
      slug: "premium-roasted-cocoa-beans",
      price: 25,
      stock: 100,
      shortDescription: "Rich, aromatic roasted cocoa beans perfect for snacking or grinding.",
      description: "Our Premium Roasted Cocoa Beans are sourced from the finest plantations. They bring a deep, rich flavor that is perfect for culinary uses, artisan chocolate making, or enjoying as a healthy snack.",
      image: "/product_cocoa_beans_1775744210545.png",
      categoryId: beansCat.id,
    },
    {
      name: "Artisanal Dark Chocolate Bar",
      slug: "artisanal-dark-chocolate-bar",
      price: 40,
      stock: 50,
      shortDescription: "70% Single-origin dark chocolate, crafted for true connoisseurs.",
      description: "Experience the intense, fruit-forward notes of our Artisanal Dark Chocolate Bar. Made with 70% single-origin cocoa, it melts smoothly and delivers a sophisticated taste profile.",
      image: "/product_chocolate_1775744306760.png",
      categoryId: chocolateCat.id,
    },
    {
      name: "Pure Natural Cocoa Butter",
      slug: "pure-natural-cocoa-butter",
      price: 32,
      stock: 75,
      shortDescription: "Raw, unrefined cocoa butter for culinary and cosmetic use.",
      description: "Extracted from premium cocoa beans, this pure natural cocoa butter retains a subtle chocolate aroma. It's an essential ingredient for homemade chocolates and deeply moisturizing skincare.",
      image: "/product_butter_1775744347368.png",
      categoryId: butterCat.id,
    },
    {
      name: "Rich Dark Cocoa Powder",
      slug: "rich-dark-cocoa-powder",
      price: 18,
      stock: 200,
      shortDescription: "Dutch-processed dark cocoa powder for baking and beverages.",
      description: "Our Rich Dark Cocoa Powder offers a deep, complex chocolate flavor with a smooth finish. Perfect for decadent brownies, rich hot chocolate, and elegant truffles.",
      image: "/product_powder_1775744360696.png",
      categoryId: powderCat.id,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
