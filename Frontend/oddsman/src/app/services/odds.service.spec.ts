import { TestBed, inject } from '@angular/core/testing';

import { OddsService } from './odds.service';

describe('OddsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OddsService]
    });
  });

  it('should be created', inject([OddsService], (service: OddsService) => {
    expect(service).toBeTruthy();
  }));
});
