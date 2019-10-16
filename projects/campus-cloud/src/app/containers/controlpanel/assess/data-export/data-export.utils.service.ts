import { Injectable } from '@angular/core';
import * as moment from 'moment';

import {
  IDataExport,
  DataExportType,
  IDataExportWallsPost,
  IDataExportWallsComment
} from './data-export.interface';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { CPI18nService } from '@campus-cloud/shared/services';
import { createSpreadSheet } from '@campus-cloud/shared/utils/csv';

@Injectable({
  providedIn: 'root'
})
export class DataExportUtilsService {
  static readonly reports: IDataExport[] = [
    { type: DataExportType.wallPosts, name: 't_data_export_wall_posts' },
    { type: DataExportType.wallComments, name: 't_data_export_wall_comments' }
  ];

  readonly fileDateSignature = moment().format('YYYY_MM_DD_HHmm');

  constructor(private cpI18n: CPI18nService, private session: CPSession) {}

  generateCSV(columns: string[], data: any[], fileName: string) {
    createSpreadSheet(data, columns, fileName);
  }

  createWallPostCSV(data: IDataExportWallsPost[]) {
    const columns = {
      id: this.cpI18n.translate('t_data_export_csv_posts_post_id'),
      author_name: this.cpI18n.translate('t_data_export_csv_posts_student_or_host_name'),
      author_email: this.cpI18n.translate('t_data_export_csv_posts_student_email'),
      student_id: this.cpI18n.translate('t_data_export_csv_posts_student_id'),
      created_at: this.cpI18n.translate('t_data_export_csv_posts_date_posted'),
      content: this.cpI18n.translate('t_data_export_csv_posts_wall_post'),
      attachments: this.cpI18n.translate('t_data_export_csv_posts_wall_post_images'),
      likes: this.cpI18n.translate('t_data_export_csv_posts_likes_count'),
      dislikes: this.cpI18n.translate('t_data_export_csv_posts_flags_count'),
      comment_count: this.cpI18n.translate('t_data_export_csv_posts_comments_count')
    };

    const formattedData = data.map((d: IDataExportWallsPost) => {
      const {
        id,
        content,
        created_at,
        student_id,
        author_name,
        author_email,
        attachments,
        likes,
        comment_count,
        dislikes
      } = d;

      return {
        [columns.id]: id,
        [columns.author_name]: author_name,
        [columns.author_email]: author_email,
        [columns.student_id]: student_id,
        [columns.created_at]: CPDate.fromEpoch(
          new Date(created_at).getTime() / 1000,
          this.session.tz
        ).format('DD/MM/YYYY hh:mm:ssA'),
        [columns.content]: content,
        [columns.attachments]: attachments.join(', '),
        [columns.likes]: likes,
        [columns.dislikes]: dislikes,
        [columns.comment_count]: comment_count
      };
    });

    this.generateCSV(
      Object.values(columns),
      formattedData,
      `Campus_Wall_Post_${this.fileDateSignature}`
    );
  }

  createWallCommentsCSV(data: IDataExportWallsComment[]) {
    const columns = {
      thread_id: this.cpI18n.translate('t_data_export_csv_posts_post_id'),
      author_name: this.cpI18n.translate('t_data_export_csv_posts_student_or_host_name'),
      author_email: this.cpI18n.translate('t_data_export_csv_posts_student_email'),
      student_id: this.cpI18n.translate('t_data_export_csv_posts_student_id'),
      created_at: this.cpI18n.translate('t_data_export_csv_walls_date_created'),
      content: this.cpI18n.translate('t_data_export_csv_wall_comment_comment'),
      attachments: this.cpI18n.translate('t_data_export_csv_wall_comment_images'),
      likes: this.cpI18n.translate('t_data_export_csv_posts_likes_count'),
      dislikes: this.cpI18n.translate('t_data_export_csv_posts_flags_count')
    };

    const formattedData = data.map((d: IDataExportWallsComment) => {
      const {
        thread_id,
        content,
        created_at,
        student_id,
        author_name,
        author_email,
        attachments,
        likes,
        dislikes
      } = d;

      return {
        [columns.thread_id]: thread_id,
        [columns.author_name]: author_name,
        [columns.author_email]: author_email,
        [columns.student_id]: student_id,
        [columns.created_at]: CPDate.fromEpoch(
          new Date(created_at).getTime() / 1000,
          this.session.tz
        ).format('DD/MM/YYYY hh:mm:ssA'),
        [columns.content]: content,
        [columns.attachments]: attachments.join(', '),
        [columns.likes]: likes,
        [columns.dislikes]: dislikes
      };
    });

    this.generateCSV(
      Object.values(columns),
      formattedData,
      `Campus_Wall_Comment_${this.fileDateSignature}`
    );
  }
}
