import { Team } from "./team";

export class Match {

    constructor(
        public matchId: number,
        public kickOffTime: Date,
        public homeTeam: Team,
        public awayTeam: Team
    ){}
}
