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
  classrooms: Classroom[];
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
          // Get all courses
          const coursesResponse = await this.getCourses();
          const courses = coursesResponse.data;

          // Do joins with API
          const result = await Promise.all(
            courses.map(async (course) => {
              // Get Classrooms linked to the course
              const classroomsResponse =
                await this.courseClassroomAPI.getClassroomsByCourse(
                  course.course_id!
                );
              const linkedClassrooms = await Promise.all(
                classroomsResponse.data.map(
                  async (rel) =>
                    (
                      await this.classroomAPI.getClassroomById(rel.classroom_id)
                    ).data
                )
              );

              // Get programs linked to the course
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

              // Get schedules linked to the course
              const schedules = (await this.schedulesAPI.getSchedules()).data;
              const linkedSchedules = await Promise.all(
                schedules
                  .filter((schedule) => schedule.course_id === course.course_id)
                  .map(async (schedule) => {
                    // Join schedule with classroom
                    const classroom = await this.classroomAPI.getClassroomById(
                      schedule.classroom_id
                    );
                    return { ...schedule, classroom: classroom.data };
                  })
              );

              // Get professor (user) details using a User API or service
              const professorResponse = await this.usersAPI.getUserById(
                course.user_id!
              );
              const professor = professorResponse.data;

              return {
                ...course,
                classrooms: linkedClassrooms,
                programs: linkedPrograms,
                schedules: linkedSchedules,
                professor, // Include professor in the result
              };
            })
          );

          resolve({ status: 200, data: result });
        } catch (error) {
          reject({ status: 500, message: "Error fetching data", error });
        }
      }, this.latency);
    });
  }

  // POST /fullCourses
  public async createFullCourse(
    newFullCourse: FullCourse
  ): Promise<StatusResponse<FullCourse>> {
    return new Promise(async (resolve, reject) => {
      try {
        let createdCourse;
  
        // 1 : Create or update the course
        if (newFullCourse.course_id) {
          // If course_id exists, update the course instead of creating a new one
          const courseResponse = await this.updateCourse(newFullCourse.course_id, {
            name: newFullCourse.name,
            user_id: this.authService.getUserID(),
          });
          createdCourse = courseResponse.data;
          console.log("Step 1: Course updated successfully", createdCourse);
        } else {
          // Otherwise, create a new course
          const courseResponse = await this.createCourse({
            name: newFullCourse.name,
            user_id: this.authService.getUserID(),
          });
          createdCourse = courseResponse.data;
          console.log("Step 1: Course created successfully", createdCourse);
        }
  
        // 2 : Join classrooms to course
        await Promise.all(
          newFullCourse.classrooms.map(async (classroom) => {
            let existingClassroom = null;
  
            try {
              const response = await this.classroomAPI.getClassroomById(
                classroom.classroom_id
              );
              existingClassroom = response.data;
            } catch {
              const response = await this.classroomAPI.createClassroom(classroom);
              existingClassroom = response.data;
            }
  
            await this.courseClassroomAPI.addClassroomToCourse(
              createdCourse.course_id!,
              existingClassroom.classroom_id
            );
          })
        );
  
        // 3 : Join programs to course
        await Promise.all(
          newFullCourse.programs.map(async (program) => {
            let existingProgram = null;
  
            try {
              const response = await this.programAPI.getProgramByName(
                program.name
              );
              existingProgram = response.data;
            } catch {
              const response = await this.programAPI.createProgram(program);
              existingProgram = response.data;
            }
  
            await this.courseProgramAPI.addCourseProgramRelation(
              createdCourse.course_id!,
              existingProgram.program_id!
            );
          })
        );
  
        // 4 : Join schedules to course
        await Promise.all(
          newFullCourse.schedules.map(async (schedule) => {
            let existingSchedule = null;
  
            const schedulesResponse = await this.schedulesAPI.getSchedules();
            existingSchedule = schedulesResponse.data.find(
              (s) =>
                s.course_id === createdCourse.course_id &&
                s.classroom_id === schedule.classroom_id &&
                s.day === schedule.day &&
                s.start_time === schedule.start_time &&
                s.end_time === schedule.end_time
            );
  
            if (!existingSchedule) {
              await this.schedulesAPI.createSchedule({
                ...schedule,
                course_id: createdCourse.course_id!,
              });
            }
          })
        );
  
        // 5 : Build and return FullCourse
        const fullCourse = {
          ...createdCourse,
          classrooms: newFullCourse.classrooms,
          programs: newFullCourse.programs,
          schedules: newFullCourse.schedules,
          professor: newFullCourse.professor,
        };
        resolve({ status: 201, data: fullCourse });
      } catch (error) {
        reject({ status: 500, message: "Error creating full course", error });
      }
    });
  }
  
  
}
