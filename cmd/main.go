package main

import (
	"bytes"
	_ "embed"
	"fmt"
	"git.sr.ht/~jordanreger/feeds/algorithms"
	"html/template"
	"jordanreger.com/feeds"
	"jordanreger.com/web/util"
	"log"
	"net/http"
	"strings"
)

//go:embed index.html
var index string

var endpoint = "https://feeds.jordanreger.com"
var did = "did:plc:27rjcwbur2bizjjx3zakeme5"

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/.well-known/did.json", func(w http.ResponseWriter, r *http.Request) {
		util.ContentType(w, "application/json")

		fmt.Fprint(w, feeds.GetWellKnownDID(endpoint))
		return
	})

	mux.HandleFunc("/xrpc/app.bsky.feed.describeFeedGenerator", func(w http.ResponseWriter, r *http.Request) {
		util.ContentType(w, "application/json")

		states := []string{"al", "ak", "az", "ar", "as", "ca", "co", "ct", "de", "dc", "fl", "ga", "gu", "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj", "nm", "ny", "nc", "nd", "mp", "oh", "ok", "or", "pa", "pr", "ri", "sc", "sd", "tn", "tx", "tt", "ut", "vt", "va", "vi", "wa", "wv", "wi", "wy"}

		var fl []feeds.Feed

		for _, state := range states {
			fl = append(fl, feeds.Feed{URI: "at://" + did + "/app.bsky.feed.generator/" + state + "wx"})
		}

		fmt.Fprint(w, feeds.DescribeFeedGenerator(did, fl))
		return
	})

	mux.HandleFunc("/xrpc/app.bsky.feed.getFeedSkeleton", func(w http.ResponseWriter, r *http.Request) {
		util.ContentType(w, "application/json")

		uri := r.URL.Query().Get("feed")
		if uri == "" {
			fmt.Fprint(w, `{"error": "feed not found"}`)
			return
		}
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

	// redirect to /
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		}

		states := []string{"al", "ak", "az", "ar", "as", "ca", "co", "ct", "de", "dc", "fl", "ga", "gu", "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj", "nm", "ny", "nc", "nd", "mp", "oh", "ok", "or", "pa", "pr", "ri", "sc", "sd", "tn", "tx", "tt", "ut", "vt", "va", "vi", "wa", "wv", "wi", "wy"}

		var fl []feeds.Feed

		for _, state := range states {
			fl = append(fl, feeds.Feed{URI: "at://" + did + "/app.bsky.feed.generator/" + state + "wx", Name: "#" + strings.ToUpper(state) + "WX"})
		}

		t := template.Must(template.New("index").Parse(index))
		var page bytes.Buffer

		err := t.ExecuteTemplate(&page, "index", fl)
		if err != nil {
			panic(err)
		}

		util.ContentType(w, "text/html")
		fmt.Fprint(w, page.String())
		return
	})

	log.Fatal(http.ListenAndServe(":8080", mux))
}
