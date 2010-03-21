http: require("http")
couchdb: require("node-couch").CouchDB
couchdb.debug: false
jsconf: couchdb.db("jsconf")

TRACK_NAME: "TRACKB"
# day: num_of_timeslots
DAYS: { "sat": 14, "sun": 16 }

EMAIL_ADDRESSES: []

#load valid email addresses

jsconf.openDoc("ATTENDEES", {
  success: (doc) ->
    EMAIL_ADDRESSES.push(addr) for addr in doc.emails
  })


# Test for document existence and setup if not already setup.
opts: {
  error: (body) ->
    doc: {"_id": TRACK_NAME}
    for day, timeslots of DAYS
      doc[day]: []
      i: 0
      while i < timeslots
       doc[day].push null
       i++
    jsconf.saveDoc(doc)
}
test_doc: jsconf.openDoc(TRACK_NAME, opts)


clean: (val) ->
  val.replace(/[^a-zA-Z0-9\(\)@ \.\-\n]/g, "")

# Handle 404s with as little information as possible
NOT_FOUND: "END OF LINE."
notFound: (req,res) ->
  puts req.url
  res.writeHead 404, [ ["Content-Type", "text/plain"], ["Content-Length", NOT_FOUND.length] ]
  res.write NOT_FOUND
  res.close()

# Simple blank test
isblank: (str) ->
  return true if not str?
  try
    return (str.replace(/^\s+|\s+$/, '') is "")
  catch error
    return false



valid_params: (name, title, description, email, av_confirm) ->
  return false if isblank(name) or name.length < 2
  return false if isblank(title) or title.length < 2
  return false if isblank(description) or description.length < 2
  return false if isblank(email) or not email.match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/) or EMAIL_ADDRESSES.indexOf(email) < 0
  return false unless av_confirm is "1"
  return true

schedule: (data, callback) ->
  puts "-----------------------"
  params: {}
  worked: false
  # parse request
  parts: data.split("&")
  for i in parts
    part: i.split("=")
    if part.length is 2
      str: decodeURIComponent(new String(part[0])).replace(/\+/g,  " ")
      val: decodeURIComponent(new String(part[1])).replace(/\+/g,  " ")
      puts str+": " + part[1]
      params[str]: val

  #extra request data
  name:  clean(params["name"] || "")
  title:  clean(params["title"] || "")
  description: clean(params["description"] || "")
  email: clean(params["email"] || "")
  av_confirm: clean(params["av_confirm"] || "")

  # identify the requested timeslot
  day: null
  slots: DAYS[params["day"]]
  timeslot: null
  if slots? && (0 <= params["time"] < (slots))
    timeslot: params["time"]
  if timeslot? and valid_params(name, title, description, email, av_confirm)
    day: params["day"]
    sched_req: {"_id": "TRACKB_"+day+"_"+timeslot, "name": name, "title": title, "description": description, "email": email}

    # Save doc first to ensure no race conditions.
    jsconf.saveDoc(sched_req, {
      success: (doc) ->
        jsconf.openDoc("TRACKB", {
          success: (doc) ->
            doc[day][timeslot]: {"name": name, "title": title, "description": description, "email": email}
            jsconf.saveDoc(doc)
            puts "Result: Scheduled"
            callback("saved")
          error: (result) ->
            puts "Result: Collision"
            callback("taken")
        })
      error: (result) ->
        puts "Result: Collision"
        callback("taken")
    })
  else
    puts "Result: Mutiny"
    callback("invalid")





getMap: {
  "/app/schedule": (req, res) ->
    jsconf.openDoc("TRACKB", {success: (body) -> res.simpleJSON(200, body)})
}

postMap: {
  "/app/schedule": (req, res) ->
    data: ""
    callback: (state)->
      if (state is "saved")
        res.simpleJSON(201, "Thank you for your Track B Submission!")
      else if (state is "invalid")
        res.simpleJSON(422, "You will never get on the ship's manifest with a submission like that!")
      else
        res.simpleJSON(422, "How's about picking an available timeslot?")
    req.addListener("data", (chunk) -> data += chunk )
    req.addListener("end", () -> schedule(data, callback))

}


http.createServer( (req,res) ->
  map: getMap
  map: postMap if (req.method is "POST")
  handler: map[req.url] || notFound

  res.simpleJSON: (code, obj) ->
    body: JSON.stringify(obj)
    res.writeHead code, [ ["Content-Type", "text/json"], ["Content-Length", body.length] ]
    res.write(body)
    res.close()
  handler req, res
).listen 8000
puts "Now Accepting Registrations"
