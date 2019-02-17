import {Option} from '@angular/cli/models/interface';

export class PollModel {
  constructor(public id: number, public title: string, public question_outline: string, public description: string,
              public pollCriteria_domain: string, public pollCriteria_emails: string, public startTime: string,
              public endTime: string, public createdBy: number, public isAdminAllowedForVoting: string) {}
}
