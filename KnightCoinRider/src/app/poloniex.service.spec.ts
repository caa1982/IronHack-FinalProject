import { TestBed, inject } from '@angular/core/testing';

import { PoloniexService } from './poloniex.service';

describe('PoloniexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoloniexService]
    });
  });

  it('should be created', inject([PoloniexService], (service: PoloniexService) => {
    expect(service).toBeTruthy();
  }));
});
