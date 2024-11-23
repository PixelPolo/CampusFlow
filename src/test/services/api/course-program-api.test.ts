import { CourseProgramAPI } from "../../../services/api/course-program-api";
import { StatusResponse } from "../../../services/api/rest-full.model";
import { CourseProgram } from "../../../services/api/course-program-api";

// Tests pour CourseProgramAPI
describe("CourseProgramAPI", () => {
  let courseProgramAPI: CourseProgramAPI;

  beforeEach(() => {
    courseProgramAPI = new CourseProgramAPI();
    (courseProgramAPI as any).latency = 0;
  });

  // addCourseProgramRelation
  it("should add a course-program relation", async () => {
    const courseId = 11;
    const programId = 6;

    const response: StatusResponse<CourseProgram> =
      await courseProgramAPI.addCourseProgramRelation(courseId, programId);

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      course_id: courseId,
      program_id: programId,
    });
  });

  // 409 when adding a duplicate relation
  it("should return 409 when the course is already assigned to the program", async () => {
    const courseId = 1;
    const programId = 1;

    await expect(
      courseProgramAPI.addCourseProgramRelation(courseId, programId)
    ).rejects.toEqual({
      status: 409,
      message: "This course is already assigned to this program",
    });
  });

  // getProgramsByCourse
  it("should fetch all programs for a course", async () => {
    const courseId = 1;

    const response: StatusResponse<CourseProgram[]> =
      await courseProgramAPI.getProgramsByCourse(courseId);

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ course_id: courseId })])
    );
  });

  // getCoursesByProgram
  it("should fetch all courses for a program", async () => {
    const programId = 5;

    const response: StatusResponse<CourseProgram[]> =
      await courseProgramAPI.getCoursesByProgram(programId);

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ program_id: programId }),
      ])
    );
  });

  // removeCourseProgramRelation
  it("should remove a course-program relation", async () => {
    const courseId = 1;
    const programId = 1;

    const response: StatusResponse<null> =
      await courseProgramAPI.removeCourseProgramRelation(courseId, programId);

    expect(response.status).toBe(204);
    expect(response.message).toBe(
      "Course-Program relation removed successfully"
    );
  });

  // 404 when removing a non-existent relation
  it("should return 404 when trying to remove a non-existent relation", async () => {
    const courseId = 9999;
    const programId = 9999;

    await expect(
      courseProgramAPI.removeCourseProgramRelation(courseId, programId)
    ).rejects.toEqual({
      status: 404,
      message: "Course-Program relation not found",
    });
  });
});
