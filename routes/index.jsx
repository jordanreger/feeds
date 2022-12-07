import { Head } from "$fresh/runtime.ts";
import InputBar from "../islands/InputBar.jsx";
import FeedList from "../islands/FeedList.jsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>feeds</title>
        <meta name="title" content="feeds" />
        <meta name="description" content="a very basic rss reader" />

        <link rel="stylesheet" href="https://jordanreger.com/resources/index.css" />
      </Head>
      <body>
        <main>
          <header>
            <pre class="title">
{"   "}_______________  ____<br/>
{"  "}/ __/ __/ __/ _ \/ __/<br/>
{" "}/ _// _// _// // /\ \<br/>
{""}/_/ /___/___/____/___/</pre>
          </header>
          <article>
            <div class="body">
              feeds is a very basic rss reader. view the source on <a href="https://git.sr.ht/~jordanreger/feeds">sourcehut</a>.
              <br/>
              (for links that don't work, please add an issue to <a href="https://todo.sr.ht/~jordanreger/feeds" target="_blank">todo.sr.ht/~jordanreger/feeds</a>)
              <br/>
              <br/>
              <InputBar></InputBar>
            </div>
          </article>
          <hr />
          <article>
            <div style="padding-bottom: 4vh">
              <div class="subtitle" style="float: left">newest</div>
              <div class="body" style="float: right; text-decoration: underline; cursor: pointer" onclick="location.reload()">refresh</div>
            </div>
            <br/>
            <div class="body">
              <FeedList></FeedList>
              you've reached the end of your feed. currently, we only show the latest 20 posts.
            </div>
          </article>
        </main>
      </body>
    </>
  );
}
