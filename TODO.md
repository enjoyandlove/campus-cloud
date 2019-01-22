* [x] Improve Test performance
* [x] Build AOT
* [x] Upgrade webpack (done by the CLI now)

- Refactor Events: (Andres)

  > Avoid using isService, isClubs... instead create real container routes using smaller components

  * [] Refactor Action Box
  * [] Split events list (upcoming/past) to separate components
  * [] Split events info to smaller components (this could event be shared with other resources)
  * [] Create an Event Form component
  * [] Move Attendnace out of event and treat as an add-on that could be added to amny resource

- Refactor Members:

  > Similar to Events avoid passing `isXXX` inputs

- Create Layout components

  > By now we have a good set of layouts used accross the app, full width (events list), two-columns (events create), one-third (login) three-quarters (events info), the idea is to have layout components that wrap the content inside with a <ng-content> so we reuse the css

- Set up `nrwl nx` (Andres)

  > This will change the app strcuture a bit creating an new directories `apps`, `libs`, etc, it helps us create more resuable libraries, since it does all the heavy lifting for us, and will allow us to shared all our UI components in new apps if we ever need to in the future

- Create `cp-card` component

  > Again to avoid importing the card styles and/or having to use the cpcard class everywhere, we could just create a component

- Remove bootstrap and jQuery

  > This will also get rid off jQuery, Popper.js, making the oferall bundle size much smaller, i think we will continue using the Bootstrap grid system and maybe the typography for now, but everything else we should be able to create ourselves. I already started a project using the angular CDK to do all of these components

  * [] Create custom modal
  * [] Create custom tooltip
  * [] Create custom popover
  * [] Create custom dropdown

- Split `shared` into smaller modules

  > The shared directory is getting pretty long, especially the components section, i think we can split things up and group them into smaller components that we could then import wherever we need to

- Look into typescript mixins to reuse common logic (pagination, snackbar)

- Refactor `cp-button`

  > cp-button should work like the [material](https://github.com/angular/material2/blob/master/src/lib/button/button.ts) one, its selector should be a button an we just pass down the button type (primary, secondary...) and the text should not be passed as Input, all buttons in the app or anchor tags should use this component

- Create a theme provider component
