import { singleton } from "aurelia";
import { StatusResponse } from "./rest-full.model";

// ********************
// ***** PROGRAMS *****
// ********************

// Interface
export interface Program {
  program_id?: number;
  name: string; // Unique
  description: string;
}

// ID Generation
let id = 0;
function genID() {
  return ++id;
}

// Mock Data
let programs: Program[] = [
  {
    program_id: genID(),
    name: "Software Engineering",
    description:
      "Learn the principles of software design, development, and testing.",
  },
  {
    program_id: genID(),
    name: "Data Science",
    description:
      "Explore data analysis, machine learning, and visualization techniques.",
  },
  {
    program_id: genID(),
    name: "Cybersecurity",
    description:
      "Understand security measures, threat analysis, and ethical hacking.",
  },
  {
    program_id: genID(),
    name: "Artificial Intelligence",
    description:
      "Study the fundamentals of AI and develop intelligent systems.",
  },
  {
    program_id: genID(),
    name: "Web Development",
    description:
      "Build modern, responsive web applications using popular frameworks.",
  },
];

// *******************************************
// ***** PROGRAMS API RESTful SIMULATION *****
// *******************************************

@singleton()
export class ProgramsAPI {
  // ******************
  // ***** FIELDS *****
  // ******************
  private latency = 100;

  // *******************
  // ***** METHODS *****
  // *******************

  // POST /programs
  public createProgram(newProgram: Program): Promise<StatusResponse<Program>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const programExist = programs.some(
          (program) => program.name === newProgram.name
        );
        if (programExist) {
          reject({ status: 409, message: "Name already taken" });
        } else {
          newProgram.program_id = genID();
          programs.push(newProgram);
          resolve({ status: 201, data: newProgram });
        }
      }, this.latency);
    });
  }

  // GET /programs
  public getPrograms(): Promise<StatusResponse<Program[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: programs });
      }, this.latency);
    });
  }

  // GET /programs/:id
  public getProgramById(id: number): Promise<StatusResponse<Program>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const program = programs.find((program) => program.program_id === id);
        if (program) {
          resolve({ status: 200, data: program });
        } else {
          reject({ status: 404, message: "Program not found" });
        }
      }, this.latency);
    });
  }

  // GET /programs?name=:name
  public getProgramByName(name: string): Promise<StatusResponse<Program>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const program = programs.find((program) => program.name === name);
        if (program) {
          resolve({ status: 200, data: program });
        } else {
          reject({ status: 404, message: "Program not found" });
        }
      }, this.latency);
    });
  }

  // PATCH /programs/:id
  public updateProgram(
    id: number,
    updatedProgram: Partial<Program>
  ): Promise<StatusResponse<Program>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = programs.findIndex(
          (program) => program.program_id === id
        );
        if (index !== -1) {
          programs[index] = { ...programs[index], ...updatedProgram };
          resolve({ status: 200, data: programs[index] });
        } else {
          reject({ status: 404, message: "Program not found" });
        }
      }, this.latency);
    });
  }

  // DELETE /programs/:id
  public deleteProgram(id: number): Promise<StatusResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = programs.findIndex(
          (program) => program.program_id === id
        );
        if (index !== -1) {
          programs.splice(index, 1);
          resolve({ status: 204, message: "Program deleted successfully" });
        } else {
          reject({ status: 404, message: "Program not found" });
        }
      }, this.latency);
    });
  }
}
