* [x] Improve Test performance
* [x] Build AOT
* [x] Upgrade webpack (done by the CLI now)
* [x] Create `cp-card` component
* [x] Create Layout components

* Refactor Events: (Andres)

  > Avoid using isService, isClubs... instead create real container routes using smaller components

  * [] Refactor Action Box
  * [] Split events list (upcoming/past) to separate components
  * [] Split events info to smaller components (this could event be shared with other resources)
  * [] Create an Event Form component
  * [] Move Attendnace out of event and treat as an add-on that could be added to amny resource

* Refactor Members (Andres):

  > Similar to Events avoid passing `isXXX` inputs

- Set up `nrwl nx` (Andres)

  > This will change the app strcuture a bit creating an new directories `apps`, `libs`, etc, it helps us create more resuable libraries, since it does all the heavy lifting for us, and will allow us to shared all our UI components in new apps if we ever need to in the future

- Remove bootstrap and jQuery

  > This will also get rid off jQuery, Popper.js, making the oferall bundle size much smaller, i think we will continue using the Bootstrap grid system and maybe the typography for now, but everything else we should be able to create ourselves. I already started a project using the angular CDK to do all of these components

  * [] Create custom modal
  * [] Create custom tooltip
  * [] Create custom popover
  * [] Create custom dropdown

* Split `shared` into smaller modules

  > The shared directory is getting pretty long, especially the components section, i think we can split things up and group them into smaller components that we could then import wherever we need to

* Look into typescript mixins to reuse common logic (pagination, snackbar) (Patrick)

* Refactor `cp-button`

  > cp-button should work like the [material](https://github.com/angular/material2/blob/master/src/lib/button/button.ts) one, its selector should be a button an we just pass down the button type (primary, secondary...) and the text should not be passed as Input, all buttons in the app or anchor tags should use this component

* Create a theme provider component

* Remove `api.enviornment` and use angular's environment file instead

* Fix test Warnigns (either missing inputs, or failing to call fixture.detectChanges, when updating values, a few routing minor routing warnings):

  * [ ] ProvidersListComponent
  * [ ] EventCreateComponent
  * [ ] EventAttendanceComponent
  * [ ] ClubsMembersComponent
  * [ ] DashboardTopResourceTitleComponent

* Fix module imports to not interfere with routes based on import order
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
