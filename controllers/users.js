const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//Kaikki käyttäjät
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url:1, title: 1, author: 1, id: 1 })

  response.json(users.map(u => u.toJSON()))
})

//Luo käyttäjä
usersRouter.post('/', async (request, response) => {
  const body = request.body

  if(body.password === undefined || body.username === undefined){
    return response.status(400).json({
      error: 'password or username is missing'
    })
  }
  else if(body.password.length < 3){
    return response.status(400).json({
      error: 'password is too short'
    })
  }
  else if (body.username.length < 3) {
    return response.status(400).json({
      error: 'username is too short'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    blogs: [],
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter