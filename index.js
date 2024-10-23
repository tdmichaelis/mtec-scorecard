import { buildCourseSelect, getAvailableCourses } from "./js/course.js";
import { buildScorecard, clearScores } from "./js/score.js";
import { addPlayer, getUsers, users } from "./js/user.js";
await getUsers();
await getAvailableCourses();

buildCourseSelect();

const addPlayerButton = document.getElementById("add-player");
addPlayerButton.addEventListener("click", () => {
  const name = prompt("Enter player name");
  if (name) {
    console.log("Adding player: ", name);
    addPlayer(name);
  }
});
const resetGameButton = document.getElementById("reset-game");
resetGameButton.addEventListener("click", () => {
  clearScores();
  buildScorecard();
});
