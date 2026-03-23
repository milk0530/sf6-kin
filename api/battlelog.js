export default async function handler(req, res) {
  const { playerId, page = 1, limit = 100 } = req.query;

  if (!playerId) {
    return res.status(400).json({ error: "playerId is required" });
  }

  const cookie = process.env.SF6_COOKIE;
  if (!cookie) {
    return res.status(500).json({ error: "SF6_COOKIE not configured" });
  }

  try {
    const url = `https://www.streetfighter.com/6/buckler/api/profile/${playerId}/battlelog?page=${page}&limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        Cookie: cookie,
        "User-Agent":
          process.env.SF6_USER_AGENT ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        Referer: "https://www.streetfighter.com/6/buckler/",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `HTTP ${response.status}` });
    }

    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
