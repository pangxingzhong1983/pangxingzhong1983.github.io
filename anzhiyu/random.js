var posts=["2025/06/13/这是纵云梯的第一篇博文/","2025/06/13/hello-world/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };