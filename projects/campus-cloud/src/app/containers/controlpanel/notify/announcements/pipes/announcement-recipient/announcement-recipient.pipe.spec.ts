import { async, TestBed } from '@angular/core/testing';

import { IAnnouncement } from './../../model';
import { mockAnnouncement } from './../../tests/mocks';
import { CPI18nService } from '@campus-cloud/shared/services';
import { AnnouncementRecipientPipe } from './announcement-recipient.pipe';

describe('AnnouncementRecipientPipe', () => {
  let cpI18n: CPI18nService;
  let pipe: AnnouncementRecipientPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CPI18nService, AnnouncementRecipientPipe],
      declarations: [AnnouncementRecipientPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    pipe = TestBed.get(AnnouncementRecipientPipe);
    cpI18n = TestBed.get(CPI18nService);
  });

  it('should return right label based on annoucement recipient', () => {
    let announcement: IAnnouncement = {
      ...mockAnnouncement,
      is_school_wide: true,
      user_details: [],
      list_details: []
    };

    expect(pipe.transform(announcement)).toBe(cpI18n.translate('campus_wide'));

    announcement = {
      ...announcement,
      is_school_wide: false,
      user_details: [{ id: 1, firstname: 'John', lastname: 'Doe', email: 'jdoe@email.com' }]
    };

    expect(pipe.transform(announcement)).toBe(`John Doe (0 ${cpI18n.translate('more')})`);

    announcement = {
      ...announcement,
      list_details: [{ id: 1, name: 'List Name' }],
      user_details: []
    };

    expect(pipe.transform(announcement)).toBe('List Name');

    announcement = {
      ...announcement,
      list_details: [],
      user_details: []
    };

    expect(pipe.transform(announcement)).toBe('');
  });
});
