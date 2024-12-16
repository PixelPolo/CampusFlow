import { AuthService } from "./../../../services/auth/auth";
import { bindable, ICustomElementViewModel } from "aurelia";
import { resolve } from "aurelia";
import { Course } from "../../../services/api/course-api";
import { Program, ProgramsAPI } from "../../../services/api/programs-api";
import { Classroom, ClassroomAPI } from "../../../services/api/classrooms-api";
import {
  DayOfWeek,
  Schedule,
  SchedulesAPI,
} from "../../../services/api/schedules-api";
import {
  CourseProgram,
  CourseProgramAPI,
} from "../../../services/api/course-program-api";
import { User, UsersAPI } from "../../../services/api/users-api";
import { Router } from "@aurelia/router";

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

// Custom schedule for the component
export interface RelatedSchedules {
  schedule_id?: number;
  course_id: number;
  classroom: Classroom;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
}

export class CourseDetail implements ICustomElementViewModel {
  // ********************
  // ***** SERVICES *****
  // ********************
  readonly authService = resolve(AuthService);
  readonly programsAPI = resolve(ProgramsAPI);
  readonly courseProgramAPI = resolve(CourseProgramAPI);
  readonly schedulesAPI = resolve(SchedulesAPI);
  readonly classroomAPI = resolve(ClassroomAPI);
  readonly usersAPI = resolve(UsersAPI);
  readonly router = resolve(Router);

  // ******************
  // ***** FIELDS *****
  // ******************

  // Course to detail
  @bindable() course: Course;

  // Course details
  public relatedPrograms: Program[] = [];
  public relatedSchedules: RelatedSchedules[] = [];
  public relatedProfessor: User;

  // User interactions
  public canEdit: boolean;
  public isEditing: boolean = false;

  // *******************
  // ***** METHODS *****
  // *******************

  // Component lifecycle
  public async attached() {
    // // Dev only
    // this.canEdit = true;
    this.canEdit = this.authService.getUserRoles().includes("professor");
    this.isEditing = false;
    await this.fetchCourseDetail();
  }

  // Fetch course detail
  private async fetchCourseDetail() {
    this.fetchRelatedPrograms();
    this.fetchRelatedSchedules();
    this.fetchProfessor();
  }

  // Fetch related program according the course to detail
  private async fetchRelatedPrograms() {
    try {
      // Fetch programs
      const programListRes = await this.programsAPI.getPrograms();
      const programList = programListRes.data;
      // Fetch relations
      const relsRes = await this.courseProgramAPI.getRelsByCourseID(
        this.course.course_id
      );
      const rels: CourseProgram[] = relsRes.data;
      // Fetch relatedPrograms
      this.relatedPrograms = programList.filter((program: Program) =>
        rels.some((rel: CourseProgram) => rel.program_id === program.program_id)
      );
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch related schedules according the course to detail
  private async fetchRelatedSchedules() {
    try {
      // Fetch schedules
      const res = await this.schedulesAPI.getSchedules();
      // Filter schedules accorrding to course_id
      const filteredSchedules = res.data.filter(
        (schedule: Schedule) => schedule.course_id === this.course.course_id
      );
      // Create custom schedules including the classroom
      this.relatedSchedules = await Promise.all(
        filteredSchedules.map(async (schedule: any) => {
          const classroom = await this.classroomAPI.getClassroomById(
            schedule.classroom_id
          );
          return {
            schedule_id: schedule.schedule_id,
            course_id: schedule.course_id,
            classroom: classroom.data,
            day: schedule.day,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch professor
  private async fetchProfessor() {
    try {
      const professorRes = await this.usersAPI.getUserById(this.course.user_id);
      this.relatedProfessor = professorRes.data;
    } catch (error) {
      console.error("Error fetching professor:", error);
    }
  }

  // If the user is editing the course
  public edit() {
    this.isEditing = true;
  }

  // If the user is deleting the course
  public delete() {
    alert("Not implemented 😅");
  }

  // Handle the save from the form component
  public async handleSave(event: CustomEvent) {
    this.isEditing = false;
    const courseDetail = event.detail;
    this.course = courseDetail;
    // Refresh the component
    await this.fetchCourseDetail();
    this.router.refresh();
  }

  // Handle the cancel on edit from the form component
  public async handleCancel() {
    this.isEditing = false;
    // Refresh the component
    await this.fetchCourseDetail();
    this.router.refresh();
  }
}
