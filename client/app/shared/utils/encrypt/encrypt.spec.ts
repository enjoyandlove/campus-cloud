import { base64 } from './encrypt';

const decodedInput = 'mockInput';
const encodedInput = 'bW9ja0lucHV0';

describe('Should encode', () => {
  it('Should encode', () => {
    expect(base64.encode(decodedInput)).toBe(encodedInput);
  })

  it('Should decode', () => {
    expect(base64.decode(encodedInput)).toBe(decodedInput);
  })
})
