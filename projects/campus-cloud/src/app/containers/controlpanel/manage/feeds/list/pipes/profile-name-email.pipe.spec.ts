import { ProfileNameEmailPipe } from './profile-name-email.pipe';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { async, TestBed } from '@angular/core/testing';
import { OriginatorType, SocialContentInteractionItem } from '@campus-cloud/services';

describe('ProfileNameEmailPipe', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [ProfileNameEmailPipe]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let pipe: ProfileNameEmailPipe;

  beforeEach(async(() => {
    pipe = TestBed.get(ProfileNameEmailPipe);
  }));

  it("should be equal to user's name for originator type user and no email present", () => {
    const profile: SocialContentInteractionItem = {
      id: 123,
      name: 'Mark',
      originator_type: OriginatorType.user
    };

    const result: string = pipe.transform(profile);

    expect('Mark').toEqual(result);
  });

  it("should be equal to user's name for originator type store and no email present", () => {
    const profile: SocialContentInteractionItem = {
      id: 123,
      name: 'Mark',
      originator_type: OriginatorType.store
    };

    const result: string = pipe.transform(profile);

    expect('Mark').toEqual(result);
  });

  it("should be include user's email for originator type user and when email is present", () => {
    const profile: SocialContentInteractionItem = {
      id: 123,
      name: 'Mark',
      email: 'mark@test.com',
      originator_type: OriginatorType.user
    };

    const result: string = pipe.transform(profile);

    expect('Mark (mark@test.com)').toEqual(result);
  });

  it("should be equal to user's name for originator type store and email is present", () => {
    const profile: SocialContentInteractionItem = {
      id: 123,
      name: 'Mark',
      email: 'mark@test.com',
      originator_type: OriginatorType.store
    };

    const result: string = pipe.transform(profile);

    expect('Mark').toEqual(result);
  });
});
