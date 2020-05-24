const listHelper = require('../utils/list_helper')

const blogs = [ {
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
},
{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
},
{
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0
},
{
  _id: '5a422b891b54a676234d17fa',
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
  __v: 0
}, {
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
  __v: 0
},
{
  _id: '5a422bc61b54a676234d17fc',
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  __v: 0
}]

var sum = 0
for(var i=0; i < blogs.length; i++){
  sum=sum+blogs[i].likes
}

//4.3 step1
test('dummy returns one', () => {
  var blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

//4.4. step2
describe('total likes', () => {
  test('of empty list is zero', () => {
    const emptyblog = []
    const result = listHelper.totalLikes(emptyblog)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const oneBlog = [blogs[0]]
    const result = listHelper.totalLikes(oneBlog)
    expect(result).toBe(oneBlog[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(sum)
  })
})

//4.5* step3
test('blog with most likes', () => {
  const result = listHelper.favoriteBlog(blogs)
  expect(result).toEqual(JSON.stringify(blogs[2].title, blogs[2].author, blogs[2].likes))
})
