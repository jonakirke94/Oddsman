import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistoryComponent } from './history.component';

describe('HistoryComponent', () => {
  let component: AdminHistoryComponent;
  let fixture: ComponentFixture<AdminHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
