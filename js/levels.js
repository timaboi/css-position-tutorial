var levels = [
  {
    name: "1",
    instructionsBefore:
      "<p>Добро пожаловать в игру Position. В игру, которая поможет вам понять суть позиционирования в CSS. Рассмотрим 5 типов позиционирования: static, relative, absolute, fixed и sticky.</p> <p>По умолчанию все элементы обладают статическим позиционированием, свойства top, right, bottom, left (координаты блока) и z-index ( определение по оси Z) не применяются к таким элементам.</p> <p>Расположим  три цветка вертикально. Для этого в HTML добавим:</p>",
    instructionsHTML:
      "<div class='flower'></div>\n<div class='flower'></div>\n<div class='flower'></div>",
    instructionsAfter:
      "<p>В CSS можно добавить для цветов статическое позиционирование, (position: static):</p>",
    board: "bry",
    positionSolutions: {
      b: "relative",
      y: "relative",
      r: "relative",
    },

    topSolutions: {
      b: "100px",
      y: "50px",
      r: "30px",
    },

    leftSolutions: {
      b: "50px",
      y: "100px",
      r: "200px",
    },

    before: {
      b: ".flower.blue {",
      y: ".flower.yellow {",
      r: ".flower.red {",
    },
    after: "}",
  },
  {
    name: "2",
    instructionsBefore:
      "<p>Относительно позиционированные элементы (position: relative;) смещаются на величину, задаваемую координатами (top, right, bottom, и left) относительно своего обычного местоположения.</p><p>top: определяет вертикальную позицию позиционируемого элемента, начиная от верхнего края.</p><p>right: определяет горизонтальную позицию позиционируемого элемента, начиная от правого края.</p><p>bottom: определяет вертикальную позицию позиционируемого элемента, начиная от нижнего края.</p><p>left: определяет горизонтальную позицию позиционируемого элемента, начиная от левого края.</p><p>Посмотрите на цветы. Их код в HTML:</p>",
    instructionsHTML:
      "<div class='flower blue'></div>\n<div class='flower red'></div>\n<div class='flower blue'></div>",
    instructionsAfter:
      "<p>Сместим красный цветок вправо на одну клетку ( размеры клетки – 100*100 пикселей). Для этого укажем цветку относительное позиционирование (position: relative;) и пропишем координату смещения ( left: 100px;)</p>",
    board: "brb",
    before: {
      b: ".flower.blue {",
      y: ".flower.yellow {",
      r: ".flower.red {",
    },
    positionSolutions: {
      r: "relative",
    },

    leftSolutions: {
      r: "100px",
    },
    after: "}",
  },
  {
    name: "3",
    instructionsBefore:
      "<p>Особое внимание при относительном позиционировании следует обратить на координаты смещения. При относительном позиционировании работает только одна координата горизонтального смещения: left или right, а при вертикальном смещении: top или bottom.</p><p>Используя относительное позиционирование (position: relative), помогите распределить цветы на поле: синий разместить в крайней левой клетке, красный сместить на две клетки влево, а желтый на две клетки вверх.</p><p>Напоминаем, что размер одного квадрата равен 100*100 пикселей.</p><p>Код цветов в HTML:</p>",
    instructionsHTML:
      "<div class='flower blue'></div>\n<div class='flower red'></div>\n<div class='flower yellow'></div>",
    instructionsAfter:
      "<p>В CSS можно добавить для цветов статическое позиционирование, (position: static):</p>",
    board: "bry",
    before: {
      b: ".flower.blue {",
      y: ".flower.yellow {",
      r: ".flower.red {",
    },
    positionSolutions: {
      b: "relative",
      y: "relative",
      r: "relative",
    },

    topSolutions: {
      y: "-200px",
    },

    leftSolutions: {
      b: "300px",
      r: "200px",
    },
    after: "}",
  },
  {
    name: "4",
    instructionsBefore:
      "<p>Добро пожаловать в игру Position. В игру, которая поможет вам понять суть позиционирования в CSS. Рассмотрим 5 типов позиционирования: static, relative, absolute, fixed и sticky.</p> <p>По умолчанию все элементы обладают статическим позиционированием, свойства top, right, bottom, left (координаты блока) и z-index ( определение по оси Z) не применяются к таким элементам.</p> <p>Расположим  три цветка вертикально. Для этого в HTML добавим:</p>",
    instructionsHTML:
      "<div class='flower'></div>\n<div class='flower'></div>\n<div class='flower'></div>",
    instructionsAfter:
      "<p>В CSS можно добавить для цветов статическое позиционирование, (position: static):</p>",
    board: "byr",
    before: {
      b: ".flower.blue {",
      y: ".flower.yellow {",
      r: ".flower.red {",
    },
    after: "}",
  },
];
