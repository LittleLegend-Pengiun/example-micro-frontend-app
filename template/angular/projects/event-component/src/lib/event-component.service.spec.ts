import { TestBed } from '@angular/core/testing';

import { EventComponentService } from './event-component.service';

describe('EventComponentService', () => {
  let service: EventComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
