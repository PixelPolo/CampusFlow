import { CourseClassroomAPI } from "../../../services/api/course-classroom-api";
import { StatusResponse } from "../../../services/api/rest-full.model";
import { CourseClassroom } from "../../../services/api/course-classroom-api";

// Tests for CourseClassroomAPI
describe("CourseClassroomAPI", () => {
  let courseClassroomAPI: CourseClassroomAPI;

  beforeEach(() => {
    courseClassroomAPI = new CourseClassroomAPI();
    (courseClassroomAPI as any).latency = 0;
  });

  // addClassroomToCourse
  it("should add a classroom to a course", async () => {
    const courseId = 1;
    const classroomId = 5;

    const response: StatusResponse<CourseClassroom> =
      await courseClassroomAPI.addClassroomToCourse(courseId, classroomId);

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      course_id: courseId,
      classroom_id: classroomId,
    });
  });

  // 409 when adding a duplicate relation
  it("should return 409 when the classroom is already assigned to the course", async () => {
    const courseId = 1;
    const classroomId = 1;

    await expect(
      courseClassroomAPI.addClassroomToCourse(courseId, classroomId)
    ).rejects.toEqual({
      status: 409,
      message: "This classroom is already assigned to this course",
    });
  });

  // getClassroomsByCourse
  it("should fetch all classrooms for a course", async () => {
    const courseId = 1;

    const response: StatusResponse<CourseClassroom[]> =
      await courseClassroomAPI.getClassroomsByCourse(courseId);

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
  });

  // removeClassroomFromCourse
  it("should remove a classroom from a course", async () => {
    const courseId = 1;
    const classroomId = 1;

    const response: StatusResponse<null> =
      await courseClassroomAPI.removeClassroomFromCourse(courseId, classroomId);

    expect(response.status).toBe(204);
    expect(response.message).toBe("Classroom removed from course successfully");
  });

  // 404 when removing a non-existent relation
  it("should return 404 when trying to remove a non-existent classroom from a course", async () => {
    const courseId = 9999;
    const classroomId = 9999;

    await expect(
      courseClassroomAPI.removeClassroomFromCourse(courseId, classroomId)
    ).rejects.toEqual({
      status: 404,
      message: "Relation not found",
    });
  });
});
