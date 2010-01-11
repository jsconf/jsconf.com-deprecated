
var jsconf = (function () {
  var templates = {
    call_for_speakers: "<div id='callforspeakers'><h1>ARRR!! All Rascals, Scoundrels, Villains, and Knaves</h1>\
    <p>We are bringing together the top minds in JavaScript for a truly memorable and mindblowing time. Do you have a great \
    product, project, or concept in JavaScript that you think the world needs to see? JSConf is the launching point for \
    everything JavaScript in 2010 and beyond; at least until JSConf EU. The JSConf team has made a firm commitment to making \
    it the best technology conference out there, so we need the best damn speakers around, speakers like you.</p><p>In the speaker \
    proposal, we are looking for a description of your topic and why it's better than writing documentation. We give extra credit for \
    presentations that challenge the status quo, stir up emotions within the crowd, and are banned in at least 3 states. JavaScript \
    should be the focus, but should not be a limiter, so go ahead and submit your dissertation on unicorns. Examples of \
    presentations from JSConf 2009 can be found at the <a href='http://www.jsconf2009.com'>JSConf 2009 website</a>.</p>\
    <p>You get one shot at this, so don't mess it up. We need from you a JSON encoded submission of your proposal with the \
    following attributes at a minimum. Malformed submissions will be laughed at.</p>\
    <ul><li>name</li><li>email</li><li>twitter</li><li>location</li><li>topic_title</li><li>topic_description</li><li>claim_to_fame</li></ul>\
    <h3>Make Some Magic...</h3><form action='/app/register_speaker' method='POST' id='regform'>\
    <textarea style='width:100%; height:200px;' name='submission'></textarea>\
    <div class='submit'><input type='submit' value='Abracadabra!'/></div>\
    </form>\
    </div>"
  };

  return {
      help: function() {
          console.log("Welcome to JSConf 2010 - The JavaScript Conference");
          console.log("");
          console.log("Available Commands:");
          console.log("--------------------------------------------------");
          console.log("jsconf.about()");
          console.log("jsconf.call_for_speakers()");
          console.log("jsconf.locate()");
          console.log("jsconf.register()");
          console.log("jsconf.videos(US|EU)");
          console.log("jsconf.wtf()");
          console.log("--------------------------------------------------");
          
      },
    
      about: function() {
          console.log("Requesting data from the MPC...");
          console.log("If you have to ask, you shouldn't be here.")
          console.log("End of Line...");
      },
      call_for_speakers: function() {
          console.log("ARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR MATEY!");
          dojo.byId("wrap").innerHTML = templates.call_for_speakers;
          dojo.connect(dojo.byId("regform"), 'onsubmit', function (e) { 
              e.preventDefault();
              dojo.xhrPost({
                  url: "/app/register_speaker",
                  form: "regform",
                  handleAs: "json",
                  handle: function(data,args)     {
                      if (data.name == "Error") {
                          alert(data.responseText);
                      } else {
                          alert("We got yer submission. ARR, we be gettin' back to you soon.");
                      }
                  },
                  failOk: true
              });
          });
      },
      videos: function(w) {
	  var url = (w == "EU" ? "http://jsconf.eu/2009" : "http://jsconf.us/2009");
	  window.location.href=url;
      },
      locate: function() {
          console.log("Washington, DC off the Starboard Side, Captain!");
      },
      wtf: function() {
	  console.log("It's fucking JSConf, did you expect anything less than pirates?");
      },
      register: function() {
	  window.location.href="http://guestlistapp.com/events/5574";
      }
  }
})();