export class VoterListModel {
  constructor(public id: number, public isVoteCasted: string,
              public userID: number, public pollID: number, public optionID: number) {}
}
