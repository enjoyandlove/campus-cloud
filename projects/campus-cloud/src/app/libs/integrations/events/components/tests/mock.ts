import { IPreviewResponse } from '../../../common/model';

export const mockEventIntegrationPreview: IPreviewResponse[] = [1, 2, 3, 4, 5, 6].map((index) => {
  return {
    title: `Title ${index}`,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    start_time: 1900784310,
    end_time: 1900870710,
    external_id: index + '-' + Date.now()
  };
});
