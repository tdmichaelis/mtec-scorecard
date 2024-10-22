import { buildScorecard } from "./score.js";

export let courses = [];
export let selectedCourse = null;
export let selectedTeeBox = ""; // pro, champion, men, women

export async function getAvailableCourses() {
  try {
    const url =
      "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json";
    const response = await fetch(url);
    const data = await response.json();
    courses = data.map((course, index) => {
      return {
        ...course,
        id: `${course.id}`,
      };
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

export async function getCourseById(id) {
  try {
    const existingCourse = courses.find((course) => course.id === id);

    if (!existingCourse) {
      throw new Error("Course not found");
    }
    if (existingCourse.holes) {
      return existingCourse;
    }
    const response = await fetch(existingCourse.url);
    const data = await response.json();
    let currentCourse = {
      ...existingCourse,
      ...data,
    };
    courses = courses.map((course) => {
      if (course.id === id) {
        return currentCourse;
      }
      return course;
    });
    return currentCourse;
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
}

async function handleCourseSelect(event) {
  try {
    localStorage.setItem("selectedCourseId", parseInt(event.target.value));
    const course = await getCourseById(event.target.value);
    console.log("SELECTED COURSE: ", course);
    selectedCourse = course;
    buildTeeBoxSelect();
    buildScorecard();
  } catch (error) {
    console.error("Error fetching course details: ", error);
  }
}
function buildTeeBoxSelect() {
  const select = document.getElementById("tee-select");
  select.innerHTML = "";
  const teeBoxTypes = [];
  selectedCourse.holes.forEach((hole) => {
    hole.teeBoxes.forEach((teeBox) => {
      if (!teeBoxTypes.includes(teeBox.teeType)) {
        teeBoxTypes.push(teeBox.teeType);
      }
    });
  });
  teeBoxTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.toUpperCase();
    select.appendChild(option);
  });
  const stb = localStorage.getItem("selectedTeeBox");
  if (stb) {
    select.value = stb;
    selectedTeeBox = stb;
  } else {
    selectedTeeBox = teeBoxTypes[0];
    localStorage.setItem("selectedTeeBox", selectedTeeBox);
  }

  select.addEventListener("change", (event) => {
    localStorage.setItem("selectedTeeBox", event.target.value);
    selectedTeeBox = event.target.value;
    buildScorecard();
  });
}
export function buildCourseSelect() {
  const select = document.getElementById("course-select");
  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.name;
    select.appendChild(option);
  });
  const cid = localStorage.getItem("selectedCourseId");
  if (cid) {
    select.value = cid;
    const thisCourse = courses.find((course) => course.id === cid);
    handleCourseSelect({ target: { value: cid } });
  } else {
    selectedCourse = courses[0];
    localStorage.setItem("selectedCourseId", selectedCourse.id);
    handleCourseSelect({ target: { value: selectedCourse.id } });
  }
  select.addEventListener("change", handleCourseSelect);
}
