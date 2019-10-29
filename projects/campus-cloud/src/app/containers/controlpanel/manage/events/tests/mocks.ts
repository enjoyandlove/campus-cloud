import { of } from 'rxjs';
import { MOCK_IMAGE } from '@campus-cloud/shared/tests';

export const mockAttendees = [
  {
    firstname: 'mohsin',
    lastname: 'ahmed',
    student_identifier: '',
    feedback_rating: -1,
    check_in_time: 1534759067,
    id: 14726,
    check_out_time_epoch: 0,
    feedback_time: -1,
    feedback_text: '',
    check_in_method: 1,
    email: 'mohsin.ahmed@oohlalamobile.com',
    rsvp: 0
  },
  {
    firstname: 'Muhammad',
    lastname: 'Kumail',
    student_identifier: '',
    feedback_rating: -1,
    check_in_time: 1534759041,
    id: 14725,
    check_out_time_epoch: 0,
    feedback_time: -1,
    feedback_text: '',
    check_in_method: 1,
    email: 'muhammad.kumail@oohlalamobile.com',
    rsvp: 0
  }
];

export const mockCheckIn = {
  id: 125457,
  firstname: 'Hello',
  lastname: 'World',
  check_in_method: 3,
  email: 'helloworld@test.com',
  check_in_time: 1460806527,
  check_out_time_epoch: 1601549048
};

export class MockEventService {
  dummy: any;

  deleteEventById(id: number, search: any) {
    this.dummy = [id, search];

    return of({});
  }
}

export const filledForm = {
  end: 0,
  start: 0,
  city: '',
  latitude: 0,
  store_id: 1,
  longitude: 0,
  title: 'title',
  room_data: 123,
  is_all_day: true,
  country: 'country',
  has_checkout: true,
  address: 'address',
  event_manager_id: 1,
  location: 'location',
  province: 'province',
  event_attendance: '',
  postal_code: '75400',
  poster_url: MOCK_IMAGE,
  description: 'description',
  event_feedback: 'feedback',
  poster_thumb_url: MOCK_IMAGE,
  attendance_manager_email: '',
  custom_basic_feedback_label: '',
  attend_verification_methods: ''
};

export const mockEvent = {
  id: 1678187,
  store_id: 43776,
  title: 'title',
  description: 'test',
  latitude: 0.0,
  longitude: 0.0,
  address: '',
  country: '',
  province: '',
  city: '',
  postal_code: '',
  start: 1553007600,
  end: 1553009400,
  likes: 0,
  dislikes: 0,
  checkins: 0,
  is_repeated: false,
  location: 'Jaipur, Rajasthan, India',
  room_data: '',
  poster_url:
    'http://s3.amazonaws.com/webservice-event-image-staging/157/event_cbc483f2df32401991777d5996baa9a1.png',
  poster_thumb_url:
    'http://s3.amazonaws.com/webservice-event-image-staging/157/event_cbc483f2df32401991777d5996baa9a1_t.png',
  attends: 0,
  extra_data_id: 0,
  extra: '6e30300995c4488c166c8b7f775e0df3|ical|1553007600',
  integration_feed_id: 0,
  avg_rating_percent: -1,
  is_external: true,
  rating_scale_maximum: -1,
  num_ratings: 0,
  related_feedback_obj_id: -1,
  attend_verification_methods: [1, 2, 3],
  has_checkout: false,
  encrypted_id: 'zLa8n2oT0F21GfKQucCxFA',
  source: -1,
  store_name: '##200 - Service Assessment ON, Feedback ON',
  store_category: 19,
  store_logo_url:
    'https://s3.amazonaws.com/campus-cloud-image-use/5hqor48nmhiqa4ri11gjv2ew2dfk6u3miklpdj7zfij6m4d5px.png',
  event_attendance: 0,
  event_feedback: 0,
  verified_checkins: 0
};
