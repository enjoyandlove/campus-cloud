import { TestBed, async } from '@angular/core/testing';
import * as moment from 'moment';

import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { mockDataExportWallPost, mockDataExportWallComment } from './tests/mocks';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { CPI18nService } from '@campus-cloud/shared/services';
import { DataExportUtilsService } from './data-export.utils.service';

describe('DataExportUtilsService', () => {
  let session: CPSession;
  let cpI18n: CPI18nService;
  let service: DataExportUtilsService;

  beforeEach(async(() =>
    TestBed.configureTestingModule({
      imports: [CPTestModule]
    })));

  beforeEach(() => {
    service = TestBed.get(DataExportUtilsService);

    session = TestBed.get(CPSession);
    cpI18n = TestBed.get(CPI18nService);
  });

  it('should return reports', () => {
    expect(DataExportUtilsService.reports).toBeDefined();
    expect(DataExportUtilsService.reports.length).toBe(2);
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

    it('should have right file name', () => {
      const [, , fileName] = spy.calls.mostRecent().args;
      expect(fileName).toBe(`Campus_Wall_Comment_${service.fileDateSignature}`);
    });

    it('should have right data', () => {
      const [, data] = spy.calls.mostRecent().args;
      const result = Object.values(data[0]);
      const expectedValues = [
        mockDataExportWallComment.thread_id,
        mockDataExportWallComment.author_name,
        mockDataExportWallComment.author_email,
        mockDataExportWallComment.student_id,
        CPDate.fromEpoch(
          new Date(mockDataExportWallComment.created_at).getTime() / 1000,
          session.tz
        ).format('DD/MM/YYYY hh:mm:ssA'),
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

    it('should have right file name', () => {
      const [, , fileName] = spy.calls.mostRecent().args;
      expect(fileName).toBe(`Campus_Wall_Post_${service.fileDateSignature}`);
    });

    it('should have right data', () => {
      const [, data] = spy.calls.mostRecent().args;
      const result = Object.values(data[0]);
      const expectedValues = [
        mockDataExportWallPost.id,
        mockDataExportWallPost.author_name,
        mockDataExportWallPost.author_email,
        mockDataExportWallPost.student_id,
        CPDate.fromEpoch(
          new Date(mockDataExportWallPost.created_at).getTime() / 1000,
          session.tz
        ).format('DD/MM/YYYY hh:mm:ssA'),
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
