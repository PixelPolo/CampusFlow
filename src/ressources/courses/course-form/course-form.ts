import { bindable, ICustomElementViewModel, resolve } from "aurelia";
import { CourseAPI, FullCourse } from "../../../services/api/course-api";
import { DayOfWeek, Schedule } from "../../../services/api/schedules-api";
import { Classroom, ClassroomAPI } from "../../../services/api/classrooms-api";
import { Program, ProgramsAPI } from "../../../services/api/programs-api";

export class CourseForm implements ICustomElementViewModel {
  // ********************
  // ***** SERVICES *****
  // ********************
  readonly classroomAPI: ClassroomAPI = resolve(ClassroomAPI);
  readonly courseAPI: CourseAPI = resolve(CourseAPI);
  readonly programsAPI: ProgramsAPI = resolve(ProgramsAPI);

  // ******************
  // ***** FIELDS *****
  // ******************
  @bindable() course: FullCourse;

  // Inject the host element
  host = resolve(Element);

  public isEditing: boolean = false;
  public days = Object.values(DayOfWeek);
  public classroomsList: Classroom[];
  public allPrograms: Program[] = [];
  public selectedProgram: Program | null = null;

  async attached() {
    console.log(this.course);
    this.classroomsList = (await this.classroomAPI.getClassroom()).data;
    console.log(this.classroomsList);
    this.allPrograms = (await this.programsAPI.getPrograms()).data;

    if (!this.course) {
      this.initializeNewCourse();
    }
  }

  private initializeNewCourse() {
    this.course = {
      name: "",
      programs: [],
      schedules: [],
      professor: {
        firstName: "",
        lastName: "",
        email: "",
      },
    };
  }

  public addProgram() {
    this.course.programs.push({ name: "", description: "" });
  }

  public addExistingProgram() {
    if (
      this.selectedProgram &&
      !this.course.programs.some((p) => p.name === this.selectedProgram!.name)
    ) {
      this.course.programs.push(this.selectedProgram);
      console.log(`Added existing program: ${this.selectedProgram.name}`);
    }
  }

  public removeProgram(program: Program) {
    this.course.programs = this.course.programs.filter((p) => p !== program);
    console.log(`Removed program: ${program.name}`);
  }

  public addSchedule() {
    const newSchedule: Schedule = {
      course_id: -1,
      classroom_id: -1,
      day: DayOfWeek.Monday,
      start_time: "09:00",
      end_time: "10:30",
    };
    this.course.schedules.push(newSchedule);
  }

  public removeSchedule(schedule: Schedule) {
    this.course.schedules = this.course.schedules.filter((s) => s !== schedule);
    console.log(`Removed schedule for day: ${schedule.day}`);
  }

  public async saveCourse() {
    try {
      const newFullCourse: FullCourse = {
        name: this.course.name,
        programs: this.course.programs,
        schedules: this.course.schedules,
        professor: this.course.professor,
      };

      const response = await this.courseAPI.createFullCourse(newFullCourse);

      // Dispatch the save event with updated course data
      this.host.dispatchEvent(
        new CustomEvent("save", {
          detail: this.course,
          bubbles: true,
        })
      );
    } catch (error: any) {
      console.error("Error saving course:", error.message || error);
    }
  }

  public cancel() {
    // Dispatch the cancel event without additional data
    this.host.dispatchEvent(
      new CustomEvent("cancel", {
        bubbles: true, // Allow event to bubble up
      })
    );
  }
}
