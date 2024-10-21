import { selectedCourse, selectedTeeBox } from "./course.js";
import { users } from "./user.js";

export function buildFrontNine() {
  const table = document.getElementById("front-nine");
  table.innerHTML = "";
  const frontNine = selectedCourse?.holes.filter((h) => {
    return h.hole <= 9;
  });
  // first column
  const rows = [["Hole"], ["Yardage"], ["Par"], ["Handicap"]];
  users.forEach((user) => {
    rows.push([user.name]);
  });

  frontNine.forEach((hole) => {
    let teeBox = hole.teeBoxes.find((t) => t.teeType === selectedTeeBox);
    if (!teeBox) {
      teeBox = hole.teeBoxes[0];
    }
    rows[0].push(hole.hole);
    rows[1].push(teeBox.meters);
    rows[2].push(teeBox.par);
    rows[3].push(teeBox.hcp);
    users.forEach((user, idx) => {
      rows[idx + 3].push(user.scores?.[selectedCourse.id]?.[hole.hole - 1]);
    });
  });
  rows[0].push("Out");
  rows[1].push(
    frontNine.reduce((acc, hole) => {
      let teeBox = hole.teeBoxes.find((t) => t.teeType === selectedTeeBox);
      if (!teeBox) {
        teeBox = hole.teeBoxes[0];
      }
      return acc + teeBox.meters;
    }, 0)
  );
  rows[2].push(
    frontNine.reduce((acc, hole) => {
      let teeBox = hole.teeBoxes.find((t) => t.teeType === selectedTeeBox);
      if (!teeBox) {
        teeBox = hole.teeBoxes[0];
      }
      return acc + teeBox.par;
    }, 0)
  );
  rows[3].push("");
  users.forEach((user, idx) => {
    rows[idx + 3].push(
      frontNine.reduce((acc, hole) => {
        return acc + user.scores?.[selectedCourse.id]?.[hole.hole - 1];
      }, 0)
    );
  });

  // build table rows
  rows.forEach((row) => {
    const r = document.createElement("tr");
    r.className = "hole border";
    row.forEach((cell) => {
      const c = document.createElement("td");
      c.className = "border";
      c.textContent = cell;
      r.appendChild(c);
    });
    table.appendChild(r);
  });
}
