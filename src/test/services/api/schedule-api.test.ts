import { Schedule, SchedulesAPI } from "../../../services/api/schedules-api";
import { StatusResponse } from "../../../services/api/rest-full.model";
import { DayOfWeek } from "../../../services/api/schedules-api";

// Tests generated by ChatGPT
describe("SchedulesAPI", () => {
  let schedulesAPI: SchedulesAPI;

  // Initialize API and reduce latency
  beforeEach(() => {
    schedulesAPI = new SchedulesAPI();
    (schedulesAPI as any).latency = 0; // Remove latency for testing
  });

  // Test: Create a new schedule successfully
  it("should create a new schedule", async () => {
    const newSchedule: Schedule = {
      course_id: 4,
      classroom_id: 2, // Reference to classroom
      day: DayOfWeek.Monday,
      start_time: "11:00",
      end_time: "12:30",
    };

    const response: StatusResponse<Schedule> = await schedulesAPI.createSchedule(
      newSchedule
    );

    expect(response.status).toBe(201); // Ensure schedule is created
    expect(response.data).toMatchObject(newSchedule); // Match data structure
    expect(response.data.schedule_id).toBeDefined(); // Check ID generation
  });

  // Test: Return 400 for invalid time format
  it("should return 400 for invalid time format", async () => {
    const invalidSchedule: Schedule = {
      course_id: 4,
      classroom_id: 1,
      day: DayOfWeek.Tuesday,
      start_time: "invalid", // Invalid time format
      end_time: "13:00",
    };

    await expect(schedulesAPI.createSchedule(invalidSchedule)).rejects.toEqual({
      status: 400,
      message: "Invalid time format. Use HH:mm", // Check error message
    });
  });

  // Test: Return 409 for schedule conflict
  it("should return 409 for schedule conflict", async () => {
    const conflictingSchedule: Schedule = {
      course_id: 1,
      classroom_id: 1, // Conflict in the same classroom
      day: DayOfWeek.Monday,
      start_time: "09:30",
      end_time: "10:00",
    };

    await expect(
      schedulesAPI.createSchedule(conflictingSchedule)
    ).rejects.toEqual({
      status: 409,
      message: "Schedule conflict detected", // Check conflict detection
    });
  });

  // Test: Fetch all schedules successfully
  it("should fetch all schedules", async () => {
    const response: StatusResponse<Schedule[]> = await schedulesAPI.getSchedules();

    expect(response.status).toBe(200); // Ensure successful fetch
    expect(response.data.length).toBeGreaterThan(0); // Check if schedules exist
  });

  // Test: Fetch a schedule by ID
  it("should fetch a schedule by ID", async () => {
    const response: StatusResponse<Schedule> = await schedulesAPI.getScheduleById(1);

    expect(response.status).toBe(200); // Ensure successful fetch
    expect(response.data.schedule_id).toBe(1); // Verify correct schedule
  });

  // Test: Return 404 for non-existent schedule by ID
  it("should return 404 for a non-existent schedule by ID", async () => {
    await expect(schedulesAPI.getScheduleById(99999)).rejects.toEqual({
      status: 404,
      message: "Schedule not found", // Check error message
    });
  });

  // Test: Update a schedule successfully
  it("should update a schedule", async () => {
    const updatedData = { start_time: "15:00" };

    const response: StatusResponse<Schedule> = await schedulesAPI.updateSchedule(
      1,
      updatedData
    );

    expect(response.status).toBe(200); // Ensure update is successful
    expect(response.data.start_time).toBe("15:00"); // Verify updated data
  });

  // Test: Return 404 for updating a non-existent schedule
  it("should return 404 when updating a non-existent schedule", async () => {
    await expect(
      schedulesAPI.updateSchedule(999, { start_time: "16:00" })
    ).rejects.toEqual({
      status: 404,
      message: "Schedule not found", // Check error message
    });
  });

  // Test: Delete a schedule successfully
  it("should delete a schedule", async () => {
    const response: StatusResponse<null> = await schedulesAPI.deleteSchedule(1);

    expect(response.status).toBe(204); // Ensure deletion is successful
    expect(response.message).toBe("Schedule deleted successfully"); // Confirm deletion
  });

  // Test: Return 404 for deleting a non-existent schedule
  it("should return 404 when deleting a non-existent schedule", async () => {
    await expect(schedulesAPI.deleteSchedule(999)).rejects.toEqual({
      status: 404,
      message: "Schedule not found", // Check error message
    });
  });
});
