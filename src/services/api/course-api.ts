import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";

// ******************
// ***** COURSE *****
// ******************

// Interface
export interface Course {
  course_id?: number;
  name: string; // Unique
  user_id?: number;
}

// ID Generation
let id = 0;
function genID() {
  return ++id;
}

// Mock Data
let courses: Course[] = [
  {
    course_id: 1,
    name: "Introduction to Computer Science",
    user_id: 1,
  },
  {
    course_id: 2,
    name: "Advanced Data Structures",
    user_id: 2,
  },
  {
    course_id: 3,
    name: "Web Development",
    user_id: 3,
  },
  {
    course_id: 4,
    name: "Machine Learning",
    user_id: 1,
  },
  {
    course_id: 5,
    name: "Database Systems",
    user_id: 2,
  },
  {
    course_id: 6,
    name: "Cloud Computing",
    user_id: 3,
  },
  {
    course_id: 7,
    name: "Operating Systems",
    user_id: 1,
  },
  {
    course_id: 8,
    name: "Artificial Intelligence",
    user_id: 2,
  },
  {
    course_id: 9,
    name: "Software Engineering",
    user_id: 3,
  },
  {
    course_id: 10,
    name: "Computer Networks",
    user_id: 1,
  },
];

// ******************************************
// ***** COURSES API RESTful SIMULATION *****
// ******************************************

@singleton()
export class CoursesAPI {
  // ******************
  // ***** FIELDS *****
  // ******************
  private latency = 100;

  // *******************
  // ***** METHODS *****
  // *******************

  // POST /courses
  public createCourse(newCourse: Course): Promise<StatusResponse<Course>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const courseExists = courses.some(
          (course) => course.name === newCourse.name
        );
        if (courseExists) {
          reject({ status: 409, message: "This course already exists" });
        } else {
          newCourse.course_id = genID();
          courses.push(newCourse);
          resolve({ status: 201, data: newCourse });
        }
      }, this.latency);
    });
  }

  // GET /courses
  public getCourses(): Promise<StatusResponse<Course[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: courses });
      }, this.latency);
    });
  }

  // GET /courses/:id
  public getCoursesById(id: number): Promise<StatusResponse<Course>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const course = courses.find((course) => course.course_id === id);
        if (course) {
          resolve({ status: 200, data: course });
        } else {
          reject({ status: 404, message: "Course not found" });
        }
      }, this.latency);
    });
  }

  // GET /courses?name=:name
  public getCourseByName(name: string): Promise<StatusResponse<Course>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const course = courses.find((course) => course.name === name);
        if (course) {
          resolve({ status: 200, data: course });
        } else {
          reject({ status: 404, message: "Course not found" });
        }
      }, this.latency);
    });
  }

  // PATCH /courses/:id
  public updateCourse(
    id: number,
    updatedCourse: Partial<Course>
  ): Promise<StatusResponse<Course>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = courses.findIndex((course) => course.course_id === id);
        if (index !== -1) {
          courses[index] = { ...courses[index], ...updatedCourse };
          resolve({ status: 200, data: courses[index] });
        } else {
          reject({ status: 404, message: "Course not found" });
        }
      }, this.latency);
    });
  }

  // DELETE /courses/:id
  public deleteCourse(id: number): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = courses.findIndex((course) => course.course_id === id);
        if (index !== -1) {
          courses.splice(index, 1);
          resolve({ status: 204, message: "Course deleted successfully" });
        } else {
          reject({ status: 404, message: "Course not found" });
        }
      }, this.latency);
    });
  }
}
