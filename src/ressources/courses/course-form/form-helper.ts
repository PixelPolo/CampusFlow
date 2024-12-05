import { resolve, singleton } from "aurelia";
import {
  CourseProgram,
  CourseProgramAPI,
} from "../../../services/api/course-program-api";
import { Schedule, SchedulesAPI } from "../../../services/api/schedules-api";
import { Program } from "../../../services/api/programs-api";
import { RelatedSchedules } from "../course-detail/course-detail";

/*

Classroom {                 Course {                     
  classroom_id: number;       course_id?: number;        
  name: string; // Unique     name: string; // Unique    
  capacity: number;           user_id?: number;        
}                           }                          

Program {                   CourseProgram {
  program_id?: number;        course_id: number;
  name: string; // Unique     program_id: number;
  description: string;      }  
}                          

Schedule {                  User {
  schedule_id?: number;       user_id?: number;
  course_id: number;          password: string;
  classroom_id: number;       roles: string[];
  day: DayOfWeek;             firstName: string;
  start_time: string;         lastName: string;
  end_time: string;           email: string; // Unique
}                           }
  
*/

@singleton()
export class FormHelper {
  // ********************
  // ***** SERVICES *****
  // ********************
  private readonly courseProgramAPI = resolve(CourseProgramAPI);
  private readonly schedulesAPI = resolve(SchedulesAPI);

  // ********************
  // ***** METHODS ******
  // ********************

  // Update relations course - programs
  public async syncRelatedPrograms(
    courseId: number,
    relatedPrograms: Program[]
  ) {
    try {
      // Get existing program relationships
      const relsRes = await this.courseProgramAPI.getRelsByCourseID(courseId);
      const existingRels: CourseProgram[] = relsRes.data;

      // Identify programs to add
      const toAdd = relatedPrograms.filter(
        (program) =>
          !existingRels.some((rel) => rel.program_id === program.program_id)
      );

      // Add new relationships
      for (const program of toAdd) {
        await this.courseProgramAPI.addRelation(courseId, program.program_id!);
      }

      // Identify programs to remove
      const toRemove = existingRels.filter(
        (rel) =>
          !relatedPrograms.some(
            (program) => program.program_id === rel.program_id
          )
      );

      // Remove obsolete relationships
      for (const rel of toRemove) {
        await this.courseProgramAPI.removeRelation(
          rel.course_id,
          rel.program_id
        );
      }
    } catch (error) {
      console.error("Error syncing related programs:", error);
    }
  }

  // Update relations schedules - programs
  public async syncRelatedSchedules(
    courseId: number,
    relatedSchedules: RelatedSchedules[]
  ) {
    try {
      // Get existing schedules for the course
      const schedulesRes = await this.schedulesAPI.getSchedules();
      const existingSchedules: Schedule[] = schedulesRes.data.filter(
        (schedule) => schedule.course_id === courseId
      );

      // Identify schedules to remove
      const toRemove = existingSchedules.filter(
        (existing) =>
          !relatedSchedules.some(
            (schedule) => schedule.schedule_id === existing.schedule_id
          )
      );

      // Remove obsolete schedules
      for (const schedule of toRemove) {
        await this.schedulesAPI.deleteSchedule(schedule.schedule_id!);
      }

      // Identify schedules to add
      const toAdd = relatedSchedules.filter(
        (schedule) =>
          !existingSchedules.some(
            (existing) => existing.schedule_id === schedule.schedule_id
          )
      );

      // Add new schedules
      for (const schedule of toAdd) {
        await this.schedulesAPI.createSchedule({
          course_id: courseId,
          classroom_id: schedule.classroom.classroom_id,
          day: schedule.day,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
        });
      }

      // Identify schedules to update
      const toUpdate = relatedSchedules.filter((schedule) =>
        existingSchedules.some(
          (existing) => existing.schedule_id === schedule.schedule_id
        )
      );

      // Update modified schedules
      for (const schedule of toUpdate) {
        await this.schedulesAPI.updateSchedule(schedule.schedule_id!, {
          course_id: courseId,
          classroom_id: schedule.classroom.classroom_id,
          day: schedule.day,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
        });
      }
    } catch (error) {
      alert(`Error syncing related schedules: ${error.message}`);
    }
  }
}
