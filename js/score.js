import { selectedCourse, selectedTeeBox } from "./course.js";
import { users } from "./user.js";

export function getTotalScore(user, courseId, teeBox) {
  return selectedCourse?.holes?.reduce((acc, hole) => {
    return acc + (user.scores?.[courseId]?.[hole.hole]?.[teeBox] || 0);
  }, 0);
}
export function buildScorecard() {
  buildFrontNine();
  buildBackNine();
}

export function buildFrontNine() {
  const table = document.getElementById("front-nine");
  table.innerHTML = "";
  const courseId = parseInt(selectedCourse?.id);
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
      // add input fields for scores
      const input = document.createElement("input");
      input.type = "number";
      input.className = "score-input w-full";
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
    rows[idx + 4].push(
      frontNine.reduce((acc, hole) => {
        return (
          acc + (user.scores?.[courseId]?.[hole.hole]?.[selectedTeeBox] || 0)
        );
      }, 0) || ""
    );
    rows[idx + 4].push(getTotalScore(user, courseId, selectedTeeBox) || "");
  });

  // build table rows
  rows.forEach((row) => {
    const r = document.createElement("tr");
    r.className = "hole border";
    row.forEach((cell) => {
      const c = document.createElement("td");
      c.className = "border";
      if (typeof cell === "object") {
        c.appendChild(cell);
      } else {
        c.textContent = cell;
      }
      r.appendChild(c);
    });
    table.appendChild(r);
  });
}
export function buildBackNine() {
  const table = document.getElementById("back-nine");
  table.innerHTML = "";
  const courseId = parseInt(selectedCourse?.id);
  const backNine = selectedCourse?.holes.filter((h) => {
    return h.hole > 9 && h.hole <= 18;
  });
  // first column
  const rows = [["Hole"], ["Yardage"], ["Par"], ["Handicap"]];
  users.forEach((user) => {
    rows.push([user.name]);
  });

  backNine.forEach((hole) => {
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
      input.className = "score-input w-full";
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
        buildBackNine();
      });
      rows[idx + 4].push(input);
    });
  });
  rows[0].push("In");
  rows[0].push("Total");
  rows[1].push(
    backNine.reduce((acc, hole) => {
      let teeBox = hole.teeBoxes.find((t) => t.teeType === selectedTeeBox);
      if (!teeBox) {
        teeBox = hole.teeBoxes[0];
      }
      return acc + teeBox.meters;
    }, 0)
  );
  rows[2].push(
    backNine.reduce((acc, hole) => {
      let teeBox = hole.teeBoxes.find((t) => t.teeType === selectedTeeBox);
      if (!teeBox) {
        teeBox = hole.teeBoxes[0];
      }
      return acc + teeBox.par;
    }, 0)
  );
  rows[3].push("");
  users.forEach((user, idx) => {
    rows[idx + 4].push(
      backNine.reduce((acc, hole) => {
        return (
          acc + (user.scores?.[courseId]?.[hole.hole]?.[selectedTeeBox] || 0)
        );
      }, 0) || ""
    );
    rows[idx + 4].push(getTotalScore(user, courseId, selectedTeeBox) || "");
  });

  // build table rows
  rows.forEach((row) => {
    const r = document.createElement("tr");
    r.className = "hole border";
    row.forEach((cell) => {
      const c = document.createElement("td");
      c.className = "border";
      if (typeof cell === "object") {
        c.appendChild(cell);
      } else {
        c.textContent = cell;
      }
      r.appendChild(c);
    });
    table.appendChild(r);
  });
}
