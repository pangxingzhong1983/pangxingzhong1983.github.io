var posts=["2025/06/13/这是折腾吧的一篇博文/","2025/06/14/这是一篇纵云梯的博文/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };