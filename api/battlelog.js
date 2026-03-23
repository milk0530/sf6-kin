export default async function handler(req, res) {
  const { playerId, page = 1 } = req.query;

  if (!playerId) {
    return res.status(400).json({ error: "playerId is required" });
  }

  const cookie = process.env.SF6_COOKIE;
  if (!cookie) {
    return res.status(500).json({ error: "SF6_COOKIE not configured" });
  }

  try {
    const url = `https://www.streetfighter.com/6/buckler/profile/${playerId}/battlelog?page=${page}`;
    const response = await fetch(url, {
      headers: {
        Cookie: cookie,
        "User-Agent":
          process.env.SF6_USER_AGENT ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: "https://www.streetfighter.com/6/buckler/",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `HTTP ${response.status}` });
    }

    const html = await response.text();
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/s);
    if (!match) {
      return res.status(500).json({ error: "__NEXT_DATA__ not found (maybe not logged in?)" });
    }

    const nextData = JSON.parse(match[1]);
    const pageProps = nextData?.props?.pageProps ?? {};

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.json({
      list:         pageProps.replay_list ?? [],
      current_page: pageProps.current_page,
      total_page:   pageProps.total_page,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
