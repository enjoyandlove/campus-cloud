import { Injectable } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { CPDate, compressFiles, createSpreadSheet } from '@campus-cloud/shared/utils';
import { IDataExportWallsComment, IDataExportWallsPost } from './model/feeds.interfaces';

@Injectable({
  providedIn: 'root'
})
export class FeedsExportUtilsService {
  readonly fileDateSignature = CPDate.format(new Date(), 'YYYY_MM_DD_HHmm');

  constructor(private cpI18n: CPI18nService, private session: CPSession) {}
  generateCSV(columns: string[], data: any[]) {
    return createSpreadSheet(data, columns, 'file', false);
  }

  createWallPostCSV(data: IDataExportWallsPost[]) {
    const columns = {
      id: this.cpI18n.translate('t_data_export_csv_posts_post_id'),
      author_name: this.cpI18n.translate('t_data_export_csv_posts_student_or_host_name'),
      author_email: this.cpI18n.translate('t_data_export_csv_posts_student_email'),
      student_id: this.cpI18n.translate('t_data_export_csv_posts_student_id'),
      channel_name: this.cpI18n.translate('t_data_export_csv_posts_channel_name'),
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
        channel_name,
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
        [columns.channel_name]: channel_name,
        [columns.created_at]: CPDate.fromEpoch(created_at, this.session.tz).format(
          'DD/MM/YYYY hh:mm:ssA'
        ),
        [columns.content]: content,
        [columns.attachments]: attachments.join(', '),
        [columns.likes]: likes,
        [columns.dislikes]: dislikes,
        [columns.comment_count]: comment_count
      };
    });

    return this.generateCSV(Object.values(columns), formattedData);
  }

  createWallCommentsCSV(data: IDataExportWallsComment[]) {
    const columns = {
      thread_id: this.cpI18n.translate('t_data_export_csv_posts_post_id'),
      thread_content: this.cpI18n.translate('t_data_export_csv_walls_post'),
      author_name: this.cpI18n.translate('t_data_export_csv_posts_student_or_host_name'),
      author_email: this.cpI18n.translate('t_data_export_csv_posts_student_email'),
      student_id: this.cpI18n.translate('t_data_export_csv_posts_student_id'),
      channel_name: this.cpI18n.translate('t_data_export_csv_posts_channel_name'),
      created_at: this.cpI18n.translate('t_data_export_csv_walls_date_created'),
      content: this.cpI18n.translate('t_data_export_csv_wall_comment_comment'),
      attachments: this.cpI18n.translate('t_data_export_csv_wall_comment_images'),
      likes: this.cpI18n.translate('t_data_export_csv_posts_likes_count'),
      dislikes: this.cpI18n.translate('t_data_export_csv_posts_flags_count')
    };

    const formattedData = data.map((d: IDataExportWallsComment) => {
      const {
        thread_id,
        thread_content,
        content,
        created_at,
        student_id,
        channel_name,
        author_name,
        author_email,
        attachments,
        likes,
        dislikes
      } = d;

      return {
        [columns.thread_id]: thread_id,
        [columns.thread_content]: thread_content,
        [columns.author_name]: author_name,
        [columns.author_email]: author_email,
        [columns.student_id]: student_id,
        [columns.channel_name]: channel_name,
        [columns.created_at]: CPDate.fromEpoch(created_at, this.session.tz).format(
          'DD/MM/YYYY hh:mm:ssA'
        ),
        [columns.content]: content,
        [columns.attachments]: attachments.join(', '),
        [columns.likes]: likes,
        [columns.dislikes]: dislikes
      };
    });

    return this.generateCSV(Object.values(columns), formattedData);
  }

  compressFiles(wall, comment) {
    const files = [
      { name: `Campus_Wall_Post_${this.fileDateSignature}`, content: this.createWallPostCSV(wall) },
      {
        name: `Campus_Wall_Comment_${this.fileDateSignature}`,
        content: this.createWallCommentsCSV(comment)
      }
    ];

    compressFiles(files, `Campus_Wall_Post_Comment_${this.fileDateSignature}`);
  }
}
