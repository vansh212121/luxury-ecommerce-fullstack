// src/data/products.js
export const products = [
  {
    id: 1,
    name: "Classic White Tee",
    price: 29.99,
    description: "Premium cotton t-shirt with a classic fit",
    category: "t-shirts",
    gender: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "black", "gray"],
    images: ["https://via.placeholder.com/300x400/ffffff/333333?text=White+Tee"],
    inStock: true,
    trending: true,
    bestseller: true
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 79.99,
    description: "Modern slim fit jeans with stretch denim",
    category: "jeans",
    gender: "men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["blue", "black", "gray"],
    images: ["https://via.placeholder.com/300x400/3333ff/ffffff?text=Blue+Jeans"],
    inStock: true,
    trending: false,
    bestseller: true
  },
  {
    id: 3,
    name: "Floral Summer Dress",
    price: 59.99,
    description: "Light and breezy summer dress with floral print",
    category: "dresses",
    gender: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["pink", "blue", "yellow"],
    images: ["https://via.placeholder.com/300x400/ffc0cb/333333?text=Floral+Dress"],
    inStock: true,
    trending: true,
    bestseller: false
  },
  {
    id: 4,
    name: "Leather Jacket",
    price: 199.99,
    description: "Premium leather jacket with zip closure",
    category: "jackets",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "brown"],
    images: ["https://via.placeholder.com/300x400/000000/ffffff?text=Leather+Jacket"],
    inStock: true,
    trending: true,
    bestseller: true
  },
  {
    id: 5,
    name: "Running Sneakers",
    price: 89.99,
    description: "Comfortable running shoes with cushioning",
    category: "shoes",
    gender: "unisex",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["white", "black", "red"],
    images: ["https://via.placeholder.com/300x400/ff0000/ffffff?text=Running+Shoes"],
    inStock: true,
    trending: false,
    bestseller: true
  },
  {
    id: 6,
    name: "Silk Blouse",
    price: 69.99,
    description: "Elegant silk blouse for professional wear",
    category: "tops",
    gender: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["white", "black", "navy"],
    images: ["https://via.placeholder.com/300x400/ffffff/333333?text=Silk+Blouse"],
    inStock: true,
    trending: false,
    bestseller: false
  }
];

export default products;