{
  /* <div id="editor">
        <div id="css">
          <div class="line-numbers">
            1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12<br />13<br />14<br />15<br />16<br />17<br />>
          </div>
          <pre id="before"></pre>
          <textarea id="code" autofocus autocapitalize="none"></textarea>
          <pre id="after"></pre>
        </div>
        <button id="next" class="translate">Next</button>
      </div> */
}

var colors = {
  c: "crimson",
  y: "yellow",
  b: "blue",
};

var game = {
  language: window.location.hash.substring(1) || "en",
  level: parseInt(localStorage.level, 10) || 0,
  answers: (localStorage.answers && JSON.parse(localStorage.answers)) || {},
  solved: (localStorage.solved && JSON.parse(localStorage.solved)) || [],
  user: localStorage.user || "",
  changed: false,

  start: function () {
    var requestLang = window.navigator.language.split("-")[0];
    if (
      window.location.hash === "" &&
      requestLang !== "en" &&
      messages.languageActive.hasOwnProperty(requestLang)
    ) {
      game.language = requestLang;
      window.location.hash = requestLang;
    }

    game.translate();
    $("#level-counter .total").text(levels.length);
    $("#editor").show();

    if (!localStorage.user) {
      game.user =
        "" + new Date().getTime() + Math.random().toString(36).slice(1);
      localStorage.setItem("user", game.user);
    }

    this.setHandlers();
    this.loadMenu();
    game.loadLevel(levels[game.level]);
  },

  setHandlers: function () {
    $("#next").on("click", function () {
      $("#code").focus();

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
      }, 2000);
    });

    $("#code")
      .on("keydown", function (e) {
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
      })
      .on("input", game.debounce(game.check, 500))
      .on("input", function () {
        game.changed = true;
        $("#next").removeClass("animated animation").addClass("disabled");
      });

    $("#editor").on(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      function () {
        $(this).removeClass();
      }
    );

    $("#labelReset").on("click", function () {
      var warningReset =
        messages.warningReset[game.language] || messages.warningReset.en;
      var r = confirm(warningReset);

      if (r) {
        game.level = 0;
        game.answers = {};
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
      game.saveAnswer();
      localStorage.setItem("level", game.level);
      localStorage.setItem("answers", JSON.stringify(game.answers));
      localStorage.setItem("solved", JSON.stringify(game.solved));
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
      game.saveAnswer();

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

      game.saveAnswer();
      game.prev();
    });

    $(".arrow.right").on("click", function () {
      if ($(this).hasClass("disabled")) {
        return;
      }

      game.saveAnswer();
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

    var instructions =
      level.instructions[game.language] || level.instructions.en;
    $("#instructions").html(instructions);

    $(".arrow.disabled").removeClass("disabled");

    if (this.level === 0) {
      $(".arrow.left").addClass("disabled");
    }

    if (this.level === levels.length - 1) {
      $(".arrow.right").addClass("disabled");
    }

    this.loadDocs();

    // var lines = Object.keys(level.style).length;
    // $("#code")
    //   .height(20 * lines)
    //   .data("lines", lines);

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

    var styles = level.style;
    for (var key in styles) {
      var c = key;
      var color = colors[c];
      $(".flower").each(function () {
        if ($(this).data("color") === color) {
          $(`.flower.${color}`).css(styles[c]);
        }
      });
    }

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

  loadDocs: function () {
    $("#instructions code").each(function () {
      var code = $(this);
      var text = code.text();

      if (text in docs) {
        code.addClass("help");
        code
          .on("mouseenter", function (e) {
            if ($("#instructions .tooltip").length === 0) {
              var html = docs[text][game.language] || docs[text].en;
              var tooltipX = code.offset().left;
              var tooltipY = code.offset().top + code.height() + 13;
              $('<div class="tooltip"></div>')
                .html(html)
                .css({ top: tooltipY, left: tooltipX })
                .appendTo($("#instructions"));
            }
          })
          .on("mouseleave", function () {
            $("#instructions .tooltip").remove();
          });
      }
    });
  },

  applyStyles: function () {
    var level = levels[game.level];
    var string = level.board;

    for (var i = 0; i < string.length; i++) {
      var c = string.charAt(i);
      var color = colors[c];
      $(".edit").each(function () {
        if ($(this).data("color") === color) {
          var code = $(".edit").val();
          $(`.flower.${color}`).attr("style", code);
        }
      });
    }
    game.saveAnswer();
  },

  check: function () {
    game.applyStyles();

    var level = levels[game.level];

    var flowers = {};
    var butterflies = {};
    var correct = false;

    var value = $("#code").val();
    var solutions = level.possibleSolutions;
    for (var solution in solutions) {
      if (value.trim() === solutions[solution]) {
        correct = true;
      }
    }

    if (correct) {
      ga("send", {
        hitType: "event",
        eventCategory: level.name,
        eventAction: "correct",
        eventLabel: $("#code").val(),
      });

      $(".butterfly .bg").addClass("pulse");

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
        eventLabel: $("#code").val(),
      });
    }
  },

  saveAnswer: function () {
    var level = levels[this.level];
    game.answers[level.name] = $("#code").val();
  },

  tryagain: function () {
    $("#editor").addClass("animated shake");
  },

  win: function () {
    var solution = $("#code").val();

    this.loadLevel(levelWin);

    $("#editor").hide();
    $("#code").val(solution);

    $(".butterfly .bg").removeClass("pulse").addClass("bounce");
  },

  transform: function () {
    var scale = 1 + (Math.random() / 5 - 0.2);
    var rotate = 90 * Math.random();

    return { transform: "scale(" + scale + ") rotate(" + rotate + "deg)" };
  },

  translate: function () {
    document.title = messages.title[game.language] || messages.title.en;
    $("html").attr("lang", game.language);

    var level = $("#editor").is(":visible") ? levels[game.level] : levelWin;
    var instructions =
      level.instructions[game.language] || level.instructions.en;
    $("#instructions").html(instructions);
    game.loadDocs();

    $(".translate").each(function () {
      var label = $(this).attr("id");
      if (messages[label]) {
        var text = messages[label][game.language] || messages[label].en;
      }

      $("#" + label).text(text);
    });
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
