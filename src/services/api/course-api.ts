import { UsersAPI } from "./users-api";
import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";
import { resolve } from "aurelia";
import { ClassroomAPI } from "./classrooms-api";
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

  readonly classroomAPI: ClassroomAPI = resolve(ClassroomAPI);
  readonly courseProgramAPI: CourseProgramAPI = resolve(CourseProgramAPI);
  readonly programAPI: ProgramsAPI = resolve(ProgramsAPI);
  readonly schedulesAPI: SchedulesAPI = resolve(SchedulesAPI);
  readonly usersAPI: UsersAPI = resolve(UsersAPI);
  readonly authService: AuthService = resolve(AuthService);

  // Fetch full courses
  public async getFullCourses(): Promise<StatusResponse<FullCourse[]>> {
    try {
      const coursesResponse = await this.getCourses();
      const courses = coursesResponse.data;

      const fullCourses = await Promise.all(
        courses.map(async (course) => this.enrichCourse(course))
      );

      return { status: 200, data: fullCourses };
    } catch (error) {
      console.error("Error fetching full courses:", error);
      throw { status: 500, message: "Error fetching full courses", error };
    }
  }

  // Create or update a full course
  public async createFullCourse(
    newFullCourse: FullCourse
  ): Promise<StatusResponse<FullCourse>> {
    try {
      const course = await this.getOrCreateCourse(newFullCourse);

      await this.linkProgramsToCourse(
        newFullCourse.programs,
        course.course_id!
      );
      await this.linkSchedulesToCourse(
        newFullCourse.schedules,
        course.course_id!
      );

      const enrichedCourse = await this.enrichCourse(course);

      return { status: 201, data: enrichedCourse };
    } catch (error) {
      console.error("Error creating or updating full course:", error);
      throw {
        status: 500,
        message: "Error creating or updating full course",
        error,
      };
    }
  }

  // Helper to retrieve or create a course
  private async getOrCreateCourse(fullCourse: FullCourse): Promise<Course> {
    if (fullCourse.course_id) {
      return this.getCoursesById(fullCourse.course_id).then((res) => res.data);
    }

    const existingCourse = await this.getCourseByName(fullCourse.name).catch(
      () => null
    );
    if (existingCourse?.data) return existingCourse.data;

    const createdCourse = await this.createCourse({
      name: fullCourse.name,
      user_id: this.authService.getUserID(),
    });
    return createdCourse.data;
  }

  // Enrich a single course with programs, schedules, and professor
  private async enrichCourse(course: Course): Promise<FullCourse> {
    const programs = await this.getProgramsForCourse(course.course_id!);
    const schedules = await this.getEnrichedSchedulesForCourse(
      course.course_id!
    );
    const professor = await this.usersAPI.getUserById(course.user_id!);

    return {
      ...course,
      programs,
      schedules,
      professor: professor.data,
    };
  }

  // Fetch and enrich schedules for a course
  private async getEnrichedSchedulesForCourse(
    courseId: number
  ): Promise<Schedule[]> {
    const schedules = (await this.schedulesAPI.getSchedules()).data.filter(
      (schedule) => schedule.course_id === courseId
    );

    return Promise.all(
      schedules.map(async (schedule) => {
        const classroom = await this.classroomAPI.getClassroomById(
          schedule.classroom_id
        );
        return { ...schedule, classroom: classroom.data };
      })
    );
  }

  // Fetch programs linked to a course
  private async getProgramsForCourse(courseId: number): Promise<Program[]> {
    const programLinks = await this.courseProgramAPI.getProgramsByCourse(
      courseId
    );
    return Promise.all(
      programLinks.data.map(async (relation) => {
        const program = await this.programAPI.getProgramById(
          relation.program_id
        );
        return program.data;
      })
    );
  }

  // Link or update programs for a course
  private async linkProgramsToCourse(programs: Program[], courseId: number) {
    const existingLinks = await this.courseProgramAPI.getProgramsByCourse(
      courseId
    );
    const existingProgramIds = existingLinks.data.map(
      (link) => link.program_id
    );

    for (const program of programs) {
      const programData =
        (await this.programAPI.getProgramByName(program.name).catch(() => null))
          ?.data || (await this.programAPI.createProgram(program)).data;

      if (!existingProgramIds.includes(programData.program_id!)) {
        await this.courseProgramAPI.addCourseProgramRelation(
          courseId,
          programData.program_id!
        );
      }
    }
  }

  // Link or update schedules for a course
  private async linkSchedulesToCourse(schedules: Schedule[], courseId: number) {
    const existingSchedules = (
      await this.schedulesAPI.getSchedules()
    ).data.filter((schedule) => schedule.course_id === courseId);

    for (const schedule of schedules) {
      const exists = existingSchedules.some(
        (s) =>
          s.classroom_id === schedule.classroom_id &&
          s.day === schedule.day &&
          s.start_time === schedule.start_time &&
          s.end_time === schedule.end_time
      );

      if (!exists) {
        const hasConflict = existingSchedules.some(
          (s) =>
            s.classroom_id === schedule.classroom_id &&
            s.day === schedule.day &&
            !(
              schedule.end_time <= s.start_time ||
              schedule.start_time >= s.end_time
            )
        );

        if (!hasConflict) {
          await this.schedulesAPI.createSchedule({
            ...schedule,
            course_id: courseId,
          });
        } else {
          console.warn(
            `Schedule conflict detected for classroom: ${schedule.classroom_id}`
          );
        }
      }
    }
  }
}
