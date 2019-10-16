import { of } from 'rxjs';

import { IDataExportWallsPost, IDataExportWallsComment } from './../data-export.interface';

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

export class MockDataExportService {
  placeholder;

  generateReportByType(type) {
    this.placeholder = type;
    return of(type);
  }
}
