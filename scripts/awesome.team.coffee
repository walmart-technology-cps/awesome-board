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

  robot.hear /make (.*) (my|our) team/i, (msg) ->
    exists = false
    if robot.brain.team is undefined
      robot.brain.team = []
    if robot.brain.team[msg.message.room] is undefined
      robot.brain.team[msg.message.room] = {}
    msg.http($baseurl+"/teams")
    .get() (err, res, body) ->
      for team in JSON.parse body
        if team.name.toUpperCase() == msg.match[1].toUpperCase()
          robot.brain.team[msg.message.room] = team
          exists = true
          msg.reply "Okay, your team name is '"+team.name+"'"
          break
      if exists != true
        msg.reply "I'm sorry, that team does not yet exist yet."

  robot.hear /what(’|'| i)s (our|my) team/i, (msg) ->
    if robot.brain.team is undefined or robot.brain.team[msg.message.room] is undefined
      msg.reply "I don't know!!!"
    else
      msg.reply "Your team name is '" + robot.brain.team[msg.message.room].name + "'"

  robot.hear /(list|all|give me|show me) the boards/i, (msg) ->
    if robot.brain.team is undefined or robot.brain.team[msg.message.room] is undefined
      msg.reply "You haven't picked a team yet!"
    else
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards")
      .get() (err, res, body) ->
        for board in JSON.parse body
          msg.send board.name

  robot.hear /add board (.*)/i, (msg) ->
    if robot.brain.team is undefined or robot.brain.team[msg.message.room] is undefined
      msg.reply "You haven't picked a team yet!"
    data = JSON.stringify({
      name: msg.match[1]
    })
    msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards")
    .header('Content-Type', 'application/json')
    .post(data) (err, res, body) ->
      msg.send "Board Added!"

  robot.hear /make (.*) (my|our) board/i, (msg) ->
    if robot.brain.team is undefined or robot.brain.team[msg.message.room] is undefined
      msg.reply "You haven't picked a team yet!"
    else
      exists = false
      if robot.brain.board is undefined
        robot.brain.board = []
      if robot.brain.board[msg.message.room] is undefined
        robot.brain.board[msg.message.room] = {}
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards")
      .get() (err, res, body) ->
        for board in JSON.parse body
          if board.name.toUpperCase() == msg.match[1].toUpperCase()
            robot.brain.board[msg.message.room] = board
            exists = true
            msg.reply "Okay, your board name is '" + board.name + "'"
            break
        if exists != true
          msg.reply "I'm sorry, that board does not exist yet."

  robot.hear /what(’|'| i)s (our|my) board/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I don't know!!!"
    else
      msg.reply "Your board name is '" + robot.brain.board[msg.message.room].name + "'"

  robot.hear /what(’|'| i)s (our|my) (.*) state/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I don't know!!! (you haven't set the board yet)"
    else
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/"+msg.match[3].toLowerCase()+"State")
      .get() (err, res, body) ->
        state = JSON.parse body
        msg.send state.description

  robot.hear /where are we now|where did we start/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I don't know!!! (you haven't set the board yet)"
    else
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/currentState")
      .get() (err, res, body) ->
        state = JSON.parse body
        msg.send state.description

  robot.hear /what(’|'| i)s (my|our) (target|goal)/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I don't know!!! (you haven't set the board yet)"
    else
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/targetState")
      .get() (err, res, body) ->
        state = JSON.parse body
        msg.send state.description

  robot.hear /what(’|'| i)s awesome|what does awesome look like/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I don't know!!! (you haven't set the board yet)"
    else
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/awesomeState")
      .get() (err, res, body) ->
        state = JSON.parse body
        msg.send state.description

  robot.respond /set (our|my) current state to (.*)/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      data = JSON.stringify({
        description: msg.match[2]
      })
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/currentState")
      .header('Content-Type', 'application/json')
      .put(data) (err, res, body) ->
        msg.send "Current State updated!"
        msg.send "'"+msg.match[2]+"'"

  robot.respond /set (our|my) target state to (.*)/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      data = JSON.stringify({
        description: msg.match[2]
      })
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/targetState")
      .header('Content-Type', 'application/json')
      .put(data) (err, res, body) ->
        msg.send "Current State updated!"
        msg.send "'"+msg.match[2]+"'"

  robot.respond /set (our|my) awesome state to (.*)/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      data = JSON.stringify({
        description: msg.match[2]
      })
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/awesomeState")
      .header('Content-Type', 'application/json')
      .put(data) (err, res, body) ->
        msg.send "Current State updated!"
        msg.send "'"+msg.match[2]+"'"

  robot.respond /define awesome as (.*)/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      data = JSON.stringify({
        description: msg.match[1]
      })
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/awesomeState")
      .header('Content-Type', 'application/json')
      .put(data) (err, res, body) ->
        msg.send "Current State updated!"
        msg.send "'"+msg.match[1]+"'"

  robot.respond /(Check it out!|Awesome!|Kudos!|Sweet!|Excellent!|Woohoo!|Achievement Unlocked!) (.*)/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      data = JSON.stringify({
        title: msg.match[1],
        description: msg.match[2]
      })
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/achievements")
      .header('Content-Type', 'application/json')
      .post(data) (err, res, body) ->
        msg.send "Achievement added!"
        msg.send "'"+msg.match[2]+"'"

  robot.hear /what (have we done|did we do|have we accomplished|are our achievements)/i, (msg) ->
    if robot.brain.board is undefined or robot.brain.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      msg.http($baseurl+"/teams/"+robot.brain.team[msg.message.room]._id+"/boards/"+robot.brain.board[msg.message.room]._id+"/achievements")
      .get() (err, res, body) ->
        msg.send "Here are our achievements so far:"
        for achievement in JSON.parse body
          msg.send achievement.description
