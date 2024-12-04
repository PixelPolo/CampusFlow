import { UsersAPI } from "./users-api";
import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";
import { CourseClassroomAPI } from "./course-classroom-api";
import { resolve } from "aurelia";
import { Classroom, ClassroomAPI } from "./classrooms-api";
import { CourseProgramAPI } from "./course-program-api";
import { Program, ProgramsAPI } from "./programs-api";
import { Schedule, SchedulesAPI } from "./schedules-api";
import { AuthService } from "../auth/auth";

// ******************
// ***** COURSE *****
// ******************

// Interface
export interface Course {
  course_id?: number;
  name: string;
  user_id?: number;
}

// Course with joins
export interface FullCourse extends Course {
  programs: Program[];
  schedules: Schedule[];
  professor: {
    firstName: string;
    lastName: string;
    email: string;
  };
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
export class CourseAPI {
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

  // GET /course?name=:name
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

  // ***************************************
  // ***** EXTRA ROUTES WITH SQL JOINS *****
  // ***************************************

  readonly courseClassroomAPI: CourseClassroomAPI = resolve(CourseClassroomAPI);
  readonly classroomAPI: ClassroomAPI = resolve(ClassroomAPI);
  readonly courseProgramAPI: CourseProgramAPI = resolve(CourseProgramAPI);
  readonly programAPI: ProgramsAPI = resolve(ProgramsAPI);
  readonly schedulesAPI: SchedulesAPI = resolve(SchedulesAPI);
  readonly usersAPI: UsersAPI = resolve(UsersAPI);
  readonly authService: AuthService = resolve(AuthService);

  // GET /fullCourses
  public async getFullCourses(): Promise<StatusResponse<FullCourse[]>> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // 1. Get all courses
          const coursesResponse = await this.getCourses();
          const courses = coursesResponse.data;

          // 2. Build FullCourse objects for each course
          const result = await Promise.all(
            courses.map(async (course) => {
              // 2.1. Get programs linked to the course
              const programsResponse =
                await this.courseProgramAPI.getProgramsByCourse(
                  course.course_id!
                );
              const linkedPrograms = await Promise.all(
                programsResponse.data.map(
                  async (rel) =>
                    (
                      await this.programAPI.getProgramById(rel.program_id)
                    ).data
                )
              );

              // 2.2. Get schedules linked to the course
              const schedules = (await this.schedulesAPI.getSchedules()).data;

              // 2.3. Enrich each schedule with its corresponding classroom
              const linkedSchedules = await Promise.all(
                schedules
                  .filter((schedule) => schedule.course_id === course.course_id)
                  .map(async (schedule) => {
                    // Fetch classroom details by classroom_id
                    const classroomResponse =
                      await this.classroomAPI.getClassroomById(
                        schedule.classroom_id
                      );

                    const classroom = classroomResponse.data;

                    // Return the enriched schedule with classroom details
                    return {
                      ...schedule,
                      classroom: {
                        classroom_id: classroom.classroom_id,
                        name: classroom.name,
                        capacity: classroom.capacity,
                      }, // Include classroom details explicitly
                    };
                  })
              );

              // 2.4. Get professor (user) details using the Users API
              const professorResponse = await this.usersAPI.getUserById(
                course.user_id!
              );
              const professor = professorResponse.data;

              // 2.5. Combine all details into a FullCourse object
              return {
                ...course,
                programs: linkedPrograms,
                schedules: linkedSchedules,
                professor, // Include professor details
              };
            })
          );

          // 3. Resolve the promise with the list of FullCourses
          resolve({ status: 200, data: result });
        } catch (error) {
          // Handle errors during the process
          reject({ status: 500, message: "Error fetching data", error });
        }
      }, this.latency);
    });
  }

  // POST /fullCourses
  public async createFullCourse(
    newFullCourse: FullCourse
  ): Promise<StatusResponse<FullCourse>> {
    try {
      let createdCourse: Course;

      // 1. Check if the course already exists
      if (newFullCourse.course_id) {
        // If course_id exists, retrieve the existing course
        createdCourse = (await this.getCoursesById(newFullCourse.course_id))
          .data;
      } else {
        // Check if a course with the same name already exists
        const existingCourse = await this.getCourseByName(
          newFullCourse.name
        ).catch(() => null);

        if (existingCourse?.data) {
          // If the course exists, use the existing course
          createdCourse = existingCourse.data;
        } else {
          // Otherwise, create a new course
          const courseResponse = await this.createCourse({
            name: newFullCourse.name,
            user_id: this.authService.getUserID(),
          });
          createdCourse = courseResponse.data;
        }
      }

      // 2. Link programs to the course
      const existingPrograms = await this.courseProgramAPI.getProgramsByCourse(
        createdCourse.course_id!
      );
      for (const program of newFullCourse.programs) {
        let existingProgram: Program;
        try {
          // Try to fetch the program by name
          const response = await this.programAPI.getProgramByName(program.name);
          existingProgram = response.data;
        } catch {
          // If the program does not exist, create it
          const response = await this.programAPI.createProgram(program);
          existingProgram = response.data;
        }

        if (
          !existingPrograms.data.some(
            (rel) => rel.program_id === existingProgram.program_id
          )
        ) {
          // Add program to course only if it is not already linked
          await this.courseProgramAPI.addCourseProgramRelation(
            createdCourse.course_id!,
            existingProgram.program_id!
          );
        }
      }

      // 3. Add schedules to the course
      const schedulesResponse = await this.schedulesAPI.getSchedules();
      for (const schedule of newFullCourse.schedules) {
        const existingSchedule = schedulesResponse.data.find(
          (s) =>
            s.course_id === createdCourse.course_id &&
            s.classroom_id === schedule.classroom_id &&
            s.day === schedule.day &&
            s.start_time === schedule.start_time &&
            s.end_time === schedule.end_time
        );

        if (!existingSchedule) {
          const conflict = schedulesResponse.data.some(
            (s) =>
              s.classroom_id === schedule.classroom_id &&
              s.day === schedule.day &&
              !(
                schedule.end_time <= s.start_time ||
                schedule.start_time >= s.end_time
              )
          );

          if (!conflict) {
            // Create the schedule
            await this.schedulesAPI.createSchedule({
              ...schedule,
              course_id: createdCourse.course_id!,
            });
          } else {
            console.log(
              "Schedule conflict detected, skipping schedule addition"
            );
          }
        }
      }

      // 4. Enrich schedules with classroom details
      const enrichedSchedules = await Promise.all(
        newFullCourse.schedules.map(async (schedule) => {
          const classroomResponse = await this.classroomAPI.getClassroomById(
            schedule.classroom_id
          );

          const classroom = classroomResponse.data;

          return {
            ...schedule,
            classroom: {
              classroom_id: classroom.classroom_id,
              name: classroom.name,
              capacity: classroom.capacity,
            }, // Include classroom details
          };
        })
      );

      // 5. Return the updated FullCourse object
      const fullCourse: FullCourse = {
        ...createdCourse,
        programs: newFullCourse.programs,
        schedules: enrichedSchedules, // Use enriched schedules with classroom details
        professor: newFullCourse.professor,
      };

      return { status: 201, data: fullCourse };
    } catch (error) {
      console.error("Error creating full course:", error);
      throw { status: 500, message: "Error creating full course", error };
    }
  }
}
