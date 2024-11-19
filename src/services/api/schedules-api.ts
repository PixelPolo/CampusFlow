import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";

// *********************
// ***** SCHEDULES *****
// *********************

// Enum DayOfWeek
export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

// Time format
function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/; // Format HH:mm
  return timeRegex.test(time);
}

// Interface
export interface Schedule {
  schedule_id?: number;
  course_id: number;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
}

// ID Generation
let id = 0;
function genID() {
  return ++id;
}

// Mock Data
let schedules: Schedule[] = [
  {
    schedule_id: 1,
    course_id: 1,
    day: DayOfWeek.Monday,
    start_time: "09:00",
    end_time: "10:30",
  },
  {
    schedule_id: 2,
    course_id: 1,
    day: DayOfWeek.Wednesday,
    start_time: "09:00",
    end_time: "10:30",
  },
  {
    schedule_id: 3,
    course_id: 2,
    day: DayOfWeek.Tuesday,
    start_time: "14:00",
    end_time: "15:30",
  },
  {
    schedule_id: 4,
    course_id: 3,
    day: DayOfWeek.Friday,
    start_time: "10:00",
    end_time: "12:00",
  },
];

// ********************************************
// ***** SCHEDULES API RESTful SIMULATION *****
// ********************************************

@singleton()
export class SchedulesAPI {
  // ******************
  // ***** FIELDS *****
  // ******************
  private latency = 1000;

  // *******************
  // ***** METHODS *****
  // *******************

  // POST /schedule
  public createSchedule(
    newSchedule: Schedule
  ): Promise<StatusResponse<Schedule>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Time format check
        if (
          !isValidTimeFormat(newSchedule.start_time) ||
          !isValidTimeFormat(newSchedule.end_time)
        ) {
          reject({ status: 400, message: "Invalid time format. Use HH:mm" });
          return;
        }
        // Conflict check
        const scheduleConflict = schedules.some(
          (schedule) =>
            schedule.course_id === newSchedule.course_id &&
            schedule.day === newSchedule.day &&
            !(
              newSchedule.end_time <= schedule.start_time ||
              newSchedule.start_time >= schedule.end_time
            )
        );
        if (scheduleConflict) {
          reject({ status: 409, message: "Schedule conflict detected" });
        } else {
          newSchedule.schedule_id = genID();
          schedules.push(newSchedule);
          resolve({ status: 201, data: newSchedule });
        }
      }, this.latency);
    });
  }

  // GET /schedules
  public getSchedules(): Promise<StatusResponse<Schedule[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: schedules });
      }, this.latency);
    });
  }

  // GET /schedules/:id
  public getScheduleById(id: number): Promise<StatusResponse<Schedule>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const schedule = schedules.find(
          (schedule) => schedule.schedule_id === id
        );
        if (schedule) {
          resolve({ status: 200, data: schedule });
        } else {
          reject({ status: 404, message: "Schedule not found" });
        }
      }, this.latency);
    });
  }

  // PATCH /schedules/:id
  public updateSchedule(
    id: number,
    updatedSchedule: Partial<Schedule>
  ): Promise<StatusResponse<Schedule>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = schedules.findIndex(
          (schedule) => schedule.schedule_id === id
        );
        if (index !== -1) {
          schedules[index] = { ...schedules[index], ...updatedSchedule };
          resolve({ status: 200, data: schedules[index] });
        } else {
          reject({ status: 404, message: "Schedule not found" });
        }
      }, this.latency);
    });
  }

  // DELETE /schedules/:id
  public deleteSchedule(id: number): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = schedules.findIndex(
          (schedule) => schedule.schedule_id === id
        );
        if (index !== -1) {
          schedules.splice(index, 1);
          resolve({ status: 204, message: "Schedule deleted successfully" });
        } else {
          reject({ status: 404, message: "Schedule not found" });
        }
      }, this.latency);
    });
  }
}
