export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  image: string;
  category: string;
};

export const products: Product[] = [
  {
    id: "cocoa-beans-001",
    name: "Premium Roasted Cocoa Beans",
    price: 25,
    shortDescription: "Rich, aromatic roasted cocoa beans perfect for snacking or grinding.",
    description: "Our Premium Roasted Cocoa Beans are sourced from the finest plantations. They bring a deep, rich flavor that is perfect for culinary uses, artisan chocolate making, or enjoying as a healthy snack.",
    image: "/product_cocoa_beans_1775744210545.png",
    category: "Beans",
  },
  {
    id: "dark-chocolate-001",
    name: "Artisanal Dark Chocolate Bar",
    price: 40,
    shortDescription: "70% Single-origin dark chocolate, crafted for true connoisseurs.",
    description: "Experience the intense, fruit-forward notes of our Artisanal Dark Chocolate Bar. Made with 70% single-origin cocoa, it melts smoothly and delivers a sophisticated taste profile.",
    image: "/product_chocolate_1775744306760.png",
    category: "Chocolate",
  },
  {
    id: "cocoa-butter-001",
    name: "Pure Natural Cocoa Butter",
    price: 32,
    shortDescription: "Raw, unrefined cocoa butter for culinary and cosmetic use.",
    description: "Extracted from premium cocoa beans, this pure natural cocoa butter retains a subtle chocolate aroma. It's an essential ingredient for homemade chocolates and deeply moisturizing skincare.",
    image: "/product_butter_1775744347368.png",
    category: "Butter",
  },
  {
    id: "cocoa-powder-001",
    name: "Rich Dark Cocoa Powder",
    price: 18,
    shortDescription: "Dutch-processed dark cocoa powder for baking and beverages.",
    description: "Our Rich Dark Cocoa Powder offers a deep, complex chocolate flavor with a smooth finish. Perfect for decadent brownies, rich hot chocolate, and elegant truffles.",
    image: "/product_powder_1775744360696.png",
    category: "Powder",
  },
];
