import { TestBed, async } from '@angular/core/testing';
import * as moment from 'moment';

import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { CPI18nService } from '@campus-cloud/shared/services';
import { FeedsExportUtilsService } from './feeds-export.utils.service';
import { mockDataExportWallPost, mockDataExportWallComment } from './tests/mocks';

describe('FeedsExportUtilsService', () => {
  let session: CPSession;
  let cpI18n: CPI18nService;
  let service: FeedsExportUtilsService;

  beforeEach(async(() =>
    TestBed.configureTestingModule({
      imports: [CPTestModule]
    })));

  beforeEach(() => {
    service = TestBed.inject(FeedsExportUtilsService);

    session = TestBed.inject(CPSession);
    cpI18n = TestBed.inject(CPI18nService);
  });

  it('should have right file signature', () => {
    expect(service.fileDateSignature).toBe(moment().format('YYYY_MM_DD_HHmm'));
  });

  describe('createWallCommentsCSV', () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(service, 'generateCSV');
      service.createWallCommentsCSV([mockDataExportWallComment]);
    });

    it('should have right columns', () => {
      const [columns] = spy.calls.mostRecent().args;
      const expectedColumns = [
        cpI18n.translate('t_data_export_csv_posts_post_id'),
        cpI18n.translate('t_data_export_csv_posts_student_or_host_name'),
        cpI18n.translate('t_data_export_csv_posts_student_email'),
        cpI18n.translate('t_data_export_csv_posts_student_id'),
        cpI18n.translate('t_data_export_csv_walls_date_created'),
        cpI18n.translate('t_data_export_csv_wall_comment_comment'),
        cpI18n.translate('t_data_export_csv_wall_comment_images'),
        cpI18n.translate('t_data_export_csv_posts_likes_count'),
        cpI18n.translate('t_data_export_csv_posts_flags_count')
      ];

      expectedColumns.forEach((c: string) => {
        expect(columns.includes(c)).toBe(true, `Missing column ${c}`);
      });
    });

    it('should have right data', () => {
      const [, data] = spy.calls.mostRecent().args;
      const result = Object.values(data[0]);
      const expectedValues = [
        mockDataExportWallComment.thread_id,
        mockDataExportWallComment.author_name,
        mockDataExportWallComment.author_email,
        mockDataExportWallComment.student_id,
        CPDate.fromEpoch(mockDataExportWallComment.created_at, session.tz).format(
          'DD/MM/YYYY hh:mm:ssA'
        ),
        mockDataExportWallComment.content,
        mockDataExportWallComment.attachments.join(''),
        mockDataExportWallComment.likes,
        mockDataExportWallComment.dislikes
      ];

      expectedValues.forEach((v: string) => {
        expect(result.includes(v)).toBe(true, `Missing value ${v}`);
      });
    });
  });

  describe('createWallPostCSV', () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(service, 'generateCSV');
      service.createWallPostCSV([mockDataExportWallPost]);
    });

    it('should have right columns', () => {
      const [columns] = spy.calls.mostRecent().args;
      const expectedColumns = [
        cpI18n.translate('t_data_export_csv_posts_post_id'),
        cpI18n.translate('t_data_export_csv_posts_student_or_host_name'),
        cpI18n.translate('t_data_export_csv_posts_student_email'),
        cpI18n.translate('t_data_export_csv_posts_student_id'),
        cpI18n.translate('t_data_export_csv_posts_date_posted'),
        cpI18n.translate('t_data_export_csv_posts_wall_post'),
        cpI18n.translate('t_data_export_csv_posts_wall_post_images'),
        cpI18n.translate('t_data_export_csv_posts_likes_count'),
        cpI18n.translate('t_data_export_csv_posts_flags_count'),
        cpI18n.translate('t_data_export_csv_posts_comments_count')
      ];

      expectedColumns.forEach((c: string) => {
        expect(columns.includes(c)).toBe(true, `Missing column ${c}`);
      });
    });

    it('should have right data', () => {
      const [, data] = spy.calls.mostRecent().args;
      const result = Object.values(data[0]);
      const expectedValues = [
        mockDataExportWallPost.id,
        mockDataExportWallPost.author_name,
        mockDataExportWallPost.author_email,
        mockDataExportWallPost.student_id,
        CPDate.fromEpoch(mockDataExportWallPost.created_at, session.tz).format(
          'DD/MM/YYYY hh:mm:ssA'
        ),
        mockDataExportWallPost.content,
        mockDataExportWallPost.attachments.join(''),
        mockDataExportWallPost.likes,
        mockDataExportWallPost.dislikes,
        mockDataExportWallPost.comment_count
      ];

      expectedValues.forEach((v: string) => {
        expect(result.includes(v)).toBe(true, `Missing value ${v}`);
      });
    });
  });
});
