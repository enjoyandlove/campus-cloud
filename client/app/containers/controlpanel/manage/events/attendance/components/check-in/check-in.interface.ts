export interface ICheckIn {
  id?: number;

  email: string;

  lastname: string;

  firstname: string;

  check_in_time: number;

  check_in_method: number;

  check_out_time_epoch: number;
}