var posts=["2025/06/13/这是折腾吧的一篇博文/","2025/06/17/这是我的第二篇博文/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };