import { parseErrorResponse } from '@shared/utils/http/api-error-parser';

enum errorKeys {
  'school_id' = 'invalid school id',
  'locations_associated_to_category' = 'locations associated to category'
}

const errorResponse = {
  error: {
    error: 'locations_associated_to_category'
  }
};

const errorResponseObject = {
  error: {
    error: {
      school_id: 'school_id'
    }
  }
};

describe('ErrorParser', () => {
  it('Should check error response (string)', () => {
    const response = parseErrorResponse(errorResponse.error);
    const result = errorKeys[response];
    const expected = errorKeys.locations_associated_to_category;

    expect(expected).toEqual(result);
  });

  it('Should check error response (object)', () => {
    const response = parseErrorResponse(errorResponseObject.error);
    const result = errorKeys[response];
    const expected = errorKeys.school_id;

    expect(expected).toEqual(result);
  });
});
