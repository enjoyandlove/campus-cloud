import IHealthPass from '../health-pass.interface';

export const mockHealthPass: Array<IHealthPass> = [
  {
    name: 'You are clear!',
    title: 'Green Health Pass',
    description:
      'Valid for 24 hours. If you start experiencing any symptoms, please immediately report to the health center.',
    image_url: '',
    state: 1,
    icon: ''
  },
  {
    name: 'You are exhibiting symptoms',
    title: 'Yellow Health Pass',
    description:
      "It's important that you stay home! Monitor your symptoms in the next 24 hours and go get tested.",
    image_url: '',
    state: 2,
    icon: ''
  },
  {
    name: 'You cannot come to campus',
    title: 'Red Health Pass',
    description:
      "It's important that you stay home! Monitor your symptoms in the next 24 hours and go get tested.",
    image_url: '',
    state: 3,
    icon: ''
  },
  {
    name: 'No valid pass',
    title: 'No Health Pass',
    description:
      'You do not have a valid Health Pass, please fill in a form from the campus guide to get one.',
    image_url: '',
    state: 4,
    icon: ''
  }
];
