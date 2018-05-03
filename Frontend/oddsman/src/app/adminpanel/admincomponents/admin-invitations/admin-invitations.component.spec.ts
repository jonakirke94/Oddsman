import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvitationsComponent } from './admin-invitations.component';

describe('AdminInvitationsComponent', () => {
  let component: AdminInvitationsComponent;
  let fixture: ComponentFixture<AdminInvitationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
