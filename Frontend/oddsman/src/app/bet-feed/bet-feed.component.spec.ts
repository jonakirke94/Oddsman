import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetFeedComponent } from './bet-feed.component';

describe('BetFeedComponent', () => {
  let component: BetFeedComponent;
  let fixture: ComponentFixture<BetFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
