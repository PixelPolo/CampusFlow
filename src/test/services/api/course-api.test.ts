import { Course, CourseAPI } from "../../../services/api/course-api";
import { StatusResponse } from "../../../services/api/rest-full.model";

// Tests generated by ChatGPT
describe("CourseAPI", () => {
  let courseAPI: CourseAPI;

  beforeEach(() => {
    courseAPI = new CourseAPI();
    (courseAPI as any).latency = 0;
  });

  // createCourse
  it("should create a new Course", async () => {
    const newCourse: Course = {
      course_id: 1,
      name: "Introduction to Machine Learning",
      user_id: 101,
    };

    const response: StatusResponse<Course> = await courseAPI.createCourse(
      newCourse
    );

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject(newCourse);
    expect(response.data.course_id).toBeDefined();
  });

  // getCourse
  it("should fetch all courses", async () => {
    const response: StatusResponse<Course[]> = await courseAPI.getCourses();

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
  });

  // getCourseById
  it("should fetch a course by ID", async () => {
    const response: StatusResponse<Course> = await courseAPI.getcoursesById(1);

    expect(response.status).toBe(200);
    expect(response.data.course_id).toBe(1);
  });

  // 404 by ID
  it("should return 404 for a non-existent course by ID", async () => {
    await expect(courseAPI.getcoursesById(99999)).rejects.toEqual({
      status: 404,
      message: "Course not found",
    });
  });

  // getCourseByName
  it("should fetch a Course by name", async () => {
    const response: StatusResponse<Course> = await courseAPI.getCourseByName(
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

    const response: StatusResponse<Course> = await courseAPI.updateCourse(
      1,
      updatedData
    );

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

  // deleteClassroom
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
});
