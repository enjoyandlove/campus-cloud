export interface ISchedule {
  day: number;

  has_checked: boolean;

  items: [{
    url: string;

    name: string;

    end_time: number;

    start_time: number;

    description: string;
  }];
}
