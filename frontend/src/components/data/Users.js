
// src/components/data/Users.js
export const userData = [
  {
    id: 1,
    image: "/images/avatar.jpg",
    username: "admin",
    password: "admin123",
    email: "admin@gmail.com",
    role: "admin",
    locked: false,
    permissions: ["create", "update", "delete", "view"],
  },
  {
    id: 2,
    image: "/images/avatar.jpg",
    username: "user1",
    password: "user123",
    email: "user@gmail.com",
    role: "user",
    locked: false,
    permissions: ["create", "update"],
  },
  {
    id: 3,
    image: "/images/avatar.jpg",
    username: "customer",
    password: "123456789",
    email: "customer@gmail.com",
    role: "customer",
    locked: false,
    permissions: ["view"],
  },
];

export default userData;
