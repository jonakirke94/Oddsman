import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHistoryComponentComponent } from './user-history-component.component';

describe('UserHistoryComponentComponent', () => {
  let component: UserHistoryComponentComponent;
  let fixture: ComponentFixture<UserHistoryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHistoryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHistoryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
