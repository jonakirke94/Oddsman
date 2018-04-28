import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendtipsComponent } from './sendtips.component';

describe('SendtipsComponent', () => {
  let component: SendtipsComponent;
  let fixture: ComponentFixture<SendtipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendtipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendtipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
