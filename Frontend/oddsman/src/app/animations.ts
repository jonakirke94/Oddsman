import {trigger, state, style, animate, transition, stagger, keyframes, query} from '@angular/animations';


export const flyInOut = trigger('flyInOut', [
    state('in', style({ transform: 'translateX(0)' })),
    transition('void => *', [
      style({ transform: 'translateX(100%)' }),
      animate(100)
    ]),
    transition('* => void', [
      animate(100, style({ transform: 'translateX(100%)' }))
    ])
]);

export const listAnimations = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', style({opacity: 0}), {optional: true}),

    query(':enter', stagger('300ms', [
      animate('.6s ease-in', keyframes([
        style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
        style({opacity: .5, transform: 'translateY(35px)', offset: .3}),
        style({opacity: 1, transform: 'translateY(0)', offset: 1}),
      ]))
    ]), {optional: true}),
  ])
]);

export const feedAnimation =
  trigger('feed', [
    transition('* => *', [
      query(':enter', style({opacity: 0}), {optional: true}),

      query(':enter', stagger('300ms', [
        animate('.6s ease-in', keyframes([
          style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
          style({opacity: .5, transform: 'translateY(35px)', offset: .3}),
          style({opacity: 1, transform: 'translateY(0)', offset: 1}),
        ]))
      ]), {optional: true}),

      query(':leave', stagger('300ms', [
        animate('.6s ease-in', keyframes([
          style({opacity: 1, transform: 'translateY(0)', offset: 0}),
          style({opacity: .5, transform: 'translateY(35px)', offset: .3}),
          style({opacity: 0, transform: 'translateY(-75%)', offset: 1}),
        ]))
      ]), {optional: true}),
    ])
  ]);
