export default {
  async fetch(request) {
    const accept = request.headers.get("accept") || "";

    // 浏览器访问 → 返回网页
    if (accept.includes("text/html")) {
      return new Response(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>60s 看世界</title>
  <style>
    body{max-width:600px;margin:30px auto;padding:20px;background:#f5f5f5;font-family:Arial}
    .card{background:white;padding:20px;border-radius:16px;box-shadow:0 2px 10px #0000000a}
    img{width:100%;border-radius:12px;margin-top:15px}
    .loading{text-align:center;padding:30px}
  </style>
</head>
<body>
  <div class="loading">加载中...</div>
  <script>
    fetch("/data").then(r=>r.json()).then(data=>{
      document.body.innerHTML = '<div class="card">' +
        '<h2>60s 看世界</h2>' +
        '<img src="'+data.entities[0].entity_content.image.image_ori.url+'"></div>';
    });
  </script>
</body>
</html>
      `, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // 接口访问 → 返回JSON
    if (new URL(request.url).pathname === "/data") {
      const res = await fetch("https://60s.viki.moe/");
      const data = await res.json();
      return Response.json(data);
    }

    // 默认返回数据
    const res = await fetch("https://60s.viki.moe/");
    const data = await res.json();
    return Response.json(data);
  }
};
