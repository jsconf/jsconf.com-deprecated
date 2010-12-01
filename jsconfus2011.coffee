request = require("request")
connect = require("connect")
form = require("connect-form")
express = require("express")

COUCHDB_URL = (process.env.COUCHDB_URL || "http://localhost:5984/jsconfus2011")


app = express.createServer()
app.configure () ->
  app.use(express.bodyDecoder())
  form({ keepExtensions: true })
  app.use(express.staticProvider(__dirname + '/public/2011'))

app.get "/", (req, res) ->
  res.sendfile(__dirname + '/public/2011/index.html')

app.post "/speaker", (req, res) ->
  
  
app.listen(3000)