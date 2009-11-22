dojo.require("dojo.dnd.Mover");
dojo.require("dojo.dnd.Moveable");
dojo.require("dojo.dnd.move");
dojo.require("dojox.fx");
dojo.require("dojox.fx.easing");
dojo.require("dijit._base.place");

;var jsconf = (function () {
    var targeted_id = 'home';
    var header_height = 40;
    
    var coords_for = function (id) {
	var x = 0;
	var y = 0;
	if (id == "articles" || id == "schedule" || id== "videos") {
	    y = header_height;
	} else if (id == "register" || id == "home" || id== "sponsors") {
	    y = -(549 - header_height);
	} else if (id == "about" || id == "speakers" || id== "venue") {
	    y = -(1109 - header_height);
        }
	var navleft = dojo.query("#navigation").coords()[0].x;
	if (id == "articles" || id=="register" || id == "about")	{
	    x = navleft - 169;
	} else if (id == "schedule" || id=="home" || id == "speakers")	{
	    x = navleft - 1069;
	} else if (id == "videos" || id=="sponsors" || id == "venue")	{
	    x = navleft - 1969;
	}
        return {"top": y, "left": x};
    }
    
    var refocus = function(easing) {
	var new_coords = coords_for(targeted_id);
	if (easing) {
	    dojo.fx.slideTo({
		node: "viewpane", // drag node
		top: new_coords.top, // tmp top
		left: new_coords.left, // tmp left
		easing: dojox.fx.easing.cubicOut,
		duration:950 // ms
	    }).play(5);
	} else {
	    dojo.style("viewpane", new_coords);
	}
	

    };

    return {
	resizeContainer: function() {
	    header_height = dojo.query("#navigation").coords()[0].h;
	    var vp = dijit.getViewport();
	    dojo.style("container", {
		"height": vp.h,
		"width": vp.w
	    });
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
    // dojo.connect(, "onresize", jsconf.resizeContainer);
    dojo.query("div.block").onclick(function(e) {
        var curr_node = e.target;
        t = curr_node;
        while( curr_node.className != "block") {
            curr_node = curr_node.parentNode;
        }
	jsconf.focus_on(curr_node.id);
    });
    dojo.query("textarea").onclick(function(e) {
        e.target.focus();
    });
    var viewpane = new dojo.dnd.Moveable("viewpane");
    dojo.subscribe("/dnd/move/stop", function(mover){ 
        jsconf.default_focus();;
    });

});