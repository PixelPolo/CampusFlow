import { CourseAPI } from "../../../services/api/course-api";
import { StatusResponse } from "../../../services/api/rest-full.model";

// Importing mocked dependencies
import { CourseClassroomAPI } from "../../../services/api/course-classroom-api";
import { ClassroomAPI } from "../../../services/api/classrooms-api";
import { CourseProgramAPI } from "../../../services/api/course-program-api";
import { ProgramsAPI } from "../../../services/api/programs-api";
import { SchedulesAPI } from "../../../services/api/schedules-api";
import { UsersAPI } from "../../../services/api/users-api";

describe("CourseAPI", () => {
  let courseAPI: CourseAPI;

  beforeEach(() => {
    // Mock dependencies with jest.spyOn to resolve them manually
    jest.spyOn(require("aurelia"), "resolve").mockImplementation((dep) => {
      switch (dep) {
        case CourseClassroomAPI:
          return {
            getClassroomsByCourse: jest.fn().mockResolvedValue({
              data: [{ classroom_id: 1 }, { classroom_id: 2 }],
            }),
          };
        case ClassroomAPI:
          return {
            getClassroomById: jest.fn((id) =>
              Promise.resolve({
                data: { classroom_id: id, name: `Classroom ${id}`, capacity: 30 },
              })
            ),
          };
        case CourseProgramAPI:
          return {
            getProgramsByCourse: jest.fn().mockResolvedValue({
              data: [{ program_id: 1 }, { program_id: 2 }],
            }),
          };
        case ProgramsAPI:
          return {
            getProgramById: jest.fn((id) =>
              Promise.resolve({
                data: { program_id: id, name: `Program ${id}`, description: "Sample program" },
              })
            ),
          };
        case SchedulesAPI:
          return {
            getSchedules: jest.fn().mockResolvedValue({
              data: [
                {
                  schedule_id: 1,
                  course_id: 1,
                  classroom_id: 1,
                  day: "Monday",
                  start_time: "09:00",
                  end_time: "10:30",
                },
              ],
            }),
          };
        case UsersAPI:
          return {
            getUserById: jest.fn((id) =>
              Promise.resolve({
                data: {
                  user_id: id,
                  firstName: "John",
                  lastName: "Doe",
                  email: "john.doe@example.com",
                },
              })
            ),
          };
        default:
          throw new Error(`Unsupported dependency: ${dep}`);
      }
    });

    // Initialize CourseAPI instance
    courseAPI = new CourseAPI();
    (courseAPI as any).latency = 0; // Set latency to 0 for tests
  });

  // createCourse
  it("should create a new Course", async () => {
    const newCourse = { name: "Introduction to Machine Learning", user_id: 101 };

    const response: StatusResponse<any> = await courseAPI.createCourse(newCourse);

    expect(response.status).toBe(201);
    expect(response.data.name).toBe(newCourse.name);
    expect(response.data.user_id).toBe(newCourse.user_id);
    expect(response.data.course_id).toBeDefined();
  });

  // getCourses
  it("should fetch all courses", async () => {
    const response: StatusResponse<any[]> = await courseAPI.getCourses();

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
  });

  // getCoursesById
  it("should fetch a course by ID", async () => {
    const response: StatusResponse<any> = await courseAPI.getCoursesById(1);

    expect(response.status).toBe(200);
    expect(response.data.course_id).toBe(1);
  });

  // 404 by ID
  it("should return 404 for a non-existent course by ID", async () => {
    await expect(courseAPI.getCoursesById(99999)).rejects.toEqual({
      status: 404,
      message: "Course not found",
    });
  });

  // getCourseByName
  it("should fetch a Course by name", async () => {
    const response: StatusResponse<any> = await courseAPI.getCourseByName(
      "Introduction to Computer Science"
    );

    expect(response.status).toBe(200);
    expect(response.data.name).toBe("Introduction to Computer Science");
  });

  // 404 by name
  it("should return 404 for a non-existent course by name", async () => {
    await expect(
      courseAPI.getCourseByName("Nonexistent Course")
    ).rejects.toEqual({
      status: 404,
      message: "Course not found",
    });
  });

  // updateCourse
  it("should update a course", async () => {
    const updatedData = { name: "Advanced Data Structures" };

    const response: StatusResponse<any> = await courseAPI.updateCourse(1, updatedData);

    expect(response.status).toBe(200);
    expect(response.data.name).toBe("Advanced Data Structures");
  });

  // 404 when updateCourse
  it("should return 404 when updating a non-existent course", async () => {
    await expect(
      courseAPI.updateCourse(999, { name: "Cloud Computing" })
    ).rejects.toEqual({
      status: 404,
      message: "Course not found",
    });
  });

  // deleteCourse
  it("should delete a course", async () => {
    const response: StatusResponse<null> = await courseAPI.deleteCourse(1);

    expect(response.status).toBe(204);
    expect(response.message).toBe("Course deleted successfully");
  });

  // 404 when deleteCourse
  it("should return 404 when deleting a non-existent course", async () => {
    await expect(courseAPI.deleteCourse(999)).rejects.toEqual({
      status: 404,
      message: "Course not found",
    });
  });

  // getFullCourses
  it("should fetch full courses with all related data", async () => {
    const response: StatusResponse<any[]> = await courseAPI.getFullCourses();

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);

    // Check structure of full courses
    const fullCourse = response.data[0];
    expect(fullCourse.classrooms).toBeDefined();
    expect(fullCourse.programs).toBeDefined();
    expect(fullCourse.schedules).toBeDefined();
    expect(fullCourse.professor).toBeDefined();
    expect(fullCourse.professor.firstName).toBe("John");
    expect(fullCourse.professor.lastName).toBe("Doe");
    expect(fullCourse.professor.email).toBe("john.doe@example.com");
  });
});
