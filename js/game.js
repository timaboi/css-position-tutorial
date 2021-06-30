var colors = {
  r: "red",
  y: "yellow",
  b: "blue",
};

var game = {
  level: parseInt(localStorage.level, 10) || 0,
  user: localStorage.user || "",
  changed: false,
  solved: (localStorage.solved && JSON.parse(localStorage.solved)) || [],

  start: function () {
    $("#level-counter .total").text(levels.length);
    $("#editor").show();

    if (!localStorage.user) {
      game.user =
        "" + new Date().getTime() + Math.random().toString(36).slice(1);
      localStorage.setItem("user", game.user);
    }

    this.loadMenu();
    game.loadLevel(levels[game.level]);
    this.setHandlers();
  },

  setHandlers: function () {
    $("#next").on("click", function () {
      $(".edit").focus();

      if ($(this).hasClass("disabled")) {
        if (!$(".butterfly").hasClass("animated")) {
          game.tryagain();
        }
        return;
      }

      $(this).removeClass("animated animation");
      $(".butterfly").addClass("animated bounceOutUp");
      $(".arrow, #next").addClass("disabled");

      setTimeout(function () {
        if (game.level >= levels.length - 1) {
          game.win();
        } else {
          game.next();
        }
      }, 1000);
    });

    $(".edit").each(function () {
      $(this).on("keydown", function (e) {
        if (e.keyCode === 13) {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            game.check();
            $("#next").click();
            return;
          }

          var max = $(this).data("lines");
          var code = $(this).val();
          var trim = code.trim();
          var codeLength = code.split("\n").length;
          var trimLength = trim.split("\n").length;

          if (codeLength >= max) {
            if (codeLength === trimLength) {
              e.preventDefault();
              $("#next").click();
            } else {
              $("#code").focus().val("").val(trim);
            }
          }
        }
      });
      $(this).on("input", game.debounce(game.check, 500));
      $(this).on("input", function () {
        game.changed = true;
        $("#next").removeClass("animated animation").addClass("disabled");
      });
    });

    $("#editor").on(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      function () {
        $(this).removeClass();
      }
    );

    $("#labelReset").on("click", function () {
      var warningReset = messages.warningReset;
      var r = confirm(warningReset);

      if (r) {
        game.level = 0;
        game.solved = [];
        game.loadLevel(levels[0]);

        $(".level-marker").removeClass("solved");
      }
    });

    $("body").on("click", function () {
      $(".tooltip").hide();
    });

    $(".tooltip, .toggle, #level-indicator").on("click", function (e) {
      e.stopPropagation();
    });

    $(window).on("beforeunload", function () {
      localStorage.setItem("level", game.level);
    });
  },

  prev: function () {
    this.level--;

    var levelData = levels[this.level];
    this.loadLevel(levelData);
  },

  next: function () {
    if (this.difficulty === "hard") {
      this.level = Math.floor(Math.random() * levels.length);
    } else {
      this.level++;
    }

    var levelData = levels[this.level];
    this.loadLevel(levelData);
  },

  loadMenu: function () {
    levels.forEach(function (level, i) {
      var levelMarker = $("<span/>")
        .addClass("level-marker")
        .attr({ "data-level": i, title: level.name })
        .text(i + 1);

      if ($.inArray(level.name, game.solved) !== -1) {
        levelMarker.addClass("solved");
      }

      levelMarker.appendTo("#levels");
    });

    $(".level-marker").on("click", function () {
      var level = $(this).attr("data-level");
      game.level = parseInt(level, 10);
      game.loadLevel(levels[level]);
    });

    $("#level-indicator").on("click", function () {
      $("#settings .tooltip").hide();
      $("#levelsWrapper").toggle();
    });

    $(".arrow.left").on("click", function () {
      if ($(this).hasClass("disabled")) {
        return;
      }

      game.prev();
    });

    $(".arrow.right").on("click", function () {
      if ($(this).hasClass("disabled")) {
        return;
      }

      game.next();
    });
  },

  loadLevel: function (level) {
    $("#background, #field, #css")
      .removeClass("wrap")
      .attr("style", "")
      .empty();
    $("#levelsWrapper").hide();
    $(".level-marker")
      .removeClass("current")
      .eq(this.level)
      .addClass("current");
    $("#level-counter .current").text(this.level + 1);
    $("#next").removeClass("animated animation").addClass("disabled");

    var lineNumbers = $("<div/>").addClass("line-numbers");
    $("#css").append(lineNumbers);

    for (var i = 1; i <= 17; i++) {
      $(`<div>${i}</div>`).appendTo(lineNumbers);
    }

    var instructionsBefore = level.instructionsBefore;
    $("#instructions").html(instructionsBefore);

    var html = $("<div/>").attr("id", "html");
    $("#instructions").append(html);
    var instructionsHTML = level.instructionsHTML;
    $("#html").text(instructionsHTML);

    var instructionsAfter = level.instructionsAfter;
    $("#instructions").append(instructionsAfter);

    $(".arrow.disabled").removeClass("disabled");

    if (this.level === 0) {
      $(".arrow.left").addClass("disabled");
    }

    if (this.level === levels.length - 1) {
      $(".arrow.right").addClass("disabled");
    }

    var string = level.board;

    for (var i = 0; i < string.length; i++) {
      var c = string.charAt(i);
      var color = colors[c];

      var before = $("<div/>")
        .attr("id", "before")
        .addClass("before " + color)
        .data("color", color);
      $("#css").append(before);

      var styleEditor = $("<textarea/>")
        .attr("id", "code")
        .addClass("edit " + color)
        .data("color", color);
      $("#css").append(styleEditor);

      var after = $("<div/>")
        .attr("id", "after")
        .data("color", color)
        .text(level.after);
      $("#css").append(after);

      var flower = $("<div/>")
        .addClass("flower " + color)
        .data("color", color);
      var butterfly = $("<div/>")
        .addClass("butterfly " + color)
        .data("color", color);

      $("<div/>").addClass("bg").appendTo(flower);

      $("<div/>")
        .addClass("bg animated infinite")
        .css(game.transform())
        .appendTo(butterfly);

      $("#field").append(flower);

      // $("#field").append(butterfly);
    }

    var beforeText = level.before;
    for (var key in beforeText) {
      var c = key;
      var color = colors[c];
      $(".before").each(function () {
        if ($(this).data("color") === color) {
          $(`.before.${color}`).text(beforeText[c]);
        }
      });
    }

    var lines = 1;
    $(".edit")
      .height(20 * lines)
      .data("lines", lines);

    // var styles = level.style;
    // for (var key in styles) {
    //   var c = key;
    //   var color = colors[c];
    //   $(".flower").each(function () {
    //     if ($(this).data("color") === color) {
    //       $(`.flower.${color}`).css(styles[c]);
    //     }
    //   });
    // }

    // var classes = level.classes;

    // if (classes) {
    //   for (var rule in classes) {
    //     $(rule).addClass(classes[rule]);
    //   }
    // }

    game.changed = false;
    game.applyStyles();
    game.check();
  },

  applyStyles: function () {
    var level = levels[game.level];
    var string = level.board;

    for (var i = 0; i < string.length; i++) {
      var c = string.charAt(i);
      var color = colors[c];
      $(".edit").each(function () {
        if ($(this).data("color") === color) {
          var code = $(this).val();
          $(`.flower.${color}`).attr("style", code);
        }
      });
    }
  },

  check: function () {
    game.applyStyles();

    var level = levels[game.level];
    var pos = true;
    var top = true;
    var left = true;
    var correct = true;

    var positionSolutions = level.positionSolutions;
    for (var key in positionSolutions) {
      var c = key;
      var color = colors[c];
      $(".flower").each(function () {
        if (
          $(this).data("color") === color &&
          $(this).css("position") !== positionSolutions[c]
        ) {
          pos = false;
        }
      });
    }

    var topSolutions = level.topSolutions;
    for (var key in topSolutions) {
      var c = key;
      var color = colors[c];
      $(".flower").each(function () {
        if (
          $(this).data("color") === color &&
          $(this).css("top") !== topSolutions[c]
        ) {
          top = false;
        }
      });
    }

    var leftSolutions = level.leftSolutions;
    for (var key in leftSolutions) {
      var c = key;
      var color = colors[c];
      $(".flower").each(function () {
        if (
          $(this).data("color") === color &&
          $(this).css("left") !== leftSolutions[c]
        ) {
          left = false;
        }
      });
    }

    if (!pos || !top || !left) correct = false;

    if (correct) {
      ga("send", {
        hitType: "event",
        eventCategory: level.name,
        eventAction: "correct",
        eventLabel: $(".edit").val(),
      });

      // $(".butterfly .bg").addClass("pulse");

      if ($.inArray(level.name, game.solved) === -1) {
        game.solved.push(level.name);
      }

      $("[data-level=" + game.level + "]").addClass("solved");
      $("#next").removeClass("disabled").addClass("animated animation");
    } else {
      ga("send", {
        hitType: "event",
        eventCategory: level.name,
        eventAction: "incorrect",
        eventLabel: $(".edit").val(),
      });
    }
  },

  tryagain: function () {
    $("#editor").addClass("animated shake");
  },

  win: function () {
    var solution = $(".edit").val();

    this.loadLevel(levelWin);

    $("#editor").hide();
    $(".edit").val(solution);

    $(".butterfly .bg").removeClass("pulse").addClass("bounce");
  },

  transform: function () {
    var scale = 1 + (Math.random() / 5 - 0.2);
    var rotate = 90 * Math.random();

    return { transform: "scale(" + scale + ") rotate(" + rotate + "deg)" };
  },

  debounce: function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
};

$(document).ready(function () {
  game.start();
});
