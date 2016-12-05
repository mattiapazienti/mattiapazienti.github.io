$(function() {
    
    // INIT MODEL
    var Posts = Backbone.Model; 

    // EXTEND COLLECTION
    var Post = Backbone.Collection.extend({
      model: Posts,
      url: 'admin/posts.json',
      parse: function (response) {
        return response;
      }
    });

    // INIT VIEW
    var Listing = Backbone.View.extend ({
      el: '.blog',
      events: {
          "click li.list a" : "showpost",
          "click li.list b" : "clearpost",
          "click #back" : "clearpost"
      },
      render: function () {
        var that = this;
        post = new Post();
        post.fetch({
            success: function (Post) {
                var template = _.template($('#list-template').html(), {Post: Post.models});
                that.$el.html(template);
                var listing = document.getElementById("listing");
                var i = listing.childNodes.length;
                while (i--)
                listing.appendChild(listing.childNodes[i]);
                var $rows = $('ul#listing li');
                $('#src').keyup(function() {
                    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
                    $rows.fadeIn().filter(function() {
                        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                        return !~text.indexOf(val);
                    }).hide();
                });
              }
        });
      },
      showpost: function (event) {
          e = event.target.id;
          Router.navigate('post/' + e + '/', { trigger: true });
          // assign transitions
          $(".viewport .blog, .viewport .blog ul li span, .viewport .blog ul li b, .viewport .sticky-wrapper").addClass("trns");
          $(".viewport .blog ul li." + e + " span").css({"width":"100%"});
          $(".ie .viewport .blog ul li." + e + " span").animate({"width":"100%"});

          setTimeout(function() {
              if( $("html").hasClass("ie8") ) {
                 $(".viewport .blog").animate({"left":"calc(-100% + 40px)"});                  
              } else {
                 $(".viewport .blog").css({"margin-left":"calc(-100% + 40px)"});               
              }           
              $(".viewport").addClass("on_post");
              $(".viewport .blog ul li." + e + " span").css({"width":"calc(100% - 40px)"});
              $("html, body").animate({ scrollTop: 0 }, 0);
          }, 800);
          setTimeout(function() {
              $(".viewport .blog ul li." + e + " > b").css({"opacity":"1", "cursor":"pointer", "position":"fixed", "top":"146px", "left":"0"});
          }, 2000);
      },
      clearpost: function() {
          $(".viewport").removeClass("on_post");
          $(".viewport .blog").css({"margin-left":"0"});
          $(".viewport .blog ul li." + e + " > b").css({"opacity":"0", "position":"absolute", "top":"0", "left":"auto", "right":"0"});
          setTimeout(function() {
              Router.navigate('', { trigger: true });
          }, 800);
      }
    }); 
    
    // RE_START APP
    window.onload = function start() {
        var listingView = new Listing();
        listingView.render();
    };
        
    // LOAD SELECTED POSTS
    PostView = function () {
        var that = this;
        $.ajaxSetup({ cache: false });
        $.getJSON("admin/posts.json", function(data){ 
        var dati = [];
        var info = [];
        // get data
        $.each(data, function(index, d){   
            p_id = d.id;
            p_sl = d.slug;
            p_tt = d.title;
            p_tx = d.text;
            p_ct = d.category;
            p_dt = d.date;
            p_tl = p_tx.length;
            p_tm = (p_tl * 0.06)/60;
            p_tm = Math.round(p_tm);
            if (p_tm == 0) {
                p_tm = "Less than a minute";
            } else {
                p_tm = "About " + p_tm + " min."; 
            }
            if(p_sl == e) {
            dati.push("<div class=\"post\"><article><h1>" + p_tt + "</h1><p>" + p_tx + "</p></article>"  );
            info.push("<div class=\"info " + p_ct + "\"><time>" + p_dt + "</time><span class=\"p_ab\">This is a post about<b>" + p_ct + "</b></span><span class=\"p_rt\">Reading time<b>" + p_tm + "</b></span></div></div>");
            } else {
                return;
            }
        });
        $(".center").html('<div id="back"><span>‹ back to posts</span></div>' + dati.join('') + info.join(''));
        });
      };

    // ROUTES
    var Router = Backbone.Router.extend({
        routes: {
            '(Codekod)': 'index',
            'post/*actions/': 'post'
        },
        post: function() {  
            PostView(e);
        },
        index: function() {
            var listingView = new Listing();
            listingView.render();
        }
    });

    var Router = new Router;
    Backbone.history.start({ pushState: true });

});

