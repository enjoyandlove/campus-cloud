export class UserType {
  static isInternal(email: string) {
    return (
      email.endsWith('@oohlalamobile.com') ||
      email.endsWith('@dublabs.com') ||
      email.endsWith('@readyeducation.com')
    );
  }
}
