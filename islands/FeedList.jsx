(async () => {
  for(let i = 0; i < window.localStorage.length; i++) {
    let rss_url = Object.keys(window.localStorage)[i];
    const feed = await fetch(`/feed?url=${rss_url}`).then(res => res.text()).then(feed => { return feed }).catch((_) => { return true });
    if(feed !== "Internal Server Error") {
      window.localStorage.setItem(rss_url, feed);
    }
  }
})();

function get_feed_list() {
  let feed_list_array = [];

  if(window.localStorage !== undefined) {
    for(let i = 0; i < window.localStorage.length; i++) {
      let feed_entries = JSON.parse(Object.values(window.localStorage)[i]).entries;
      feed_entries?.forEach(entry => {
        feed_list_array.push(entry);
      })
    }
  }

  feed_list_array = feed_list_array.sort(function(a,b){
    return new Date(b.published) - new Date(a.published);
  });

  let feed_list_display = [];

  for(const feed of feed_list_array) {
    let post_url = feed.id;
    let post_title;
    let post_description;

    // set feed title
    if(typeof feed.title !== "undefined") {
      post_title = feed.title?.value;
    } else {
      post_title = post_url;
    }

    //set feed content
    if(typeof feed.description?.value !== "undefined"){
      post_description = feed.description?.value;
    } else if (typeof feed.content?.value !== "undefined") {
      post_description = feed.content?.value;
    } else {
      post_description = null;
    }
    
    // decode random things like brackets, apostrophes, etc.
    function decodeHTML(html) {
      let txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }
    post_description = decodeHTML(post_description);

    // remove all html, head, and body tags for rendering
    post_description = post_description?.replaceAll(/<html(.*?)>/gmis, "");
    post_description = post_description?.replaceAll(/<\/html>/gmis, "");
    post_description = post_description?.replaceAll(/<head(.*?)>(.*?)<\/head>/gmis, "");
    post_description = post_description?.replaceAll(/<body(.*?)>/gmis, "");
    post_description = post_description?.replaceAll(/<\/body>/gmis, "");

    let post_image = ((typeof feed["media:content"] !== "undefined") ? feed["media:content"][0].url : null);
    let post_date = String(new Date(feed.published));

    function get0x7d0date() {

      function pad(n) {
        return (n < 10) ? ("0" + n) : n;
      }
    
      var now = new Date(post_date);
      var year = now.getFullYear() - 2000;
      var day_of_year = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24) - 1;
      var month_number = Math.floor((day_of_year) / 14);
      var month = (String.fromCharCode(65 + month_number) === "[") ? "+" : String.fromCharCode(65 + month_number);
      var day = day_of_year - (month_number * 14);
    
      var arvelie_date = `${pad(year)}${month}${pad(day)}`;
      return arvelie_date;
    }

    const arvelie_date = get0x7d0date();

    const feed_html = (
    <article style="border: 1px solid white; margin-bottom: 2rem; padding: 1rem; overflow-wrap: break-word">
      <div class="subtitle" style="font-size: 1.25rem">{post_title}</div>
      <div class="body">
        <b><span title={post_date}>{arvelie_date}</span></b>
        <br/>
        <br/>
        {post_image !== null ? <img src={post_image} style="max-height: 25%; max-width 100%;" /> : null}
        <div class="post_description" dangerouslySetInnerHTML={{__html: post_description}}></div>
        <b>[<a href={post_url}>{post_url}</a>]</b>
      </div>
    </article>
    );

    if(feed_list_display.length <= 19){
      feed_list_display.push(feed_html);
    }

  }

  return feed_list_display;

}

export default function FeedList() {
  return (
    <>
      <div>
        {get_feed_list()}
      </div>
    </>
  );
}