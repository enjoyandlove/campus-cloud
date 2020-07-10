- `CPSession`

  Is an injectable service which holds the `schools` the user has access to, the current `school` the user is logged in as and `user` the current admin the user is logged in as. It is provided in the main `app.module`  hence its a Singleton service, all other modules (including lazy ones) are able to inject this service.

  Thanks to the `auth.guard`, `CPSession` is guaranteed to be filled with data if the user is logged in.
