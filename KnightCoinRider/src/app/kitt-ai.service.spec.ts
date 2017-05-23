import { TestBed, inject } from '@angular/core/testing';

import { KittAIService } from './kitt-ai.service';

describe('KittAIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KittAIService]
    });
  });

  it('should be created', inject([KittAIService], (service: KittAIService) => {
    expect(service).toBeTruthy();
  }));
});
