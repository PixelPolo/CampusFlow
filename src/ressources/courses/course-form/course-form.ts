import { bindable, ICustomElementViewModel, resolve } from "aurelia";
import { DayOfWeek } from "../../../services/api/schedules-api";
import { Classroom, ClassroomAPI } from "../../../services/api/classrooms-api";
import { Program, ProgramsAPI } from "../../../services/api/programs-api";
import { Course, CoursesAPI } from "../../../services/api/course-api";
import { RelatedSchedules } from "../course-detail/course-detail";
import { FormHelper } from "./form-helper";
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

export class CourseForm implements ICustomElementViewModel {
  // ********************
  // ***** SERVICES *****
  // ********************
  readonly formHelper = resolve(FormHelper);
  readonly programsAPI = resolve(ProgramsAPI);
  readonly classroomAPI = resolve(ClassroomAPI);
  readonly coursesAPI = resolve(CoursesAPI);
  readonly router = resolve(Router);

  // ******************
  // ***** FIELDS *****
  // ******************

  // Bindables
  @bindable() course: Course;
  @bindable() relatedPrograms: Program[];
  @bindable() relatedSchedules: RelatedSchedules[];

  // Form settings
  public days = Object.values(DayOfWeek);
  public classroomsList: Classroom[] = [];
  public programList: Program[] = [];

  // User interactions
  public selectedProgram: Program | null = null;
  public isPristine: boolean = true;

  // Inject the host element
  host = resolve(Element);

  // ********************
  // ***** METHODS ******
  // ********************

  // Component lifecycle
  public async attached() {
    await this.initForm();
  }

  // Init the form
  private async initForm() {
    this.isPristine = true;
    try {
      // Fetch programs
      const pRes = await this.programsAPI.getPrograms();
      this.programList = pRes.data;
      // Fetch classrooms
      const cRes = await this.classroomAPI.getClassrooms();
      this.classroomsList = cRes.data;
    } catch (error) {
      console.error(error);
    }
  }

  // Add a program to the course
  public addExistingProgram() {
    if (
      this.selectedProgram &&
      !this.relatedPrograms.some(
        (p) => p.program_id === this.selectedProgram.program_id
      )
    ) {
      this.relatedPrograms.push(this.selectedProgram);
      this.isPristine = false;
      this.selectedProgram = null; // Reset selection
    }
  }

  // Remove program to the course
  public removeProgram(program: Program) {
    this.relatedPrograms = this.relatedPrograms.filter(
      (p) => p.program_id !== program.program_id
    );
    this.isPristine = false;
  }

  // Add schedule to the course
  public addSchedule() {
    const newSchedule: RelatedSchedules = {
      schedule_id: undefined, // Handled by the API
      course_id: this.course.course_id!,
      classroom: this.classroomsList[0], // Default
      day: this.days[0], // Default
      start_time: "08:00", // Default
      end_time: "10:00", // Default
    };
    this.relatedSchedules.push(newSchedule);
    this.isPristine = false;
  }

  // Remove schedule to the course
  public removeSchedule(schedule: RelatedSchedules) {
    this.relatedSchedules = this.relatedSchedules.filter((s) => s !== schedule);
    this.isPristine = false;
  }

  // Save the course details and dispatch a save event
  public async saveCourse() {
    // Cancel if pristine
    if (this.isPristine) {
      this.cancel();
      return;
    }
    try {
      // Save or update the course
      const courseRes = this.course.course_id
        ? await this.coursesAPI.updateCourse(this.course.course_id, this.course)
        : await this.coursesAPI.createCourse(this.course);

      const savedCourse = courseRes.data;

      // Synchronize related programs
      await this.formHelper.syncRelatedPrograms(
        savedCourse.course_id,
        this.relatedPrograms
      );

      // Synchronize related schedules
      await this.formHelper.syncRelatedSchedules(
        savedCourse.course_id,
        this.relatedSchedules
      );

      // Refresh the component
      await this.initForm();
      this.router.refresh();

      // Debug
      // this.logToDebug();

      // Dispatch success event
      this.host.dispatchEvent(
        new CustomEvent("save", {
          detail: this.course,
          bubbles: true,
        })
      );
    } catch (error) {
      console.error("Error saving course:", error);
    }
  }

  // Cancel the operation and dispatch a cancel event
  public async cancel() {
    // Refresh the component
    await this.initForm();
    this.router.refresh();
    // Dispatch cancel event
    this.host.dispatchEvent(
      new CustomEvent("cancel", {
        bubbles: true,
      })
    );
  }

  // DEBUG
  public logToDebug() {
    const courseDetails = `
      Course:
        - ID: ${this.course.course_id}
        - Name: ${this.course.name}
  
      Related Programs:
      ${this.relatedPrograms
        .map(
          (program) => `
        - Program ID: ${program.program_id}
        - Name: ${program.name}
        - Description: ${program.description}`
        )
        .join("\n")}
  
      Related Schedules:
      ${this.relatedSchedules
        .map(
          (schedule) => `
        - Schedule ID: ${schedule.schedule_id}
        - Day: ${schedule.day}
        - Start Time: ${schedule.start_time}
        - End Time: ${schedule.end_time}
        - Classroom: ${schedule.classroom.name} (ID: ${schedule.classroom.classroom_id})`
        )
        .join("\n")}
    `;

    alert(courseDetails);
  }
}
