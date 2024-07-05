export class Result {

    constructor(
        public teamId: number,
        public drawn: number,
        public goalDifference: number,
        public goalsAgainst: number,
        public goalsFor: number,
        public isLive: boolean,
        public isOverridden: boolean,
        public lost: number,
        public played: number, 
        public points: number,
        public qualified: boolean,
        public rank: number,
        public won: number,
    ){

    }

    public static startResult(): Result {
        return new Result(0 , 0, 0, 0, 0, false, false, 0, 0, 0, true, 0, 0)
    }
}
