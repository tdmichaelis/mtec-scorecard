import { buildScorecard } from "./score.js";

export const users = [];

export async function getUsers() {
  try {
    const existingUsers = JSON.parse(localStorage.getItem("users"));
    if (existingUsers) {
      users.push(...existingUsers);
      return;
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

export function addPlayer(name) {
  const uuid = Math.floor(Math.random() * 1000000);
  const scores = {};
  users.push({ id: uuid, name, scores });
  localStorage.setItem("users", JSON.stringify(users));
  buildScorecard();
}

export function removePlayer(id) {
  const index = users.findIndex((user) => user.id === id);
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
}
