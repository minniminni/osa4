const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

//Blogien hakeminen
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.status(200).json(blogs.map(blog => blog.toJSON()))
})

//Yksittäisen blogin hakeminen id perusteella
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end
  }
})

//Blogin lisääminen
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  //const token = getTokenFrom(request)
  if(!body.author || !body.url){
    return response.status(400).json({
      error: 'author or url is missing'
    })
  }

  //Varmistetaan tokenin oikeellisuus ja palautetaan olio, jonka perusteella token on laadittu
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if ((!request.token) || (!decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes,
    user: user._id
  })

  //Tallennetaan blogi
  const savedBlog = await blog.save()
  //Tallennetaan blogin id käyttäjän alle
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return response.status(201).json(savedBlog.toJSON())
})

//Blogin poistaminen (kesken)
blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!token || !decodedToken.id) {
    response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).end()
  }
})

//Blogin muokkaaminen (kesken)
blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const update = await Blog.findByIdAndUpdate(request.params.id, blog)
  response.json(update.toJSON())
})

module.exports = blogsRouter