const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

//Etsii pyynnön mukana käyttäjänimeä vastaavan käyttäjän tietokannasta
//Katsotaan onko salasana oikea: vertailu metodilla bcrypt.compare
loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  console.log(`found username: ${body.username}`)
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  //Salasana/käyttäjä ei täsmää
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  //Luodaan token, jos salasana oikein.
  //Token varmistaa, että ainoastaan SECRET tuntevilla mahdollisuus generoida validi token
  //HUOM! Ympäristömuuttujalle täytyy asettaa arvo tiedostossa .env
  const token = jwt.sign(userForToken, config.SECRET)
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter