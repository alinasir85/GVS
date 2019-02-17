import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Subject} from 'rxjs';
import {OptionModel} from './models/option.model';
import {PollModel} from './models/poll.model';
import {VoterListModel} from './models/voterList.model';
import {AuthService} from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OptionService {
  options: OptionModel[];
  OptionsChanged = new Subject<OptionModel[]>();
  constructor(private httpService: HttpService, private authService: AuthService) { }
  getOptions(pollId) {
    this.httpService.get(`/voting/options/${pollId}/`)
      .subscribe((options: OptionModel[]) => {
        this.options = options;
        this.OptionsChanged.next(this.options);
      });
  }
  getVotedOptionID() {
   return this.httpService.get(`/voting/voterlist/`);
  }
  castVote(pollId, data) {
    return this.httpService.put(`/voting/options/${pollId}/`, data);
  }
}
