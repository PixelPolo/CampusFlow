import { ClassroomAPI } from "../../../services/api/classrooms-api";
import { CoursesAPI } from "../../../services/api/course-api";
import { CourseProgramAPI } from "../../../services/api/course-program-api";
import { ProgramsAPI } from "../../../services/api/programs-api";
import { StatusResponse } from "../../../services/api/rest-full.model";
import { SchedulesAPI } from "../../../services/api/schedules-api";
import { UsersAPI } from "../../../services/api/users-api";
import { AuthService } from "../../../services/auth/auth";

describe("CoursesAPI", () => {
  let coursesAPI: CoursesAPI;

  beforeEach(() => {
    // Mock dependencies with jest.spyOn to resolve them manually
    jest.spyOn(require("aurelia"), "resolve").mockImplementation((dep) => {
      switch (dep) {
        case AuthService:
          return {
            getUserID: jest.fn().mockReturnValue(2), // Retourne un ID utilisateur pour les tests
          };
        case ClassroomAPI:
          return {
            getClassroomById: jest.fn((id) =>
              Promise.resolve({
                data: {
                  classroom_id: id,
                  name: `Classroom ${id}`,
                  capacity: 30,
                },
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
                data: {
                  program_id: id,
                  name: `Program ${id}`,
                  description: "Sample program",
                },
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
    coursesAPI = new CoursesAPI();
    (coursesAPI as any).latency = 0; // Set latency to 0 for tests
  });

  // Create a new course
  it("should create a new Course", async () => {
    const newCourse = {
      name: "Introduction to Machine Learning",
      user_id: 101,
    };

    const response: StatusResponse<any> = await coursesAPI.createCourse(
      newCourse
    );

    expect(response.status).toBe(201);
    expect(response.data.name).toBe(newCourse.name);
    expect(response.data.user_id).toBe(newCourse.user_id);
    expect(response.data.course_id).toBeDefined();
  });

  // Fetch all courses
  it("should fetch all courses", async () => {
    const response: StatusResponse<any[]> = await coursesAPI.getCourses();

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
  });

  // Fetch a course by ID
  it("should fetch a course by ID", async () => {
    const response: StatusResponse<any> = await coursesAPI.getCoursesById(1);

    expect(response.status).toBe(200);
    expect(response.data.course_id).toBe(1);
  });

  // Return 404 for a non-existent course by ID
  it("should return 404 for a non-existent course by ID", async () => {
    await expect(coursesAPI.getCoursesById(99999)).rejects.toEqual({
      status: 404,
      message: "Course not found",
    });
  });

  // Fetch a course by name
  it("should fetch a course by name", async () => {
    const response: StatusResponse<any> = await coursesAPI.getCourseByName(
      "Introduction to Computer Science"
    );

    expect(response.status).toBe(200);
    expect(response.data.name).toBe("Introduction to Computer Science");
  });

  // Return 404 for a non-existent course by name
  it("should return 404 for a non-existent course by name", async () => {
    await expect(
      coursesAPI.getCourseByName("Nonexistent Course")
    ).rejects.toEqual({
      status: 404,
      message: "Course not found",
    });
  });

  // Update a course
  it("should update a course", async () => {
    const updatedData = { name: "Advanced Data Structures" };

    const response: StatusResponse<any> = await coursesAPI.updateCourse(
      1,
      updatedData
    );

    expect(response.status).toBe(200);
    expect(response.data.name).toBe("Advanced Data Structures");
  });

  // Return 404 when updating a non-existent course
  it("should return 404 when updating a non-existent course", async () => {
    await expect(
      coursesAPI.updateCourse(999, { name: "Cloud Computing" })
    ).rejects.toEqual({
      status: 404,
      message: "Course not found",
    });
  });

  // Delete a course
  it("should delete a course", async () => {
    const response: StatusResponse<null> = await coursesAPI.deleteCourse(1);

    expect(response.status).toBe(204);
    expect(response.message).toBe("Course deleted successfully");
  });

  // Return 404 when deleting a non-existent course
  it("should return 404 when deleting a non-existent course", async () => {
    await expect(coursesAPI.deleteCourse(999)).rejects.toEqual({
      status: 404,
      message: "Course not found",
    });
  });
});
