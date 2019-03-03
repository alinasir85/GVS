import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {PollModel} from '../../shared/models/poll.model';
import {PollService} from '../../shared/poll.service';
import {OptionModel} from '../../shared/models/option.model';
import {ActivatedRoute, Router} from '@angular/router';
import swal from 'sweetalert2';
import {validate} from './validator';
import {AuthService} from '../../Auth/auth.service';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {
  public pollForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  isPollStarted = false;
  editPollid = 0;
  fixedOptionsCount = 1;
  public dateTimeRange: Date[] = new Array<Date>();
  public min = new Date();
  public areDatesEmpty = false;
  private userID: string = this.authService.getUserId();
  public areDomainsValid = true;
  public areEmailsValid = true;
  public isCriteriaEmpty = false;
  message: string;
  constructor(private pollService: PollService, private authService: AuthService , private router: Router, private route: ActivatedRoute) { }
  getControls() {
    return (<FormArray> this.pollForm.get('options')).controls;
  }
  ngOnInit() {
    this.isEditMode = this.router.url === '/home/editPoll';
    this.initForm();
  }
  initForm() {
    let title = null;
    let  question_outline = null;
    let description = null;
    let pollCriteria_domain = null;
    let  pollCriteria_emails = null;
    let isAdminAllowedForVoting = null;
    const options = new FormArray([]);
    if(this.isEditMode) {
     const poll: PollModel = JSON.parse(localStorage.getItem('poll'));
     const editOptions: OptionModel[] = JSON.parse(localStorage.getItem('options'));
     this.fixedOptionsCount = editOptions.length - 1;
     this.editPollid = poll.id;
     if(new Date(poll.startTime) < new Date()) {
       this.isPollStarted = true;
     }
     title = poll.title;
     question_outline = poll.question_outline;
     description = poll.description;
     pollCriteria_domain = poll.pollCriteria_domain;
     pollCriteria_emails = poll.pollCriteria_emails;
     isAdminAllowedForVoting = true;
     //console.log(poll.isAdminAllowedForVoting);
     for(let option of editOptions) {
       options.push(
         new FormGroup({
           'optName': new FormControl({value: option.title, disabled: this.isEditMode}, Validators.required),
           'optDescription': new FormControl({value: option.description, disabled: this.isEditMode}, Validators.required),
           'id': new FormControl(option.id),
           'pollID' : new FormControl(poll.id)
         })
       );
     }
      this.dateTimeRange = [new Date(poll.startTime), new Date(poll.endTime)];
    }
    else {
      options.push(
        new FormGroup({
          'optName': new FormControl(null, Validators.required),
          'optDescription': new FormControl(null, Validators.required),
          'id': new FormControl(null),
          'pollID' : new FormControl(null)
        })
      );
      options.push(
        new FormGroup({
          'optName': new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9? ]*$/)]),
          'optDescription': new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9? ]*$/)]),
          'id': new FormControl(null),
          'pollID' : new FormControl(null)
        })
      );
    }
    this.pollForm = new FormGroup({
      'title' : new FormControl(title, [Validators.required, Validators.pattern(/^[a-zA-Z0-9? ]*$/)]),
      'question_outline' : new FormControl(question_outline, [Validators.required, Validators.pattern(/^[a-zA-Z0-9? ]*$/)]),
      'description' : new FormControl(description, [Validators.required, Validators.pattern(/^[a-zA-Z0-9? ]*$/)]),
      'options' : options,
      'pollCriteria_domain' : new FormControl({value: pollCriteria_domain, disabled: this.isPollStarted}),
      'pollCriteria_emails'  : new FormControl({value: pollCriteria_emails, disabled: this.isPollStarted}),
      'isAdminAllowedForVoting': new FormControl(isAdminAllowedForVoting)
    });
  }
  onSubmit() {
    this.areDatesEmpty = false;
    this.areEmailsValid = true;
    this.areDomainsValid = true;
    this.isCriteriaEmpty = false;
    const criteriaDomains: string = this.pollForm.getRawValue().pollCriteria_domain;
    const criteriaEmails: string = this.pollForm.getRawValue().pollCriteria_emails;
    if ((criteriaDomains === null || criteriaDomains === '') && (criteriaEmails === null || criteriaEmails === '')) {
      this.isCriteriaEmpty = true;
    } else {
      this.isCriteriaEmpty = false;
      if (criteriaDomains !== null && criteriaDomains !== '') {
    this.areDomainsValid = validate(/^@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      criteriaDomains); }
      if (criteriaEmails !== null && criteriaEmails !== '') {
    this.areEmailsValid = validate(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      criteriaEmails); }
    }

    if (this.dateTimeRange.length < 2 || this.dateTimeRange.includes(null) || this.dateTimeRange.includes(undefined)) {
      this.areDatesEmpty = true;
    } else {
      if (this.areDomainsValid && this.areEmailsValid && !this.isCriteriaEmpty) {
        this.isCriteriaEmpty = false;
        this.areDatesEmpty = false;
        this.isLoading = true;
        const adminVoting = this.pollForm.value.isAdminAllowedForVoting ? 'TRUE' : 'FALSE';
        const startTime = new Date(this.dateTimeRange[0]).toISOString();
        const endTime = new Date(this.dateTimeRange[1]).toISOString();
        const poll: PollModel = new PollModel(
          this.pollForm.value.id,
          this.pollForm.value.title,
          this.pollForm.value.question_outline,
          this.pollForm.value.description,
          this.pollForm.getRawValue().pollCriteria_domain,
          this.pollForm.getRawValue().pollCriteria_emails,
          startTime,
          endTime,
          Number(this.userID),
          adminVoting);
        const options: OptionModel[] = new Array<OptionModel>();
        for (const option of this.pollForm.getRawValue().options) {
          options.push(new OptionModel(option.id, option.optName, option.optDescription, 0, this.editPollid));
        }
        if(!this.isEditMode) {
        this.pollService.createPoll(poll, options);
        this.pollService.CreatedpollsChanged.subscribe((polls: PollModel[]) => {
          this.isLoading = false;
          swal.fire(
            {
              title: 'Success',
              text: 'Poll added!',
              type: 'success',
              allowOutsideClick: false
            }
          );
        });
        }
        else {
          poll.id = this.editPollid;
          let optData = [];
          for(let option of options) {
            if(option.id === null) {
            optData.push({"id": option.id, "title": option.title, "description": option.description, "voteCount": option.voteCount,
              "pollID": this.editPollid}); }
          }
          this.pollService.updatePoll(poll, optData);
          this.pollService.CreatedpollsChanged.subscribe(() => {
            this.isLoading = false;
            swal.fire(
              {
                title: 'Success',
                text: 'Poll Updated!',
                type: 'success',
                allowOutsideClick: false
              }
            );
            localStorage.removeItem('poll');
            localStorage.removeItem('options');
          });
        }
        this.isEditMode = false;
        this.pollForm.reset();
        this.router.navigate(['../Dashboard'], {relativeTo: this.route});
      }
    }
  }
  addOption() {
    (<FormArray>this.pollForm.get('options')).push(new FormGroup({
      'optName': new FormControl(null, Validators.required),
      'optDescription': new FormControl(null, Validators.required),
      'id': new FormControl(null),
      'pollID' : new FormControl(null)
    }));
  }
  deleteOption(index: number) {
    (<FormArray>this.pollForm.get('options')).removeAt(index);
  }
  onFileSelected(files, event) {

    if (files.length === 0) {
      return;
    }

    let fileData = '';
    for(let file of files) {
      //const mimeType = file.type;
      const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt|.doc|.docx|.xls|.xlsx)$/;
      if (!regex.test(file.name.toLowerCase())) {
          this.message = 'Only text, excel, word file is supported.';
        return;
      } else {
        this.message = '';
      }
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        fileData = fileData + reader.result;
        if(event.target.name === 'domain')
        {
          this.pollForm.patchValue({'pollCriteria_domain': fileData});
        }
        if(event.target.name === 'email') {
          this.pollForm.patchValue({'pollCriteria_emails': fileData});
        }
      };
    }
  }
}
