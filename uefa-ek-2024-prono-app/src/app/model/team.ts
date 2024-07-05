import { Result } from "./results";

export class Team {

    constructor(
        public id: number,
        public name: string,
        public logo: string,
        public result: Result
    ) {

    }

}
