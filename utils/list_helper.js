//BLOGILISTAN KÄSITTELYYN TARKOITETUT APUFUNKTIOT

//4.3: Palauttaa aina luvun 1
const dummy = (blogs) => {
  var blogList = []
  for(var i = 0; i < blogs.length; i++){
    blogs[i].push(blogList[i])
  }
  return 1
}

//4.4: Palauttaa tykkäysten määrän
const totalLikes = (blogs) => {
  var blogList = blogs.map(blog => blog.likes)
  var totalLikes = blogList.reduce((sum, likes) => sum + likes, 0)
  return totalLikes
}

//4.5: Palauttaa blogin, jolla eniten tykkäyksiä
const favoriteBlog = (blogs) => {
  var favoriteBlog = blogs.reduce((prev, cur) => (prev.likes > cur.likes) ? prev : cur)
  console.log(`title: ${favoriteBlog.title}, author: ${favoriteBlog.author}, likes: ${favoriteBlog.likes}`)
  return JSON.stringify(favoriteBlog.title, favoriteBlog.author, favoriteBlog.likes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
