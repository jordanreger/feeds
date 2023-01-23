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

        <link rel="stylesheet" href="/index.css" />
      </Head>
      <body>
        <main>
          <header>
            <h1>feeds</h1>
          </header>
          <article>
            <div class="body">
              a very basic feed reader. read about <a href="https://jordanreger.com/Why-RSS-still-matters-5093a8e7d2944f00ad2dc24ad52f7df1">why rss still matters</a>.
              <br/>
              <br/>
              <InputBar></InputBar>
            </div>
          </article>
          <hr />
          <article>
            <div style="padding-bottom: 4vh">
              <div class="subtitle" style="float: left"><b>newest</b></div>
              <div class="body" style="float: right; text-decoration: underline; cursor: pointer" onclick="location.reload()">refresh</div>
            </div>
            <br/>
            <div class="body">
              <FeedList></FeedList>
              <i>you've reached the end of your feed. currently, we only show the latest 20 posts.</i>
            </div>
          </article>
          <footer>
            built by <a href="https://2jr.co">jordan reger</a>
          </footer>
        </main>
      </body>
    </>
  );
}
