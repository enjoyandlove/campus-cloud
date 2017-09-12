import { CPImage } from './image';

describe('CPImage', () => {
  it('Should return true if false does not exceed limit size', () => {
    expect(CPImage.isSizeOk(2000, CPImage.MAX_IMAGE_SIZE)).toBeTruthy();
  })

  it('Should return false if false does exceed limit size', () => {
    expect(CPImage.isSizeOk(CPImage.MAX_IMAGE_SIZE + 1, CPImage.MAX_IMAGE_SIZE)).toBeFalsy();
  })

  it('Should be truthy with right extension', () => {
    expect(CPImage.isValidExtension('jpg', CPImage.VALID_EXTENSIONS)).toBeTruthy();
  })

  it('Should be falsy with wrong extension', () => {
    expect(CPImage.isValidExtension('gif', CPImage.VALID_EXTENSIONS)).toBeFalsy();
  })
})
