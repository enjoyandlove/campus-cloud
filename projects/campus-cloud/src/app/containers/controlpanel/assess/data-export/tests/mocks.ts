import { of } from 'rxjs';

import {
  IDataExportAppUsers,
  IDataExportWallsPost,
  IDataExportWallsComment
} from './../data-export.interface';

export const mockDataExportWallPost: IDataExportWallsPost = {
  id: '1',
  author_name: 'John',
  author_email: 'john@gmail.com',
  student_id: '1',
  created_at: 'Fri Oct 11 2019 11:50:19 GMT-0400',
  content: 'Post Body',
  attachments: [],
  likes: 1,
  dislikes: 1,
  comment_count: 1
};

export const mockDataExportWallComment: IDataExportWallsComment = {
  thread_id: 1,
  author_name: 'john',
  author_email: 'john@gmail.com',
  student_id: '1',
  created_at: 'Fri Oct 11 2019 11:50:19 GMT-0400',
  content: 'Comment Body',
  attachments: [],
  likes: 1,
  dislikes: 1
};

export const mockDataExportAppUsers: IDataExportAppUsers = {
  status: 1,
  student_id: '1',
  lastname: 'paul',
  firstname: 'john',
  email: 'john@gmail.com',
  last_login: 1580832326,
  date_joined: 1580832277
};

export class MockDataExportService {
  placeholder;

  generateReportByType(type) {
    this.placeholder = type;
    return of(type);
  }
}
