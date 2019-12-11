Main concerns

Performance (Initial Page Load, Time to Interactive, Time to navigate between pages, slow API request)
Tests (Check coverage report for features with low coverage and write better tests)
Refactor Code (Not all features in the app are coded correclty, we all know some feature that has a funny code, lets fix those)

- Serch for all scss `@import` statements and refactor them into seprate components

- Remove bootstrap and jQuery

  > This will also get rid off jQuery, Popper.js, making the overall bundle size much smaller, i think we will continue using the Bootstrap grid system and maybe the typography for now, but everything else we should be able to create ourselves. I already started a project using the angular CDK to do all of these components

  - [] Create custom modal
  - [] Create custom tooltip
  - [] Create custom popover
  - [] Create custom dropdown

- Split `shared` into smaller modules, consider moving some of our UI components, core classes into separate NG libraries

  > The shared directory is getting pretty long, especially the components section, i think we can split things up and group them into smaller components that we could then import wherever we need to

- Refactor `cp-button`

  > cp-button should work like the [material](https://github.com/angular/material2/blob/master/src/lib/button/button.ts) one, its selector should be a button an we just pass down the button type (primary, secondary...) and the text should not be passed as Input, all buttons in the app or anchor tags should use this component

- Fix module imports to not interfere with routes based on import order
  This applies to any module that has routes imported. Sometimes we need to import a module to reference its components/services and we also import the routes. If we import this additional module before the routing module, the new module's routes take precedence:

  Need to fix in following Module

  > services.module.ts
  > events.module.ts
  > dining.module.ts

  Inside ModuleA

  > imports: [\
  >
  > > ModuleB, // here ModuleB's routes get imported first\
  > >  ModuleARouting\
  > > ]

- Refactor `cp-dropdown`

  - Number of input attributes in the items is expanding
  - We can refactor this into `cp-dropdown` and `cp-dropdown-item` which will render the element in `<ng-content>`

- Update CI to run tests on each push (?)

- Update CI to run lint project on each MR
