JSConf.us
=========

This is the source code for the crazy JSConf website. It has been crafted with love and fueled by too many drunken ideas. For the expected view, be sure to checkout one of the following depending on your fancy:

 * [JSConf 2009 Site]("http://wwww.jsconf.us/2009")
 * [JSConf 2010 Site]("http://wwww.jsconf.us/2010")
 * [JSConf 2010 JavaScript Site]("http://wwww.jsconf.us/2010.js") _hint: view the source_


A Coffee Mustache on Node While Sitting on the Couch
----------------------------------------------------
Call it an abuse of technology or a bastardization of all things good, we like to call it eating our own dogfood. JavaScript, client side and server side, is here to stay and it is beautiful. The code that runs the moving parts of the JSConf website is built with pure 100% JavaScript using any of the above listed technologies. Anything that can be made static has, and anything that can't has been made with JavaScript. Examples of use:
 
 * Request for Speaker Submissions (see /server.js)
 * Track B timeslot signup (see /trackb.coffee)
 * Blog and Tweet feeds are all done client side which is wrapped up using Mustache and Google Feeds API in public/2010/javascripts

Our only hope by putting the source code out there is that we don't mess up too many kids - we would like to save that task for the actual conference.