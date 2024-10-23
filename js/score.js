import { selectedCourse, selectedTeeBox } from "./course.js";
import { checkNumberOfPlayers, removePlayer, users } from "./user.js";

export function getTotalScore(user, courseId, teeBox) {
  return selectedCourse?.holes?.reduce((acc, hole) => {
    return acc + (user.scores?.[courseId]?.[hole.hole]?.[teeBox] || 0);
  }, 0);
}
export function buildScorecard() {
  const frontNine = selectedCourse?.holes.filter((h) => {
    return h.hole <= 9;
  });
  const backNine = selectedCourse?.holes.filter((h) => {
    return h.hole > 9 && h.hole <= 18;
  });
  buildTable(frontNine, "front-nine");
  buildTable(backNine, "back-nine");
  checkNumberOfPlayers();
}
export function buildTable(holes, selector) {
  const table = document.getElementById(selector);
  table.innerHTML = "";
  const courseId = parseInt(selectedCourse?.id);

  // first column
  const rows = [["Hole"], ["Yardage"], ["Par"], ["Handicap"]];
  users.forEach((user) => {
    const div = document.createElement("div");
    div.className = "flex items-center gap-2 p-2";
    const span = document.createElement("span");
    span.textContent = user.name;
    span.className = "whitespace-nowrap";
    // add delete button to user row
    const button = document.createElement("button");
    button.textContent = "X";
    button.className = "delete-user text-xs text-red-500 px-1";
    button.addEventListener("click", () => {
      removePlayer(user.id);
    });
    div.appendChild(button);
    div.appendChild(span);
    rows.push([div]);
  });

  holes.forEach((hole) => {
    let teeBox = hole.teeBoxes.find((t) => t.teeType === selectedTeeBox);
    if (!teeBox) {
      teeBox = hole.teeBoxes[0];
    }
    rows[0].push(hole.hole);
    rows[1].push(teeBox.meters);
    rows[2].push(teeBox.par);
    rows[3].push(teeBox.hcp);
    users.forEach((user, idx) => {
      // add input fields for scores
      const input = document.createElement("input");
      input.type = "number";
      input.className = "score-input w-full pl-2";
      input.value =
        user.scores?.[courseId]?.[hole.hole]?.[selectedTeeBox] || "";
      input.addEventListener("change", (event) => {
        const value = parseInt(event.target.value, 10);
        if (!user.scores[courseId]) user.scores[courseId] = {};
        if (!user.scores[courseId][hole.hole])
          user.scores[courseId][hole.hole] = {};
        if (!user.scores[courseId][hole.hole][selectedTeeBox])
          user.scores[courseId][hole.hole][selectedTeeBox] = 0;

        user.scores[courseId][hole.hole][selectedTeeBox] = value;

        console.log("Updated user: ", user);
        localStorage.setItem("users", JSON.stringify(users));
        buildScorecard();
      });
      rows[idx + 4].push(input);
    });
  });
  rows[0].push("Out");
  rows[0].push("Total");
  // total yardage for the front nine
  rows[1].push(
    holes.reduce((acc, hole) => {
      let teeBox = hole.teeBoxes.find((t) => t.teeType === selectedTeeBox);
      if (!teeBox) {
        teeBox = hole.teeBoxes[0];
      }
      return acc + teeBox.meters;
    }, 0)
  );
  // total yardage for the course
  rows[1].push(
    selectedCourse?.holes?.reduce((acc, hole) => {
      let teeBox = hole.teeBoxes.find((t) => t.teeType === selectedTeeBox);
      if (!teeBox) {
        teeBox = hole.teeBoxes[0];
      }
      return acc + teeBox.meters;
    }, 0)
  );
  // total par for the front nine
  rows[2].push(
    holes.reduce((acc, hole) => {
      let teeBox = hole.teeBoxes.find((t) => t.teeType === selectedTeeBox);
      if (!teeBox) {
        teeBox = hole.teeBoxes[0];
      }
      return acc + teeBox.par;
    }, 0)
  );
  rows[3].push("");
  // user rows
  users.forEach((user, idx) => {
    // user front nine total score
    rows[idx + 4].push(
      holes.reduce((acc, hole) => {
        return (
          acc + (user.scores?.[courseId]?.[hole.hole]?.[selectedTeeBox] || 0)
        );
      }, 0) || ""
    );
    // user total score
    rows[idx + 4].push(getTotalScore(user, courseId, selectedTeeBox) || "");
  });

  // build table rows
  rows.forEach((row, idx) => {
    const r = document.createElement("tr");
    r.className = "hole border";
    row.forEach((cell, index) => {
      let c;
      if (idx === 0) {
        c = document.createElement("th");
      } else {
        c = document.createElement("td");
      }
      c.className = "border p-2";
      if (index === 0) {
        c.className += " bg-green-600 text-white";
      }
      if (typeof cell === "object") {
        c.className = "border";
        c.appendChild(cell);
      } else {
        c.textContent = cell;
      }
      r.appendChild(c);
    });
    table.appendChild(r);
  });
}

export function clearScores() {
  users.forEach((user) => {
    user.scores = {};
  });
  localStorage.setItem("users", JSON.stringify(users));
}
