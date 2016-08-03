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

  robot.hear /who's awesome/i, (msg) ->
    msg.send msg.random youre_awesome

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
