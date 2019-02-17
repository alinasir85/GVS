import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndedPollsComponent } from './ended-polls.component';

describe('EndedPollsComponent', () => {
  let component: EndedPollsComponent;
  let fixture: ComponentFixture<EndedPollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndedPollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndedPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
