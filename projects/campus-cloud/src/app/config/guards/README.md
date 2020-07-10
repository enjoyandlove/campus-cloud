## Top level NG guards

- `auth.guard`

  The main guard in the application, checks that the user has a token stored in their local storage, and that the CPSession object is filled with data. In the case the user has no token, they are redirected to the login page, if the CPSession object is empty we make a few requests to populate it before letting the continue navigating the application.

- `privilege.guard`

  Ensures the user has the right privileges to view the page, the right privilege is defined in the `Route`’s  `data`  key of every route
