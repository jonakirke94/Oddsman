import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultFeedComponent } from './result-feed.component';

describe('ResultFeedComponent', () => {
  let component: ResultFeedComponent;
  let fixture: ComponentFixture<ResultFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
