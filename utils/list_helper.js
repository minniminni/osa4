//Blogilistan käsittelyyn tarkoitetut apufunktiot
//Parametrina taulukollinen blogeja ja palauttaa aina luvun 1.
const dummy = (blogs) => {
  var blogList = []
  for(var i = 0; i < blogs.length; i++){
    blogs[i].push(blogList[i])
  }
  return 1
}

//Parametrina taulukollinen blogeja ja palauttaa tykkäysten (likes) määrän
const totalLikes = (blogs) => {
  var blogList = blogs.map(blog => blog.likes)
  var totalLikes = blogList.reduce((sum, likes) => sum + likes, 0)
  console.log(`Total likes: ${totalLikes}`)
  return totalLikes
}

//Parametrina taulukollinen blogeja. Selvittää millä blogilla eniten tykkäyksiä
//Jos suosikkeja monta, riittää, että palauttaa jonkun
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
