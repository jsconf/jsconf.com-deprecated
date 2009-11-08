COUCHHOST = "localhost";
COUCHPORT = 5984;
HOST = "localhost"; // localhost
PORT = 8001;


var fu = require("./fu"),
  sys = require("sys"),
  http = require("http");

var COUCHDB = http.createClient(COUCHPORT, COUCHHOST);


function isblank(str) {
  if (!str) {
    return true;
  } 
  return (str.replace(/^\s+|\s+$/, '') === "");
}


fu.get("/", fu.staticHandler("index.html"));

fu.post("/speaker", function (req, res) {
    var data = "";
    req.addListener("body", function(chunk) {
      data += chunk;
    });
    req.addListener("complete", function() {
      sys.puts(data);
      try {
        var reg_data = JSON.parse(data);
        reg_data.category="speaker";
        if (isblank(reg_data.first_name) || isblank(reg_data.last_name) || isblank(reg_data.title) || isblank(reg_data.description)) {
          res.simpleJSON(400, { message: "If you follow the directions, there will be cake." });
        } else {
          var reg_data_str = JSON.stringify(reg_data);
          var store = COUCHDB.post("/jsconf", {"Content-Length": reg_data_str.length});
          store.sendBody(reg_data_str);
          store.finish(function (response) {
            sys.puts("STATUS: " + response.statusCode);
            sys.puts("HEADERS: " + JSON.stringify(response.headers));
            response.setBodyEncoding("utf8");
            var couchbody = "";
            response.addListener("body", function (chunk) {
              couchbody += chunk;
            });
            response.addListener("complete", function() {
              sys.puts("BODY: "+couchbody);
              res.simpleJSON(201, { response: "ok" });  
            });
          });
        }
      } catch (e) {
        res.simpleJSON(400, { message: "I said JSON, motherfucker." });      
      }
    });
  });

fu.listen(PORT, HOST);