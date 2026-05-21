export default {
  async fetch(request) {
    const accept = request.headers.get("accept") || "";

    try {
      // 先尝试获取数据
      const apiRes = await fetch("https://60s.viki.moe/", {
        cf: { cacheTtl: 300 } // 缓存5分钟，减少请求
      });

      if (!apiRes.ok) throw new Error("API请求失败");
      const data = await apiRes.json();

      // 处理数据，防止结构异常
      let imgUrl = "";
      if (data?.entities?.[0]?.entity_content?.image?.image_ori?.url) {
        imgUrl = data.entities[0].entity_content.image.image_ori.url;
      } else {
        throw new Error("数据结构异常");
      }

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
    .error{color:red;text-align:center;padding:30px}
  </style>
</head>
<body>
  <div class="card">
    <h2>60s 看世界</h2>
    <img src="${imgUrl}" alt="每日新闻图片">
  </div>
</body>
</html>
        `, {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }

      // 其他情况返回原始JSON
      return Response.json(data);

    } catch (err) {
      // 全局错误处理，防止Worker崩溃
      const errorHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body{max-width:600px;margin:30px auto;padding:20px;background:#f5f5f5;font-family:Arial}
    .error{background:#fff;padding:20px;border-radius:16px;color:#dc2626;text-align:center}
  </style>
</head>
<body>
  <div class="error">
    <h2>加载失败</h2>
    <p>请稍后再试</p>
  </div>
</body>
</html>
      `;

      if (accept.includes("text/html")) {
        return new Response(errorHtml, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }

      return Response.json({ error: err.message }, { status: 500 });
    }
  }
};
