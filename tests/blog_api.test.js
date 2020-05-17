const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('blogs', () => {
  //tyhjennetään tietokanta ja lisätään 2 blogia
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })

  //Tehdään HTTP GET-pyyntö osoitteeseen api/blogs
  //Testataan, että palauttaa oikean määrän blogeja
  //Varmistetetaan että vastauskoodi on 200 ja data palautetaan oikeassa muodossa
  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  //Varmistetaan palautettujen blogien identifioivan kentän olevan id ei _id
  test('blogs are defined with id not _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
      console.log(`blog id: ${blog.id}`)
      expect(blog._id).not.toBeDefined()
    })
  })

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

  //Varmistetaan, että sovellukseen voi lisätä blogeja
  //Testataan, että blogien määrä kasvaa yhdellä
  //Testataan, että lisätyn blogin sisältö on oikea
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

  //Yksittäisen blogin poisto
  test('blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    console.log(`BLOGS AT START LENGTH: ${blogsAtStart.length}`)
    console.log(`DELETE BLOG: ${blogsAtStart[0].id} ${blogsAtStart[0].title}`)
    await api
      .delete(`/api/blogs/${blogsAtStart[0].id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    console.log(`BLOGS AT END LENGTH: ${blogsAtEnd.length}`)
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length-1)
  })
  //Yksittäisen blogin muokkaus: likes lukumäärän päivitystä varten.
  test('blog change', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const updateBlog = blogsAtStart[0]
    console.log(`likes before= ${blogsAtStart[0].likes}`)
    updateBlog.likes = blogsAtStart[0].likes + 5

    await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send({ likes: updateBlog.likes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    console.log(`likes after=${blogsAtEnd[0].likes}`)
    expect(blogsAtEnd[0].likes).toBe(updateBlog.likes)
  })

  //Katkaistaan Mongoosen käyttämät tietokantayhteys
  /*afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)) // avoid jest open handle error
  })*/

  afterAll(() => {
    mongoose.connection.close()
  })
})