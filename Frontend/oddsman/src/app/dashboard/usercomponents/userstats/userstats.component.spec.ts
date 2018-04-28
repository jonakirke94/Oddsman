import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserstatsComponent } from './userstats.component';

describe('UserstatsComponent', () => {
  let component: UserstatsComponent;
  let fixture: ComponentFixture<UserstatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserstatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserstatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
