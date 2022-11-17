async function handleSubmit(e) {
  e.preventDefault();
  const input = e.target[0];
  const rss_url = e.target[0].value;
  
  if(rss_url) {
    const feed = await fetch(`/feed?url=${rss_url}`).then(res => res.text()).then(feed => { return feed }).catch((_) => { return true });
          
    if(feed !== "Internal Server Error") {
      window.localStorage.setItem(rss_url, feed);
    }

    input.value = "";
    location.reload();
  }
}

function delete_feed(feed) {
  feed = feed.srcElement.parentElement.parentElement.childNodes[0].href;
  localStorage.removeItem(feed);
  location.reload();
}

function get_feed_list() {
  let feed_list = Object.keys(window.localStorage);
  let feed_list_display = [];
  feed_list.forEach(feed => {
    feed_list_display.push(<p><a href={feed}>{feed}</a> &#8212; <span class="delete" onClick={delete_feed} style=":hover { cursor: pointer }"><b>delete</b></span></p>);
  });
  return feed_list_display;
}

export default function InputBar() {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="enter your RSS URL" name="import" />
      </form>
      <br/>
      <br/>
      <details>
        <summary>your feeds</summary>
        <div>{get_feed_list()}</div>
      </details>
    </>
  );
}