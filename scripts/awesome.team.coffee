module.exports = (robot) ->

  $baseurl = process.env.AWESOME_API_URL || "http://localhost:"+process.env.PORT

  youre_awesome = [
    "http://who-is-awesome.com/who-is-awesome.jpg",
    "http://9buz.com/content/uploads/images/October2014/You_there_Yes_you_Youre_awesome_9buz.jpg",
    "http://www.desicomments.com/wp-content/uploads/Youre-Awesome-Image.jpg",
    "https://cdn.meme.am/instances/500x/54941232.jpg",
    "https://sheerepiphany.files.wordpress.com/2015/04/a.jpg",
    "http://i.imgur.com/aimsF.jpg"
  ]


  robot.hear /who(’|'| i)s awesome/i, (msg) ->
    msg.reply msg.random youre_awesome

  robot.hear /(list|all|give me|show me) the teams/i, (msg) ->
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

  robot.hear /make (.*) our team/i, (msg) ->
    exists = false
    if robot.brain.team is undefined
      robot.brain.team = {}
    msg.http($baseurl+"/teams")
    .get() (err, res, body) ->
      for team in JSON.parse body
        if team.name.toUpperCase() == msg.match[1].toUpperCase()
          robot.brain.team = team
          exists = true
          msg.reply "Okay, your team name is '"+team.name+"'"
          break
      if exists != true
        msg.reply "I'm sorry, that team does not yet exist yet."

  robot.hear /what(’|'| i)s (our|my) team/i, (msg) ->
    if robot.brain.team is undefined
      msg.reply "I don't know!!!"
    else
      msg.reply "Your team name is '" + robot.brain.team.name + "'"

  robot.hear /(list|all|give me|show me) the boards/i, (msg) ->
    if robot.brain.team is undefined
      msg.reply "You haven't picked a team yet!"
    else
      msg.http($baseurl+"/teams/"+robot.brain.team._id+"/boards")
      .get() (err, res, body) ->
        for board in JSON.parse body
          msg.send board.name

  robot.hear /add board (.*)/i, (msg) ->
    if robot.brain.team is undefined
      msg.reply "You haven't picked a team yet!"
    data = JSON.stringify({
      name: msg.match[1]
    })
    msg.http($baseurl+"/teams/"+robot.brain.team._id+"/boards")
    .header('Content-Type', 'application/json')
    .post(data) (err, res, body) ->
      msg.send "Board Added!"

  robot.hear /make (.*) our board/i, (msg) ->
    if robot.brain.team is undefined
      msg.reply "You haven't picked a team yet!"
      exit
    exists = false
    if robot.brain.board is undefined
      robot.brain.board = {}
    msg.http($baseurl+"/teams/"+robot.brain.team._id+"/boards")
    .get() (err, res, body) ->
      for board in JSON.parse body
        if board.name.toUpperCase() == msg.match[1].toUpperCase()
          robot.brain.board = board
          exists = true
          msg.reply "Okay, your board name is '" + board.name + "'"
          break
      if exists != true
        msg.reply "I'm sorry, that board does not exist yet."

  robot.hear /what(’|'| i)s (our|my) board/i, (msg) ->
    if robot.brain.board is undefined
      msg.reply "I don't know!!!"
    else
      msg.reply "Your board name is '" + robot.brain.board.name + "'"
