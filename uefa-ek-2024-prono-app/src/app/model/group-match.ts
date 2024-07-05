import { Match } from "./match";
import { Team } from "./team";

export class GroupMatch {
    constructor(
        public id: number,
        public groupName: string,
        public year: number,
        public teams: Team[],
        public matchDtoList: Match[], 
      ) {
    
      }
}
