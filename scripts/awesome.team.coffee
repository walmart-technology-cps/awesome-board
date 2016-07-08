module.exports = (robot) ->

  robot.hear /give me all the teams/i, (msg) ->
    msg.http("http://localhost:3000/teams")
    .get() (err, res, body) ->
      for c in JSON.parse body
        msg.send c.name

  robot.hear /add team (.*)/i, (msg) ->
    data = JSON.stringify({
      name: msg.match[1]
    })
    msg.http("http://localhost:3000/teams")
    .header('Content-Type', 'application/json')
    .post(data) (err, res, body) ->
      msg.send "Team Added!"
