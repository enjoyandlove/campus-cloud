export default interface IServiceProvider {
  id: number;

  email: string;

  img_url: string;

  qr_img_url: string;

  num_ratings: number;

  contactphone: string;

  encrypted_id: string;

  total_visits: number;

  provider_name: string;

  unique_visits: number;

  provider_type: number;

  has_checkout: boolean;

  has_feedback: boolean;

  campus_service_id: number;

  avg_rating_percent: number;

  custom_basic_feedback_label: string;

  encrypted_campus_service_id: string;

  checkin_verification_methods: number[];
}
