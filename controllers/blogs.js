const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//Blogien hakeminen
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.status(200).json(blogs.map(blog => blog.toJSON()))
})

//Blogin lisääminen
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  console.log(`new blog: ${blog}`)
  await blog.save()
  return response.status(201).json(blog.toJSON())
})

//Blogin poistaminen
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

//Blogin muokkaaminen
blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const update = await Blog.findByIdAndUpdate(request.params.id, blog)
  response.json(update.toJSON())
})

module.exports = blogsRouter