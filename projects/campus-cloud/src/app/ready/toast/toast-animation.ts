import {
  state,
  style,
  trigger,
  animate,
  transition,
  AnimationTriggerMetadata
} from '@angular/animations';

export const toastAnimations: {
  readonly fadeToast: AnimationTriggerMetadata;
} = {
  fadeToast: trigger('fadeAnimation', [
    state('void', style({ opacity: 0, top: '-{{top}}px' }), { params: { top: '100' } }),
    state('default', style({ opacity: 1, top: '0' })),
    transition('void => *', [style({ opacity: 0 }), animate('{{ fadeIn }}ms')]),
    transition(
      'default => closing',
      animate('{{ fadeOut }}ms', style({ opacity: 0, top: '-{{top}}px' }))
    )
  ])
};

export type ToastAnimationState = 'default' | 'closing';
