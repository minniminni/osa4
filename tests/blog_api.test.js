const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

//BLOGILISTAN TESTIT:
describe('bloglist', () => {
  //tyhjennetään tietokanta ja lisätään 2 blogia
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })

  //4.8 step1
  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  //4.9* step2
  test('blogs are defined with id not _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    })
  })

  //4.10 step3: Ei enää toimi!
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContainEqual('Canonical string reduction')
  })

  //4.11 step4: Ei enää toimi
  test('if blog has no likes, return default value zero', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const response =  await api.get('/api/blogs')
    expect(response.body[helper.initialBlogs.length].likes).toBe(0)

  })

  //4.12* step5: Ei enää toimi
  test('blog without title or url is not added', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  //Katkaistaan Mongoosen käyttämät tietokantayhteys
  afterAll(() => {
    mongoose.connection.close()
  })
})

//BLOGILISTAN LAAJENNUS:
describe('change bloglist', () => {
  //tyhjennetään tietokanta ja lisätään 2 blogia
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })

  //4.13 step1: Yksittäisen blogin poisto: Ei enää toimi
  test('blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogsAtStart[0].id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length-1)
  })

  //4.14* step2: Yksittäisen blogin muokkaus
  test('blog change', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const updateBlog = blogsAtStart[0]
    updateBlog.likes = blogsAtStart[0].likes + 5

    await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send({ likes: updateBlog.likes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toBe(updateBlog.likes)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})

/*afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)) // avoid jest open handle error
  })*/




