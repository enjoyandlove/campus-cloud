export interface IDataExport {
  name: string;
  type: DataExportType;
}

export enum DataExportType {
  wallPosts = 'wallPosts',
  wallComments = 'wallComments'
}

export const dataExportAmplitudeMap = {
  [DataExportType.wallPosts]: 'Campus Wall Post',
  [DataExportType.wallComments]: 'Campus Wall Comment'
};

export interface IDataExportWallsComment {
  thread_id: number;
  author_name: string;
  author_email: string;
  student_id: string;
  created_at: string;
  content: string;
  attachments: string[];
  likes: number;
  dislikes: number;
}

export interface IDataExportWallsPost {
  id: string;
  author_name: string;
  author_email: string;
  student_id: string;
  created_at: string;
  content: string;
  attachments: string[];
  likes: number;
  dislikes: number;
  comment_count: number;
}
