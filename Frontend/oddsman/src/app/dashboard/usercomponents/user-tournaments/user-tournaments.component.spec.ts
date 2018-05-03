import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTournamentsComponent } from './user-tournaments.component';

describe('UserTournamentsComponent', () => {
  let component: UserTournamentsComponent;
  let fixture: ComponentFixture<UserTournamentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTournamentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
