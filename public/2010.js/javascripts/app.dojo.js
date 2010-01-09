dojo.require("dojox.fx");
dojo.require("dojox.fx.easing");
dojo.require("dijit._base.place");

;var jsconf = (function () {
    var targeted_id = 'home';
    var panel_width = 870;

    var left_edge = function() {
        return dojo.query("#navigation").coords()[0].x;
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
    }
    
    var refocus = function(easing) {
	var new_coords = coords_for(targeted_id);
        console.log("lxt: "+new_coords.left+"x"+new_coords.top);
	if (easing) {
	    dojo.fx.slideTo({
        node: "viewpane", // drag node
        top: new_coords.top, // tmp top
        left: new_coords.left, // tmp left
        easing: dojox.fx.easing.cubicOut,
      }).play(5);
	} else {
	    dojo.style("viewpane", new_coords);
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
        }
	
    }
})();

var t = null;

dojo.addOnLoad(function() {
    jsconf.resizeContainer();
    dojo.connect(window, "onresize", jsconf.resizeContainer);
    dojo.query("div.block").onclick(function(e) {
        var curr_node = e.target;
        t = curr_node;
        while( curr_node.className != "block") {
            curr_node = curr_node.parentNode;
        }
        jsconf.focus_on(curr_node.id);
    });
    dojo.query("#navigation a").onclick(function(e) {
      e.preventDefault(); 
        var curr_node = e.target;
        var href = dojo.attr(curr_node, "href");
        if (!href) {
            href = dojo.attr(curr_node.parentNode, "href");
        }
        jsconf.focus_on(href.replace("#",""));
    });
    dojo.query("textarea").onclick(function(e) {
        e.target.focus();
    });
    var viewpane = new dojo.dnd.Moveable("viewpane");
    dojo.subscribe("/dnd/move/stop", function(mover){ 
        jsconf.default_focus();;
    });
});