;var jsconf = (function () {
    var targeted_id = 'home';
    var article_template = "<div class='article'><h3><a href='{{link}}'>{{title}}</a></h3><div class='dateline'>{{date}}</div><div class='body'>{{{body}}}</div>";
    var video_template = "<a href='{{link}}' class='video'><div class='img'><img height='90' width='120' src='{{flv}}.jpg'/></div><div class='title'>{{title}}</div></a>";
    var panel_width = 870;
    var left_edge = function() {
        return jQuery("#navigation").offset().left;
    };
    var coords_for = function (id) {
      var x = 0;
      var y = 0;
      if (id == "articles" || id == "schedule" || id== "videos") {
          y = 110;
      } else if (id == "register" || id == "home" || id== "sponsors") {
          y = -439;
      } else if (id == "about" || id == "speakers" || id== "venue") {
          y = -990;
      }
      var navleft = left_edge();
      if (id == "articles" || id=="register" || id == "about")	{
          x = navleft + 10;
      } else if (id == "schedule" || id=="home" || id == "speakers")	{
          x = navleft - (panel_width);
      } else if (id == "videos" || id=="sponsors" || id == "venue")	{
          x = navleft - ((panel_width * 2) +13);
      }
      var obj = {"top": y, "left": x};
      return obj;
    };
    
    var refocus = function(easing) {
      var new_coords = coords_for(targeted_id);
      if (easing) {
         jQuery("#viewpane").animate(new_coords);
      } else {
        jQuery("#viewpane").css(new_coords);
      }
    };

    return {
      resizeContainer: function() {
        refocus();
      },
      focus_on: function(id) {
        targeted_id = id;
        refocus(true);
      },
      default_focus: function () {
        refocus(true);
      },
      load_blog: function() {
        var blog_feed = new google.feeds.Feed("http://feeds.feedburner.com/posterous/tzwp");
        blog_feed.setNumEntries(10); //Google Feed API method
        blog_feed.load(function(result) {
          if (!result.error) {
            result.feed.entries.forEach(function(e,i){
              jQuery("#article_listing").append(Mustache.to_html(article_template, {title: e.title, body: e.content, date: Date.parse(e.publishedDate).toString('dddd, MMMM d, yyyy'), link: e.link }));
              if (i == 0) {
                jQuery("#top_article").append(Mustache.to_html(article_template, {title: e.title, body: e.contentSnippet.replace("Permalink", ""), date: Date.parse(e.publishedDate).toString('dddd, MMMM d, yyyy'), link: e.link }));
              }
            });
            $("#article_listing .article p:last").remove();
          }
        });
      },
      load_videos: function() {
        var blog_feed = new google.feeds.Feed("http://blip.tv/?search=jsconf;s=search&skin=rss");
        blog_feed.setNumEntries(20); //Google Feed API method
        blog_feed.load(function(result) {
          if (!result.error) {
            var count = result.feed.entries.length;
            result.feed.entries.forEach(function(pick) {
              var t = pick.title.split(" ").slice(0,2).join(" ").replace(/[^a-zA-z ]/, "");
              $("#video_listing").append(Mustache.to_html(video_template, {title: t,  link: pick.link, flv: pick.mediaGroups[0].contents[1].url }));
            })
          }
        });
        
      }, 
      load_tweets: function() {
        $("#twitter").tweet({
            avatar_size: 28,
            count: 3,
            query: "jsconf",
            loading_text: "searching twitter..."
          });
      }
    }
})();





var initialize = function() {
  jsconf.resizeContainer();
  jQuery(window).resize(jsconf.resizeContainer);
  jQuery("div.block").click(function(e) {
    jsconf.focus_on(jQuery(this).attr("id"));
  });
  jQuery("#navigation a, a.focus").click(function(e) {
    e.preventDefault(); e.stopPropagation();
    jsconf.focus_on(jQuery(this).attr("href").replace("#",""));
  });
  jsconf.load_blog();
  jsconf.load_videos();
  jsconf.load_tweets();
};


// jQuery(document).ready(initialize);

google.setOnLoadCallback(initialize);
