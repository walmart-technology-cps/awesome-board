# Commands:
#   Who's Awesome? - Get a pic telling you who's awesome
#   Add team {teamname} - Adds a team with the name {teamname}
#   List the teams - Lists the available teams
#   Make {teamname} our team - Associates the requested team with the current channel
#   What's our team? - Provides the name of the team associated with the channel
#   Add board {boardname} - Adds a board to the team with the name {boardname} (requires a team be set for the channel)
#   List the boards - Lists the available boards for the team (requires a team be set for the channel)
#   Make {boardname} our board - Associates the requested board with the current channel (requires a team be set for the channel)
#   What's our board? - Provides the name of the board associated with the channel (requires a team be set for the channel)
#   What's our current/target/awesome state? - Provides the description for the requested state (requires a team and board be set for the channel)
#   Set our current/target/awesome state to {description} - Sets the description for the requested state (requires a team and board be set for the channel)
#   What are our achievements? - Lists the achievements on the board (requires a team and board be set for the channel)
#   @{awesomebotname} Awesome! {achievement} - Adds the provided achievement to the board (requires a team and board be set for the channel, must be addressing the bot to avoid accidental achievement creation)

module.exports = (robot) ->

  $baseurl = process.env.AWESOME_API_URL || "http://localhost:"+process.env.PORT
  CronJob = require('cron').CronJob

  youre_awesome = [
    "http://who-is-awesome.com/who-is-awesome.jpg",
    "http://9buz.com/content/uploads/images/October2014/You_there_Yes_you_Youre_awesome_9buz.jpg",
    "http://www.desicomments.com/wp-content/uploads/Youre-Awesome-Image.jpg",
    "https://cdn.meme.am/instances/500x/54941232.jpg",
    "https://sheerepiphany.files.wordpress.com/2015/04/a.jpg",
    "http://i.imgur.com/aimsF.jpg"
  ]

  achievementReminder = new CronJob '00 00 16 * * 5', ->
    for room, board of robot.brain.data._private.board
      robot.messageRoom room, "Hello " + robot.brain.data._private.team[room].name + "!"
      robot.messageRoom room, "Are there any achievements from the week that someone @here needs to add to your board '" + board.name + "'?"
  , null, true, 'America/New_York'

  robot.hear /what is the team's mood in the past (.*) days/i, (msg) ->
    if robot.brain.data._private.team is undefined or robot.brain.data._private.team[msg.message.room] is undefined
      msg.reply "You haven't picked a team yet!"
    else
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/moods/" +msg.match[1]+ "/trend/image")
      .get() (err, res, body) ->
        image = JSON.parse body
        msg.reply image.imageUrl

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
    if robot.brain.data._private.team is undefined
      robot.brain.data._private.team = new Object
    msg.http($baseurl+"/teams")
    .get() (err, res, body) ->
      for team in JSON.parse body
        if team.name.toUpperCase() == msg.match[1].toUpperCase()
          robot.brain.data._private.team[msg.message.room] = team
          robot.brain.save()
          robot.logger.debug robot.brain
          exists = true
          msg.reply "Okay, your team name is '"+team.name+"'"
          break
      if exists != true
        msg.reply "I'm sorry, that team does not yet exist yet."

  robot.hear /what(’|'| i)s (our|my) team/i, (msg) ->
    if robot.brain.data._private.team is undefined or robot.brain.data._private.team[msg.message.room] is undefined
      msg.reply "I don't know!!!"
    else
      msg.reply "Your team name is '" + robot.brain.data._private.team[msg.message.room].name + "'"

  robot.hear /(list|all|give me|show me) the boards/i, (msg) ->
    if robot.brain.data._private.team is undefined or robot.brain.data._private.team[msg.message.room] is undefined
      msg.reply "You haven't picked a team yet!"
    else
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards")
      .get() (err, res, body) ->
        for board in JSON.parse body
          msg.send board.name

  robot.hear /add board (.*)/i, (msg) ->
    if robot.brain.data._private.team is undefined or robot.brain.data._private.team[msg.message.room] is undefined
      msg.reply "You haven't picked a team yet!"
    data = JSON.stringify({
      name: msg.match[1]
    })
    msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards")
    .header('Content-Type', 'application/json')
    .post(data) (err, res, body) ->
      msg.send "Board Added!"

  robot.hear /make (.*) (my|our) board/i, (msg) ->
    if robot.brain.data._private.team is undefined or robot.brain.data._private.team[msg.message.room] is undefined
      msg.reply "You haven't picked a team yet!"
    else
      exists = false
      if robot.brain.data._private.board is undefined
        robot.brain.data._private.board = new Object()
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards")
      .get() (err, res, body) ->
        for board in JSON.parse body
          if board.name.toUpperCase() == msg.match[1].toUpperCase()
            robot.brain.data._private.board[msg.message.room] = board
            robot.brain.save()
            robot.logger.debug robot.brain
            exists = true
            msg.reply "Okay, your board name is '" + board.name + "'"
            break
        if exists != true
          msg.reply "I'm sorry, that board does not exist yet."

  robot.hear /what(’|'| i)s (our|my) board/i, (msg) ->
    if robot.brain.data._private.board is undefined or robot.brain.data._private.board[msg.message.room] is undefined
      msg.reply "I don't know!!!"
    else
      msg.reply "Your board name is '" + robot.brain.data._private.board[msg.message.room].name + "'"

  robot.hear /what(’|'| i)s (our|my) (.*) state/i, (msg) ->
    if robot.brain.data._private.board is undefined or robot.brain.data._private.board[msg.message.room] is undefined
      msg.reply "I don't know!!! (you haven't set the board yet)"
    else
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards/"+robot.brain.data._private.board[msg.message.room]._id+"/"+msg.match[3].toLowerCase()+"State")
      .get() (err, res, body) ->
        state = JSON.parse body
        msg.send state.description

  robot.hear /where are we now|where did we start/i, (msg) ->
    if robot.brain.data._private.board is undefined or robot.brain.data._private.board[msg.message.room] is undefined
      msg.reply "I don't know!!! (you haven't set the board yet)"
    else
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards/"+robot.brain.data._private.board[msg.message.room]._id+"/currentState")
      .get() (err, res, body) ->
        state = JSON.parse body
        msg.send state.description

  robot.hear /what(’|'| i)s (my|our) (target|goal)/i, (msg) ->
    if robot.brain.data._private.board is undefined or robot.brain.data._private.board[msg.message.room] is undefined
      msg.reply "I don't know!!! (you haven't set the board yet)"
    else
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards/"+robot.brain.data._private.board[msg.message.room]._id+"/targetState")
      .get() (err, res, body) ->
        state = JSON.parse body
        msg.send state.description

  robot.hear /what(’|'| i)s awesome|what does awesome look like/i, (msg) ->
    if robot.brain.data._private.board is undefined or robot.brain.data._private.board[msg.message.room] is undefined
      msg.reply "I don't know!!! (you haven't set the board yet)"
    else
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards/"+robot.brain.data._private.board[msg.message.room]._id+"/awesomeState")
      .get() (err, res, body) ->
        state = JSON.parse body
        msg.send state.description

  robot.respond /set (our|my) (.*) state to (.*)/i, (msg) ->
    if robot.brain.data._private.board is undefined or robot.brain.data._private.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      data = JSON.stringify({
        description: msg.match[3]
      })
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards/"+robot.brain.data._private.board[msg.message.room]._id+"/"+msg.match[2].toLowerCase()+"State")
      .header('Content-Type', 'application/json')
      .put(data) (err, res, body) ->
        msg.send msg.match[2]+" state updated!"
        msg.send "'"+msg.match[3]+"'"

  robot.respond /define awesome as (.*)/i, (msg) ->
    if robot.brain.data._private.board is undefined or robot.brain.data._private.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      data = JSON.stringify({
        description: msg.match[1]
      })
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards/"+robot.brain.data._private.board[msg.message.room]._id+"/awesomeState")
      .header('Content-Type', 'application/json')
      .put(data) (err, res, body) ->
        msg.send "Current State updated!"
        msg.send "'"+msg.match[1]+"'"

  robot.respond /(Check it out!|Awesome!|Kudos!|Sweet!|Excellent!|Woohoo!|Achievement Unlocked!) (.*)/i, (msg) ->
    if robot.brain.data._private.board is undefined or robot.brain.data._private.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      data = JSON.stringify({
        title: msg.match[1],
        description: msg.match[2]
      })
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards/"+robot.brain.data._private.board[msg.message.room]._id+"/achievements")
      .header('Content-Type', 'application/json')
      .post(data) (err, res, body) ->
        msg.send "Achievement added!"
        msg.send "'"+msg.match[2]+"'"

  robot.hear /what (have we done|did we do|have we accomplished|are our achievements)/i, (msg) ->
    if robot.brain.data._private.board is undefined or robot.brain.data._private.board[msg.message.room] is undefined
      msg.reply "I can't do that until you pick a board!"
    else
      msg.http($baseurl+"/teams/"+robot.brain.data._private.team[msg.message.room]._id+"/boards/"+robot.brain.data._private.board[msg.message.room]._id+"/achievements")
      .get() (err, res, body) ->
        msg.send "Here are our achievements so far:"
        for achievement in JSON.parse body
          msg.send achievement.description

  moodPoll = new CronJob '00 30 16 * * 1-5', ->
    for room, board of robot.brain.data._private.board
      buttonName = "mood_" + robot.brain.data._private.team[room]._id
      robot.emit 'slack.attachment',
        message: msg.message
        content:
          text: "How was your day today?"
          fallback: "Oh no! Something went horribly wrong!"
          callback_id: "dab_mood"
          color: "#3AA3E3"
          attachment_type: "default"
          actions: [{
            name: buttonName
            text: ":bolt-ecstatic:"
            type: "button"
            value: "ecstatic"
          },{
            name: buttonName
            text: ":bolt-happy:"
            type: "button"
            value: "happy"
          },{
            name: buttonName
            text: ":bolt-indifferent:"
            type: "button"
            value: "indifferent"
          },{
            name: buttonName
            text: ":bolt-disappointed:"
            type: "button"
            value: "disappointed"
          },{
            name: buttonName
            text: ":bolt-sad:"
            type: "button"
            value: "sad"
          }]
  , null, true, 'America/New_York'

  robot.respond /demo mood poll/i, (msg) ->
    buttonName = "mood_" + robot.brain.data._private.team[msg.message.room]._id
    robot.emit 'slack.attachment',
      message: msg.message
      content:
        text: "How was your day today?"
        fallback: "Oh no! Something went horribly wrong!"
        callback_id: "dab_mood"
        color: "#3AA3E3"
        attachment_type: "default"
        actions: [{
          name: buttonName
          text: ":bolt-ecstatic:"
          type: "button"
          value: "ecstatic"
        },{
          name: buttonName
          text: ":bolt-happy:"
          type: "button"
          value: "happy"
        },{
          name: buttonName
          text: ":bolt-indifferent:"
          type: "button"
          value: "indifferent"
        },{
          name: buttonName
          text: ":bolt-disappointed:"
          type: "button"
          value: "disappointed"
        },{
          name: buttonName
          text: ":bolt-sad:"
          type: "button"
          value: "sad"
        }]
