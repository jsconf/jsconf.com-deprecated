http: require("http")
couchdb: require("node-couch").CouchDB
couchdb.debug: false
jsconf: couchdb.db("jsconf")

TRACK_A = {
  sat: [
    {begin: "9:00", end: "9:45", name: "Douglas Crockford", title: "Really, JavaScript?"},
    {begin: "9:45", end: "10:00", name: "Michael Erlewine", title: "Mozilla's JetPack"},
    {begin: "10:00", end: "10:45", name: "Ben Galbraith, Dion Almaer, Matt McNulty", title: "Solving Device Fragmentation: How Do You Support 12,320 Different Mobile Platforms?"},
    {begin: "10:45", end: "11:00", name: "Break", type: "break"},
    {begin: "11:00", end: "11:45", name: "Francisco Tolmasky", title: "Socratic: Documentation Done Right"},
    {begin: "11:45", end: "12:30", name: "Jenn Lukas", title: "JavaScript and Web Standards Sitting in a Tree"},
    {begin: "12:30", end: "13:30", name: "Mozilla's YayQuery Lunch Special", type: "break"},
    {begin: "13:30", end: "14:15", name: "Ryan Dahl", title: "Less is More in Node.js"},
    {begin: "14:15", end: "15:00", name: "Tobias Schneider", title: "Flash is dead, long live Flash!"},
    {begin: "15:00", end: "15:15", name: "Snack Break", type: "break"},
    {begin: "15:15", end: "16:00", name: "Aaron Newton", title: "Programming To Patterns"},
    {begin: "16:00", end: "16:30", name: "Tom Hughes-Croucher", title: "Piratin' the YQL way"},
    {begin: "16:30", end: "17:15", name: "Aaron Quint", title: "The front-end takeover or how to use Sammy.js to stop writing server side code"}
  ],
  "sun": [
    {begin: "9:00", end: "9:45", name: "Charles Jolley", title: "SproutCore 1.1: Even Faster HTML5 Apps (in less time)"},
    {begin: "9:45", end: "10:30", name: "Dmitry Baranovskiy", title: "Raphaël the Great"},
    {begin: "10:30", end: "11:00", name: "CommonJS Panel Discussion", title: "JavaScript Outside of the Browser - Where it is and where it's going!"},
    {begin: "11:00", end: "11:45", name: "Makinde Adeagbo", title: "Primer: Facebook's 2k of JavaScript to power (almost) all interactions"},
    {begin: "11:45", end: "12:30", name: "John-David Dalton", title: "All you can leet - Coding for performance, CSS engines, and sandboxed natives"},
    {begin: "12:30", end: "13:30", name: "Mozilla's Red Plate Lunch Special", type: "break", title: "Relax, Recover, Refuel!"},
    {begin: "13:30", end: "14:15", name: "Felix Geisendoerfer", title: "Dirty NoSQL"},
    {begin: "14:15", end: "14:45", name: "Jupiter Consulting", title: "Enterprise JavaScript"},
    {begin: "14:45", end: "15:30", name: "Steve Souders", title: "The Best Of Steve"},
    {begin: "15:30", end: "16:15", name: "ScurvyConf Master", title: "The crowd favorite from ScurvyConf"},
    {begin: "16:15", end: "16:30", name: "Snack Break", type: "break", title: "Activating Caffeine Powers!"},
    {begin: "16:30", end: "17:15", name: "Billy Hoffman", title: "JavaScript's Evil Side"},
    {begin: "17:15", end: "18:00", name: "Brendan Eich", title: "An Introduction to JavaScript"},
    {begin: "18:00", end: "18:45", name: "Alex Russell", title: "Google Chrome Frame"}
  ]
}



TRACK_B_SATURDAY = [
  {begin: "9:00", end: "9:30"},
  {begin: "9:30", end: "10:00"},
  {begin: "10:00", end: "10:30"},
  {begin: "10:30", end: "11:00"},
  {begin: "11:00", end: "11:30"},
  {begin: "11:30", end: "12:00"},
  {begin: "12:00", end: "12:30"},
  {begin: "13:30", end: "14:00"},
  {begin: "14:00", end: "14:30"},
  {begin: "14:30", end: "15:00"},
  {begin: "15:15", end: "15:45"},
  {begin: "15:45", end: "16:15"},
  {begin: "16:15", end: "16:45"},
  {begin: "16:45", end: "17:15"}
]


TRACK_B_SUNDAY = [
  {begin: "9:00", end: "9:30"},
  {begin: "9:30", end: "10:00"},
  {begin: "10:00", end: "10:30"},
  {begin: "10:30", end: "11:00"},
  {begin: "11:00", end: "11:30"},
  {begin: "11:30", end: "12:00"},
  {begin: "12:00", end: "12:30"},
  {begin: "13:30", end: "14:00"},
  {begin: "14:00", end: "14:30"},
  {begin: "14:30", end: "15:00"},
  {begin: "15:00", end: "15:30"},
  {begin: "15:30", end: "16:00"},
  {begin: "16:00", end: "16:30"},
  {begin: "17:00", end: "17:30"},
  {begin: "17:30", end: "18:00"},
  {begin: "18:00", end: "18:30"}
]

