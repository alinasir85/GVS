import { TestBed } from '@angular/core/testing';

import { OptionService } from '../../shared/option.service';

describe('OptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OptionService = TestBed.get(OptionService);
    expect(service).toBeTruthy();
  });
});
