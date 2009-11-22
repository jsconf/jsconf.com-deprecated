var sys = require("sys"),
http = require("http"),
fu = require("./fu");
var couchdb = require("./node-couch").CouchDB.db("jsconf");

function isblank(str) {
    if (!str) {
        return true;
    } 
    return (str.replace(/^\s+|\s+$/, '') === "");
}

fu.post("/register_speaker", function (req, res) {
    var data = "";
    req.addListener("body", function(chunk) {
        data += chunk;
    });
    req.addListener("complete", function() {
        try {
            var reg_data = JSON.parse(data);
            reg_data.category="speaker";
            if (isblank(reg_data.name) || isblank(reg_data.twitter) || isblank(reg_data.email) || isblank(reg_data.location) || isblank(reg_data.topic_title) || isblank(reg_data.topic_description) || isblank(reg_data.claim_to_fame)) {
                res.simpleJSON(400, { message: "If you follow the directions, there will be cake." });
            } else {
                couchdb.saveDoc(reg_data, {success: function(doc) {
                    res.simpleJSON(201, { response: "ok" });
                }, error: function(result) {
                    res.simpleJSON(400, { message: "MUTINY WILL NOT BE TOLERATED!!!" });  
                }});
            }
        } catch (e) {
            res.simpleJSON(400, { message: "MUTINY WILL NOT BE TOLERATED!!!" });      
        }
    });
});

fu.listen(8000, 'localhost');