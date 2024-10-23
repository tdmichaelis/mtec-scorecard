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
export function checkNumberOfPlayers() {
  const playerButton = document.getElementById("add-player");
  if (users.length > 3) {
    // disable add player button
    playerButton.disabled = true;
    playerButton.classList.add("bg-gray-300");
    playerButton.classList.remove("bg-green-600");
  } else {
    playerButton.disabled = false;
    playerButton.classList.remove("bg-gray-300");
    playerButton.classList.add("bg-green-600");
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
  buildScorecard();
}
