### Introduction
This's a sub application of cc project, used for self-check-in on desktop and mobile.
It's deployed separately, used to get event by deep-link url.


### How to run
* For local test use this domain name `rdy-beta.dl.campusapp.com` instead of `localhost`. for this you should update your local  hosts file using `vim /etc/hosts`
* From the root path of the project use :
`ng serve --port 3034 --disable-host-check --host 0.0.0.0 cc-check-in`

### To generate delivery package
Use : `npm run build:cc-check-in`
