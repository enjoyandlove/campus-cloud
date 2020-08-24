import { FullNamePipe } from './full-name.pipe';

describe('FullNamePipe', () => {
  it('create an instance', () => {
    const pipe = new FullNamePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return full name from user object', function() {
    const pipe = new FullNamePipe();
    const user = {
      firstname: 'FirstName',
      lastname: 'LastName'
    };

    const result = pipe.transform(user);

    expect(result).toEqual('FirstName LastName');
  });
});
