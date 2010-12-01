var sys = require("sys"),
http = require("http"),
fu = require("./fu");
var couchdb = require("./node-couch").CouchDB.db("jsconf");

function isblank(str) {
    if (!str) {
        return true;
    } 
		try	 {
	    return (str.replace(/^\s+|\s+$/, '') === "");
		} catch (e) {
			
			return false;
		}
}

function valid_params(name, title, description, email) {
  
}

function save_failed(data) {
	doc = {"category": "failed_speaker", "data": data, "created_at": (new Date())}
	couchdb.saveDoc(doc);
}	

fu.post("/app/schedule", function(req, res) {
  var data = "";
  req.addListener("body", function(chunk) {
    data += chunk;
  });
  req.addListener("complete", function() {
    var params = {};
    var worked = false;
    var parts = data.split("&");
    for (var i in parts) {
      var part = parts[i].split("=");
      if (part.length == 2) {
        params[new String(part[0])] = part[1];
      }
    }
    var day = null;
    var time = null;
    if (params["day"] == "sat") {
      day = "sat";
    } else if (params["day"] == "sun") { 
      day = "sun"; 
    }
    if (day == "sat" && params["time"] >= 1 && params["time"] <= 14)  {
      time = params["time"];
    } else if (day == "sun" && params["time"] >= 1 && params["time"] <= 17) {
      time = params["time"];
    }
    if (day && time && valid_params(name, title, description, email)) {
      var trackb = couchdb.get("TRACKB");
      if (trackb[day][time-1] === null) {
        trackb[day][time-1] = {"name": name, "title": title, "description": description, "email": email};
        couchdb.saveDoc(trackb);
        worked = true;
      }
    }
    if (!worked) {
      "Try again bucko!"
    } else { 
      "That's how the Davey Jones likes it."
    }
  });
});


fu.listen(8000, 'localhost');