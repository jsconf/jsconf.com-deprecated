
var jsconf = (function () {
  var templates = {
    article: "<div class='article'><div class='title'>{{title}}</div><div class='body'>{{body}}</div><div class='more'>\
    <a href='javascript:jsconf.news(1)'>Previous</a> | <a href='javascript:jsconf.news(1)'>Next</a></div></div>",
    call_for_speakers: "<div id='callforspeakers'><h1>Calling all JavaScript Visionaries, Craftspeople, and Drunkards</h1>\
    <p>We are bringing together the top minds in JavaScript for a truly memorable and mindblowing time. Do you have a great \
    product, project, or concept in JavaScript that you think the world needs to see? JSConf is the launching point for \
    everything JavaScript in 2010 and beyond; at least until JSConf EU. The JSConf team has made a firm commitment to making \
    it the best technology conference out there, so we need the best damn speakers around, speakers like you.</p><p>In the speaker \
    proposal, we are looking for a description of your topic and why its better than writing documentation. We give extra credit for \
    presentations that challenge the status quo, stir up emotions within the crowd, and are banned in at least 3 states. JavaScript \
    should be the focus, but should not be a limiter, so go ahead and submit your dissertation on unicorns. Examples of \
    presentations from JSConf 2009 can be found at the <a href='http://www.jsconf2009.com'>JSConf 2009 website</a>.</p>\
    <p>You get one shot at this, so don't mess it up. We need from you a JSON encoded submission of your proposal with the \
    following attributes at a minimum. Malformed submissions will be laughed at.</p>\
    <ul><li>name</li><li>email</li><li>twitter</li><li>location</li><li>topic_title</li><li>topic_description</li><li>claim_to_fame</li></ul>\
    <h3>Make Some Magic...</h3><form action='register_speaker' method='POST'>\
    <textarea style='width:100%; height:200px;' name='submission'></textarea>\
    <div class='submit'><input type='submit' value='Abracadabra!'/></div>\
    </form>\
    </div>"
  };
  var current_news_index = 0;
  return {
    help: function() {
      console.log("Welcome to JSConf 2010 - The JavaScript Conference");
      console.log("");
      console.log("Available Commands:");
      console.log("--------------------------------------------------");
      console.log("jsconf.news()");
      console.log("jsconf.call_for_speakers()");
      console.log("jsconf.locate()");
      console.log("jsconf.register()");
      console.log("jsconf.videos(2009|global|all)");
      console.log("jsconf.wtf()");
      console.log("jsconf.mode(boss|my_little_pony|smb)");
      console.log("--------------------------------------------------");
      
    },
    
    news: function(spin) {
      if (spin) {
        current_news_index += spin; 
      }
    },
    about: function() {
      console.log("Requesting data from the MPC...");
      
      console.log("End of Line...");
    },
    call_for_speakers: function() {
      console.log("SSSSSSSSPPPPPPPPEEEEEEEEEAAAAAAAKKKKKKKKEEEEEEEEEERRRRRRRRRSSSSSSSS");
      dojo.byId("for").innerHTML = templates.call_for_speakers;
    },
    locate: function() {
      console.log("Washington, DC is all I can tell you for now.");
    }
  }
})();