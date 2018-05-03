import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTournamentsComponent } from './admin-tournaments.component';

describe('AdminTournamentsComponent', () => {
  let component: AdminTournamentsComponent;
  let fixture: ComponentFixture<AdminTournamentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTournamentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
