import {trigger,state,style, animate, transition, stagger, keyframes, query} from "@angular/animations";


export const flyInOut = trigger("flyInOut", [
    state("in", style({ transform: "translateX(0)" })),
    transition("void => *", [
      style({ transform: "translateX(100%)" }),
      animate(100)
    ]),
    transition("* => void", [
      animate(100, style({ transform: "translateX(100%)" }))
    ])
])