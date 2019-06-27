import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { HTTPService } from './http.service';

describe('HTTPService', () => {
  let service: HTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HTTPService]
    });
  });

  beforeEach(() => {
    service = TestBed.get(HTTPService);
  });

  it('should sanitize string', () => {
    const expected = { name: 'James' };
    const entries = { name: '   James  ' };

    const result = service.sanitizeEntries(entries);

    expect(result).toEqual(expected);
  });

  it('should sanitize object', () => {
    const expected = { user: { name: 'James' } };
    const entries = { user: { name: '  James  ' } };

    const result = service.sanitizeEntries(entries);

    expect(result).toEqual(expected);
  });

  it('should sanitize array', () => {
    const expected = { user: [{ name: 'James' }] };
    const entries = { user: [{ name: '  James  ' }] };

    const result = service.sanitizeEntries(entries);

    expect(result).toEqual(expected);
  });
});
