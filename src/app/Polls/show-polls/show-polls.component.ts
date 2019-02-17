import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-show-polls',
  templateUrl: './show-polls.component.html',
  styleUrls: ['./show-polls.component.css']
})
export class ShowPollsComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }
  showActivePolls() {
    this.router.navigate(['activeVotedPolls'], {relativeTo: this.route});
  }
  showEndedPolls() {
    this.router.navigate(['endedPolls'], {relativeTo: this.route});
  }
  showCreatedPolls() {
    this.router.navigate(['createdPolls'], {relativeTo: this.route});
  }
}
