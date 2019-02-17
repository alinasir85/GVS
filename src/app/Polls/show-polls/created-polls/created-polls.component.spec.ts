import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedPollsComponent } from './created-polls.component';

describe('CreatedPollsComponent', () => {
  let component: CreatedPollsComponent;
  let fixture: ComponentFixture<CreatedPollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedPollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
