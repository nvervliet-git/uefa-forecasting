import { Team } from "./team";

export class Group {

    constructor(
        public id: number,
        public groupName: string,
        public groupOrder: number,
        public active: boolean,
        public mode: string,
        public team: Team[], 
      ) {
    
      }
}
