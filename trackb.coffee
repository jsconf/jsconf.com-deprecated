http: require("http")


NOT_FOUND: "END OF LINE."
notFound: (req,res) ->
  res.writeHead 404, [ ["Content-Type", "text/plain"], ["Content-Length", NOT_FOUND.length] ]
  res.write NOT_FOUND;
  res.close();



isblank: (str) ->
  return true if not str? 
  try 
    return (str.replace(/^\s+|\s+$/, '') === "");
  catch error
    return false;


getMap: {
  "/app/schedule": (req, res) ->
    trackb: couchdb.get("TRACKB")
}

postMap: {
  "/app/schedule": (req, res) ->
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
}


http.createServer( (req,res) ->
  map: getMap
  map: postMap if (req.method ==="POST")
  handler: map[req.uri.path] || notFound

  res.simpleJSON: (code, obj) ->
    body: JSON.stringify(obj)
    res.writeHead code, [ ["Content-Type", "text/json"], ["Content-Length", body.length] ]
    res.write(body);
    res.close();
  };

  handler req, res
).listen 8000
puts "Server running"