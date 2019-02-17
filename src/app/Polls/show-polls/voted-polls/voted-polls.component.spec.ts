import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotedPollsComponent } from './voted-polls.component';

describe('VotedPollsComponent', () => {
  let component: VotedPollsComponent;
  let fixture: ComponentFixture<VotedPollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotedPollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotedPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
