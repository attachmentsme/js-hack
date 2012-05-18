JSHack
========

JS Hack was built by myself ([bcoe](https://github.com/bcoe)), [jessemiller](https://github.com/jessemiller), and [dreed1](https://github.com/dreed1) during one of our hack days at [Attachments.me](http://attachments.me).

JSHack is a multiplayer game that tests your real-world JavaScript skills:

* It runs a full-featured JavaScript interpreter in a sandboxed environment.
* It's in Node.js using the Express framework.
* User accounts are handled via [everyauth](https://github.com/bnoguchi/everyauth/)

You can see it running here: https://attachments.me/hirehack/public/computer.html

It's Open Source!
-----------------

I don't have time to maintain or update this game, so I've decided to make it open source.

I'd love to see what kinds of other challenges and features people come up with.

Dependencies
-----------

* MongoDB.
* Node.js >= 0.6.0
* npm >= 1.1.21

Installation
-------------
If you just want to try things out:

* npm install js-hack -g
* run _js-hack -g_ to generate the public files.
* run _js-hack -p_ to populate the MongoDB database.
* edit __~/js-hack/environment.py_ and add the appropriate paths and credentials.
* run _js-Hack -s_ to start the js-hack server.

By default the game will be hosted at from _0.0.0.0:9000/js-hack/public/computer.html_ you will need to set things up on an actual domain to get everyauth working properly.

Testing
-------

JSHack uses [micro-test](https://github.com/bcoe/node-micro-test) for unit testing.

* checkout the project.
* run _npm install micro-test -g_
* run _micro-test_ in the project folder.

Copyright
---------

Copyright (c) 2011 Attachments.me. See LICENSE.txt for further details.