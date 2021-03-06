import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {PollModel} from './models/poll.model';
import {Subject} from 'rxjs';
import {OptionModel} from './models/option.model';
import swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class PollService {
  CreatedpollsChanged = new Subject<PollModel[]>();
  CreatedpollsDataArrived = new Subject<PollModel[]>();
  pollsForVoteChanged = new Subject<PollModel[]>();
  CastedVotepollsChanged = new Subject<PollModel[]>();
  pollsForVote: PollModel[] = [];
  Createdpolls: PollModel[] = new Array<PollModel>();
  CastedVotepolls: PollModel[] = new Array<PollModel>();

  constructor(private httpService: HttpService) { }
  getPollsForVote(userID) {
    this.httpService.get(`/voting/castVotePolls/${userID}/`)
      .subscribe((polls: PollModel[]) => {
        this.pollsForVote = [];
        for (let poll of polls) {
          if ((new Date (poll.startTime) < new Date()) && (new Date(poll.endTime) >= new Date())) {
            this.pollsForVote.push(poll);
          }
        }
        this.pollsForVoteChanged.next(this.pollsForVote);
      });
  }
  voteCasted(pollIndex: number) {
    this.pollsForVote.splice(pollIndex, 1);
    //console.log(this.pollsForVote);
    this.pollsForVoteChanged.next(this.pollsForVote);
  }
  getCastedVotedPolls(userID) {
    this.httpService.get(`/voting/castedVotePolls/${userID}/`)
      .subscribe((polls: PollModel[]) => {
        this.CastedVotepolls = polls;
        this.CastedVotepollsChanged.next(this.CastedVotepolls);
      });
  }
  getCreatedPolls(userID) {
    this.httpService.get(`/voting/createdPolls/${userID}/`)
      .subscribe((polls: PollModel[]) => {
        this.Createdpolls = polls;
        this.CreatedpollsDataArrived.next(this.Createdpolls);
      });
  }
  getActiveVotedPolls() {
    let activeVotedPolls: PollModel[] = new Array<PollModel>();
    for (let poll of this.CastedVotepolls) {
      if (new Date(poll.endTime) > new Date()) {
        activeVotedPolls.push(poll);
      }
    }
    return activeVotedPolls;
  }
  getEndedPoll() {
    let endedPolls: PollModel[] = new Array<PollModel>();
    for (let poll of this.CastedVotepolls) {
      if (new Date(poll.endTime) < new Date()) {
        endedPolls.push(poll);
      }
    }
    return endedPolls;
  }
  createPoll(poll: PollModel, options: OptionModel[]) {

    this.httpService.post('/voting/polls/', poll)
      .subscribe((res) => {
        for (let option of options) {
          option.pollID = res['id'];
        this.httpService.post(`/voting/options/${res['id']}/`, option)
          .subscribe((res2) => {
          });
        }
        this.Createdpolls.push(poll);
        this.CreatedpollsChanged.next(this.Createdpolls);
      });
  }
  updatePoll(editPoll: PollModel, options: OptionModel[]) {
    //console.log(options);
    //console.log(editPoll);
    this.httpService.delete(`/voting/deleteOptions/${editPoll.id}/`).subscribe(() => {
      this.httpService.put(`/voting/updatePoll/${editPoll.id}/`, editPoll)
        .subscribe((res) => {
          for (let option of options) {
            this.httpService.post(`/voting/options/${editPoll.id}/`, option)
              .subscribe((res2) => {
              });
          }
          const updatedPolls = [...this.Createdpolls];
          const editedPollIndex = this.Createdpolls.findIndex(poll => poll.id === editPoll.id);
          updatedPolls[editedPollIndex] = editPoll;
          this.Createdpolls = updatedPolls;
          this.CreatedpollsDataArrived.next(this.Createdpolls);
          this.CreatedpollsChanged.next(this.Createdpolls);
        });
    });
  }
  deletePoll(id) {
    this.httpService.delete(`/voting/deletePoll/${id}/`)
      .subscribe(() => {
        swal.fire(
          {title: 'Deleted!',
            text: 'Poll Deleted!',
            type: 'success',
            allowOutsideClick: false}
        );
      });
  }
}
