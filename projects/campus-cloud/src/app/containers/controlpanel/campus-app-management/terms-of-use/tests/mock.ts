import { delay } from 'rxjs/operators';
import { of } from 'rxjs';

export class MockTermsOfUseService {
  getTerms() {
    return of(mockTerms).pipe(delay(400));
  }

  postTerms() {
    return of(mockTerms).pipe(delay(400));
  }
}

export const mockTerms = {
  tos_str: 'Campus Cloud allows you to 45215425_p_78458585 your campus tos.',
  tos_data_dict: {
    '45215425_p_78458585': ['publish', 'https://www.publish.com']
  }
};

export const mockEditorContent = [
  { insert: 'Campus Cloud allows you to ' },
  {
    insert: 'publish',
    attributes: { link: 'https://www.publish.com' }
  },
  { insert: ' your campus tos.' }
];

export const mockDisclaimerText =
  'By signing up, you agree to the Ready Education <a href="https://www.readyeducation.com/privacy" target="_blank">privacy policy</a> and <a href="https://www.readyeducation.com/tos" target="_blank">terms of service</a>.';
