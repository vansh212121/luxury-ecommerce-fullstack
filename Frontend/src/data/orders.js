// src/data/orders.js
export const orders = [
  {
    id: "ORD-001",
    date: "2024-07-15",
    customer: "John Doe",
    email: "john@example.com",
    total: 129.99,
    status: "delivered",
    items: [
      {
        productId: 1,
        name: "Classic White Tee",
        price: 29.99,
        quantity: 1,
        size: "L",
        image: "https://via.placeholder.com/300x400/ffffff/333333?text=White+Tee"
      },
      {
        productId: 5,
        name: "Running Sneakers",
        price: 89.99,
        quantity: 1,
        size: "10",
        image: "https://via.placeholder.com/300x400/ff0000/ffffff?text=Running+Shoes"
      }
    ]
  },
  {
    id: "ORD-002",
    date: "2024-07-14",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 199.99,
    status: "shipped",
    items: [
      {
        productId: 4,
        name: "Leather Jacket",
        price: 199.99,
        quantity: 1,
        size: "M",
        image: "https://via.placeholder.com/300x400/000000/ffffff?text=Leather+Jacket"
      }
    ]
  },
  {
    id: "ORD-003",
    date: "2024-07-13",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 59.99,
    status: "processing",
    items: [
      {
        productId: 3,
        name: "Floral Summer Dress",
        price: 59.99,
        quantity: 1,
        size: "S",
        image: "https://via.placeholder.com/300x400/ffc0cb/333333?text=Floral+Dress"
      }
    ]
  }
];

export default orders;