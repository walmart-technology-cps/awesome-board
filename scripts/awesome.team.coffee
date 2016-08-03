module.exports = (robot) ->

  $baseurl = process.env.AWESOME_API_URL || "http://localhost:"+process.env.PORT

  robot.hear /give me all the teams/i, (msg) ->
    msg.http($baseurl+"/teams")
    .get() (err, res, body) ->
      for c in JSON.parse body
        msg.send c.name

  robot.hear /add team (.*)/i, (msg) ->
    data = JSON.stringify({
      name: msg.match[1]
    })
    msg.http($baseurl+"/teams")
    .header('Content-Type', 'application/json')
    .post(data) (err, res, body) ->
      msg.send "Team Added!"
