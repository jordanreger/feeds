# feeds

Bluesky feed generator template. Currently this hosts all of the feeds under my account [@jordanreger.com](https://bsky.app/profile/jordanreger.com)

## Usage

There are 3 main files: `describe.go`, `did.go`, and `feed.go`. `cmd/main.go` shows you the best way to implement these, but I will discuss it here as well.

`describe.go`

This has one function, necessary for `/xrpc/app.bsky.feed.describeFeedGenerator`. All you need to do is pass in the user's DID and a list of `feeds.Feed` objects. This can be done like so:

```go
mux.HandleFunc("/xrpc/app.bsky.feed.describeFeedGenerator", func(w http.ResponseWriter, r *http.Request) {
		util.ContentType(w, "application/json")

		feeds := []string{"feed1", "feed2", "feed3"}

		var fl []feeds.Feed

		for _, feed := range feeds {
			fl = append(fl, feeds.Feed{URI: "at://" + did + "/app.bsky.feed.generator/" + feed})
		}

		fmt.Fprint(w, feeds.DescribeFeedGenerator(did, fl))
		return
})
```

`did.go`

This also has one function, necessary for `/.well-known/did.json`. You only need the feed generator's endpoint defined as `endpoint`. You can use it like so:

```go
mux.HandleFunc("/.well-known/did.json", func(w http.ResponseWriter, r *http.Request) {
		util.ContentType(w, "application/json")

		fmt.Fprint(w, feeds.GetWellKnownDID(endpoint))
		return
})
```

`feed.go`

This also has one function, necessary for `/xrpc/app.bsky.feed.getFeedSkeleton`. You need to have `feed` defined as a list of `feeds.Post`. You can use it like so:

```go
mux.HandleFunc("/xrpc/app.bsky.feed.getFeedSkeleton", func(w http.ResponseWriter, r *http.Request) {
		util.ContentType(w, "application/json")

		uri := r.URL.Query().Get("feed")
		uri_split := strings.Split(uri, "/")
		feed_name := strings.Replace(uri_split[len(uri_split)-1], "wx", "", 1)
		record_type := uri_split[len(uri_split)-2]
		request_did := uri_split[len(uri_split)-3]

		var feed []feeds.Post

		feed, err := algorithms.State(feed_name)

		// no feed or incorrect request
		if err != nil || record_type != "app.bsky.feed.generator" || request_did != did {
			fmt.Fprint(w, `{"error": "feed not found"}`)
			return
		}

		fmt.Fprint(w, feeds.GetFeedSkeleton(feed))
		return
})
```

## Customization

You can customize which feeds you have available in `/algorithms`. I currently am only hosting feeds in `state.go`. These are the feeds visible from my account. I have a template for a static feed as well in `static.go`.

## Self-hosting

As you can see in `/cmd`, this server is hosted on [Fly.io](https://fly.io). All you need to do to deploy this yourself is edit the `fly.toml` file.

## Contributing

Send patches/bug reports to <~jordanreger/public-inbox@lists.sr.ht>