# day: num_of_timeslots
DAYS: {sat: TRACK_B_SATURDAY.length, sun: TRACK_B_SUNDAY.length }

EMAIL_ADDRESSES: []

#load valid email addresses

jsconf.openDoc("ATTENDEES", {
  success: (doc) ->
    EMAIL_ADDRESSES.push(addr) for addr in doc.emails
})

# Test for document existence and setup if not already setup.
opts: {
  error: (body) ->
    doc: {_id: "SCHEDULE"}
    trackb: {}
    doc.TRACK_A: TRACK_A
    doc.TRACK_B: {sat: TRACK_B_SATURDAY, sun: TRACK_B_SUNDAY}
    jsconf.saveDoc(doc)
}
test_doc: jsconf.openDoc("SCHEDULE", opts)

clean: (val) ->
  val.replace(/[^a-zA-Z0-9\(\)@ \.\-\n]/g, "")

# Handle 404s with as little information as possible
NOT_FOUND: "END OF LINE."
notFound: (req,res) ->
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
  errors: []
  errors.push("A real name, or else!") if isblank(name) or name.length < 2
  errors.push("Give us a punchy title.") if isblank(title) or title.length < 2
  errors.push("Ok a valid description would be great.") if isblank(description) or description.length < 2
  errors.push("Email must be the same as what you provided when registering.")if isblank(email) or not email.match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/) or EMAIL_ADDRESSES.indexOf(email) < 0
  errors.push("You have to let us make you famous.") unless av_confirm is "1"
  return errors

schedule: (data, callback) ->
  puts "-----------------------"
  params: {}
  worked: false
  # parse request
  for i in data.split("&")
    part: i.split("=")
    if part.length is 2
      str: decodeURIComponent(part[0]).replace(/\+/g,  " ")
      val: decodeURIComponent(part[1]).replace(/\+/g,  " ")
      puts str + ": " + part[1]
      params[str]: val
  #extra request data
  name:  clean(params.name || "")
  title:  clean(params.title || "")
  description: clean(params.description || "")
  email: clean(params.email || "")
  av_confirm: clean(params.av_confirm || "")
  # identify the requested timeslot
  day: null
  slots: DAYS[params.day]
  timeslot: null
  if slots? && (0 <= params.time < (slots))
    timeslot: params.time
  errors: valid_params(name, title, description, email, av_confirm)
  if timeslot? and errors.length == 0
    day: params.day
    sched_req: {_id: "TRACKB_" + day + "_" + timeslot, name: name, title: title, description: description, email: email}
    # Save doc first to ensure no race conditions.
    puts day
    merge_doc: (scheduled_doc) ->
      jsconf.openDoc("SCHEDULE", {
        success: (doc) ->
          idx: parseInt(timeslot)
          obj: doc.TRACK_B[day][idx]
          obj.name: name
          obj.description: description
          obj.title: title
          doc.TRACK_B[day][idx]: obj
          jsconf.saveDoc(doc)
          puts "Result: Scheduled"
          callback("saved")
      })
    jsconf.saveDoc(sched_req, {
      success: merge_doc
      error: (result) ->
        puts "Result: Collision"
        callback("taken")
    })
  else
    puts "Result: Mutiny"
    callback("invalid", errors)

getMap: {
  "/app/schedule": (req, res) ->
    jsconf.openDoc("SCHEDULE", {
      success: (body) ->
        trackb: body.TRACK_B
        sat: trackb.sat
        sun: trackb.sun
        sat: sat.slice(0, 6).concat([{begin: "12:30", end: "13:30", name: "Mozilla's YayQuery Lunch Spectacular", type: "break"}]).concat(sat.slice(6, 9)).concat([{begin: "15:00", end: "15:15", name: "Snack Break", type: "break"}]).concat(sat.slice(9, -1))
        sun: sat.slice(0, 6).concat([{begin: "12:30", end: "13:30", name: "CommonJS Lunch Forum", type: "break"}]).concat(sat.slice(6, 12)).concat([{begin: "16:30", end: "17:00", name: "Snack Break", type: "break"}]).concat(sat.slice(12, -1))
        trackb.sat: sat
        trackb.sun: sun
        res.simpleJSON(200, body)
    })
}

postMap: {
  "/app/schedule": (req, res) ->
    data: ""
    callback: (state, opts)->
      puts state
      # res.simpleJSON(422, {msg: "Sign Up Begins April 1, 2010", data: opts})
      if (state is "saved")
        res.simpleJSON(201, {msg: "Thank you for your Track B Submission!" } )
      else if (state is "invalid")
        res.simpleJSON(422, {msg: "You will never get on the ship's manifest with a submission like that!", data: opts} )
      else
        res.simpleJSON(422, {msg: "How's about picking an available timeslot?" } )
    req.addListener("data", (chunk) -> data += chunk )
    req.addListener("end", () ->  schedule(data, callback))
}

http.createServer( (req,res) ->
  map: getMap
  map: postMap if (req.method is "POST")
  handler: map[req.url] || notFound
  res.simpleJSON: (code, obj) ->
    body: JSON.stringify(obj)
    res.writeHead code, [ ["Content-Type", "application/json"], ["Content-Length", body.length] ]
    res.write(body)
    res.close()
  handler req, res
).listen 8000

puts "Now Accepting Registrations"
