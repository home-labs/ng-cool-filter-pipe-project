import { TestBed } from '@angular/core/testing';

import { NgFilterCoolService } from './ng-filter-cool.service';

describe('NgFilterCoolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgFilterCoolService = TestBed.get(NgFilterCoolService);
    expect(service).toBeTruthy();
  });
});
