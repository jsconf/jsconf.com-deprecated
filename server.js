HOST = null; // localhost
PORT = 8001;


var fu = require("./fu");
var sys = require("sys");

fu.get("/", fu.staticHandler("index.html"));
fu.get("/css/jsconf.css", fu.staticHandler("css/jsconf.css"));
fu.get("/js/jsconf.js", fu.staticHandler("js/jsconf.raw.js"));
fu.get("/js/mustache.js", fu.staticHandler("js/mustache.js"));
fu.post("/register_speaker", function (req, res) {
    res.simpleJSON(200, { response: "ok" });
  });

fu.listen(PORT, HOST);