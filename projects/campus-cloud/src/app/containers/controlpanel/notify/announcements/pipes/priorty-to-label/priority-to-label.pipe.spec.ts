import { async, TestBed } from '@angular/core/testing';

import { AnnouncementPriority } from '../../model';
import { CPI18nService } from '@campus-cloud/shared/services';
import { PriorityToLabelPipe } from './priority-to-label.pipe';

describe('PriorityToLabelPipe', () => {
  let cpI18n: CPI18nService;
  let pipe: PriorityToLabelPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CPI18nService, PriorityToLabelPipe],
      declarations: [PriorityToLabelPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    pipe = TestBed.get(PriorityToLabelPipe);
    cpI18n = TestBed.get(CPI18nService);
  });

  it('should return correct label based on priority', () => {
    expect(pipe.transform(AnnouncementPriority.emergency)).toBe(cpI18n.translate('emergency'));

    expect(pipe.transform(AnnouncementPriority.urgent)).toBe(cpI18n.translate('urgent'));

    expect(pipe.transform(AnnouncementPriority.regular)).toBe(cpI18n.translate('regular'));

    expect(pipe.transform(null)).toBe('');
  });
});
