import { HandlerContext, PageProps } from "$fresh/server.ts";
import { parseFeed } from "https://deno.land/x/rss/mod.ts";

export const handler = async (req: Request, _ctx: HandlerContext): Response => {
  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);
  const feed_url = params.get("url");

  const feed_xml = await fetch(feed_url)
        .then((res) => res.text())

  const feed = JSON.stringify(await parseFeed(feed_xml).catch((_) => {return true;}));

  return new Response(feed);
};
