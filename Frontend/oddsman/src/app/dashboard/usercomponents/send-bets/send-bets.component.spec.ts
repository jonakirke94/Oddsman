import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBetsComponent } from './send-bets.component';

describe('SendBetsComponent', () => {
  let component: SendBetsComponent;
  let fixture: ComponentFixture<SendBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
