export default interface IAttendee {
  email: string;

  firstname: string;

  lastname: string;

  attendance_id: number;

  check_in_type: string;

  check_out_time_epoch: number;

  check_in_time_epoch: number;

  anonymous_identifier?: string;

  case_id?: string;
}
