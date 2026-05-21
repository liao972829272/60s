export default {
  async fetch(request) {
    const accept = request.headers.get("accept") || "";

    // 浏览器访问 → 直接返回网页 + 数据
    if (accept.includes("text/html")) {
      // 直接在服务端获取数据，不再前端请求，彻底解决加载问题
      const apiRes = await fetch("https://60s.viki.moe/");
      const data = await apiRes.json();
      const imgUrl = data.entities[0].entity_content.image.image_ori.url;

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
  </style>
</head>
<body>
  <div class="card">
    <h2>60s 看世界</h2>
    <img src="${imgUrl}">
  </div>
</body>
</html>
      `, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // 其他情况返回JSON
    const res = await fetch("https://60s.viki.moe/");
    const data = await res.json();
    return Response.json(data);
  }
};
