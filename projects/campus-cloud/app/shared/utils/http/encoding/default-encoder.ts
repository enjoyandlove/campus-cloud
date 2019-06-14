import { HttpUrlEncodingCodec } from '@angular/common/http';

export class DefaultEncoder extends HttpUrlEncodingCodec {
  // Angular's HttpParams implementation overrides "+" and other special character encoding
  // passing this class into HttpParams allows us to send special characters in URL query params
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
}
