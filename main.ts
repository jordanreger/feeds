import { serve } from "https://deno.land/std/http/server.ts";

let root = ".";

if (Deno.args[0] !== "localhost") {
    root = "./feeds"
}

// rss parser
import { parseFeed } from "https://deno.land/x/rss/mod.ts";

async function handler(req: Request): Promise<any> {
  let url = new URL(req.url);
  let path = url.pathname, params = new URLSearchParams(url.search);
  const route = (route:string) => { let regexRoute = new RegExp(route, "gmi"); if(regexRoute.test(path)){ return path } else { return null }}
  const file = async (fp:string) => { let d = new TextDecoder("utf-8"); return d.decode(await Deno.readFile(fp))}

  let text_response, response_body, content_type = "";

  switch(path){
    case '/':
      text_response = true, response_body = await file(`${root}/pages/index.html`), content_type = "text/html; charset=UTF-8";
      break;

    case '/index.css':
      text_response = true, response_body = await file(`${root}/static/index.css`), content_type = "text/css";
      break;

    case '/feed':
      let url = String(params.get("url"));
      const feed_xml = await fetch(url)
        .then((res) => res.text())

      const feed = JSON.stringify(await parseFeed(feed_xml));
        
      text_response = true, response_body = feed, content_type = "text/xml";
      break;

    default:
      text_response = true, response_body = "404", content_type = "text/html; charset=UTF-8";
  }

  let res;

  if(text_response){
    res = new Response(await response_body, { headers: { "content-type": content_type } });
  } else {
    res = Response.redirect(response_body, 302);
  }
  return res;
}

await serve(handler);
