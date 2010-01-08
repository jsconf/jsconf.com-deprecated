;var jsconf = (function () {
    var targeted_id = 'home';
    var template = "<div class='article'><h3><a href='{{link}}'>{{title}}</a></h3><div class='dateline'>{{date}}</div><div class='body'>{{{body}}}</div>";
    
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
        var blog_feed = new google.feeds.Feed("http://jsconf.posterous.com/rss.xml");
        blog_feed.setNumEntries(10); //Google Feed API method
        blog_feed.load(function(result) {
          console.log(result);
          if (!result.error) {
            result.feed.entries.forEach(function(e,i){
              jQuery("#article_listing").append(Mustache.to_html(template, {title: e.title, body: e.content, date: Date.parse(e.publishedDate).toString('dddd, MMMM d, yyyy'), link: e.link }));
            });
            $("#article_listing .article p:last").remove();
          }
        });
      }
    }
})();



google.load("feeds", "1");
google.load("jquery", "1");


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
};


// jQuery(document).ready(initialize);

google.setOnLoadCallback(initialize);
