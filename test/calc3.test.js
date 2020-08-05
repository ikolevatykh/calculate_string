'use strict';
const fs = require('fs');
const lodash = require('lodash');
require('expect-puppeteer');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;

beforeAll(async () => {
  await page.goto('http://localhost:5000/');
});

// afterEach(() => {
//
// });

const strs = [
  `"Cwm fjord bank glyphs vext quiz": Amazingly, this 26-word-long sentence uses every letter only once, though it uses some pretty archaic words; translates to "Carved symbols in a mountain hollow on the bank of an inlet irritated an eccentric person."`,
  '”How razorback-jumping frogs can level six piqued gymnasts!”: Not going to win any brevity awards at 49 letters long, but old-time Mac users may recognize it.',
  'Sphinx of black quartz, judge my vow',
  // basic latin
  `! " # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _ \` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~`,
  // Latin-1 Supplement
  `¡ ¢ £ ¤ ¥ ¦ § ¨ © ª « ¬ ­ ® ¯ ° ± ² ³ ´ µ ¶ · ¸ ¹ º » ¼ ½ ¾ ¿ À Á Â Ã Ä Å Æ Ç È É Ê Ë Ì Í Î Ï Ð Ñ Ò Ó Ô Õ Ö × Ø Ù Ú Û Ü Ý Þ ß à á â ã ä å æ ç è é ê ë ì í î ï ð ñ ò ó ô õ ö ÷ ø ù ú û ü ý þ ÿ`,
  // Latin Extended-A
  `Ā ā Ă ă Ą ą Ć ć Ĉ ĉ Ċ ċ Č č Ď ď Đ đ Ē ē Ĕ ĕ Ė ė Ę ę Ě ě Ĝ ĝ Ğ ğ Ġ ġ Ģ ģ Ĥ ĥ Ħ ħ Ĩ ĩ Ī ī Ĭ ĭ Į į İ ı Ĳ ĳ Ĵ ĵ Ķ ķ ĸ Ĺ ĺ Ļ ļ Ľ ľ Ŀ ŀ Ł ł Ń ń Ņ ņ Ň ň ŉ Ŋ ŋ Ō ō Ŏ ŏ Ő ő Œ œ Ŕ ŕ Ŗ ŗ Ř ř Ś ś Ŝ ŝ Ş ş Š š Ţ ţ Ť ť Ŧ ŧ Ũ ũ Ū ū Ŭ ŭ Ů ů Ű ű Ų ų Ŵ ŵ Ŷ ŷ Ÿ Ź ź Ż ż Ž ž ſ`,
  // Latin Extended-B
  `ƀ Ɓ Ƃ ƃ Ƅ ƅ Ɔ Ƈ ƈ Ɖ Ɗ Ƌ ƌ ƍ Ǝ Ə Ɛ Ƒ ƒ Ɠ Ɣ ƕ Ɩ Ɨ Ƙ ƙ ƚ ƛ Ɯ Ɲ ƞ Ɵ Ơ ơ Ƣ ƣ Ƥ ƥ Ʀ Ƨ ƨ Ʃ ƪ ƫ Ƭ ƭ Ʈ Ư ư Ʊ Ʋ Ƴ ƴ Ƶ ƶ Ʒ Ƹ ƹ ƺ ƻ Ƽ ƽ ƾ ƿ ǀ ǁ ǂ ǃ Ǆ ǅ ǆ Ǉ ǈ ǉ Ǌ ǋ ǌ Ǎ ǎ Ǐ ǐ Ǒ ǒ Ǔ ǔ Ǖ ǖ Ǘ ǘ Ǚ ǚ Ǜ ǜ ǝ Ǟ ǟ Ǡ ǡ Ǣ ǣ Ǥ ǥ Ǧ ǧ Ǩ ǩ Ǫ ǫ Ǭ ǭ Ǯ ǯ ǰ Ǳ ǲ ǳ Ǵ ǵ Ǻ ǻ Ǽ ǽ Ǿ ǿ Ȁ ȁ Ȃ ȃ ...`,
  // IPA Extensions
  `ɐ ɑ ɒ ɓ ɔ ɕ ɖ ɗ ɘ ə ɚ ɛ ɜ ɝ ɞ ɟ ɠ ɡ ɢ ɣ ɤ ɥ ɦ ɧ ɨ ɩ ɪ ɫ ɬ ɭ ɮ ɯ ɰ ɱ ɲ ɳ ɴ ɵ ɶ ɷ ɸ ɹ ɺ ɻ ɼ ɽ ɾ ɿ ʀ ʁ ʂ ʃ ʄ ʅ ʆ ʇ ʈ ʉ ʊ ʋ ʌ ʍ ʎ ʏ ʐ ʑ ʒ ʓ ʔ ʕ ʖ ʗ ʘ ʙ ʚ ʛ ʜ ʝ ʞ ʟ ʠ ʡ ʢ ʣ ʤ ʥ ʦ ʧ ʨ`,
  // Greek
  `ʹ ͵ ͺ ; ΄ ΅ Ά · Έ Ή Ί Ό Ύ Ώ ΐ Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω Ϊ Ϋ ά έ ή ί ΰ α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω ϊ ϋ ό ύ ώ ϐ ϑ ϒ ϓ ϔ ϕ ϖ Ϛ Ϝ Ϟ Ϡ Ϣ ϣ Ϥ ϥ Ϧ ϧ Ϩ ϩ Ϫ ϫ Ϭ ϭ Ϯ ϯ ϰ ϱ ϲ ϳ`,
  // Cyrillic
  `Ё Ђ Ѓ Є Ѕ І Ї Ј Љ Њ Ћ Ќ Ў Џ А Б В Г Д Е Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я а б в г д е ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я ё ђ ѓ є ѕ і ї ј љ њ ћ ќ ў џ Ѡ ѡ Ѣ ѣ Ѥ ѥ Ѧ ѧ Ѩ ѩ Ѫ ѫ Ѭ ѭ Ѯ ѯ Ѱ ѱ Ѳ ѳ Ѵ ѵ Ѷ ѷ Ѹ ѹ Ѻ ѻ Ѽ ѽ Ѿ ѿ Ҁ ҁ ҂ ҃ ...`,
  // Latin Extended Additional
  `Ḁ ḁ Ḃ ḃ Ḅ ḅ Ḇ ḇ Ḉ ḉ Ḋ ḋ Ḍ ḍ Ḏ ḏ Ḑ ḑ Ḓ ḓ Ḕ ḕ Ḗ ḗ Ḙ ḙ Ḛ ḛ Ḝ ḝ Ḟ ḟ Ḡ ḡ Ḣ ḣ Ḥ ḥ Ḧ ḧ Ḩ ḩ Ḫ ḫ Ḭ ḭ Ḯ ḯ Ḱ ḱ Ḳ ḳ Ḵ ḵ Ḷ ḷ Ḹ ḹ Ḻ ḻ Ḽ ḽ Ḿ ḿ Ṁ ṁ Ṃ ṃ Ṅ ṅ Ṇ ṇ Ṉ ṉ Ṋ ṋ Ṍ ṍ Ṏ ṏ Ṑ ṑ Ṓ ṓ Ṕ ṕ Ṗ ṗ Ṙ ṙ Ṛ ṛ Ṝ ṝ Ṟ ṟ Ṡ ṡ Ṣ ṣ Ṥ ṥ Ṧ ṧ Ṩ ṩ Ṫ ṫ Ṭ ṭ Ṯ ṯ Ṱ ṱ Ṳ ṳ Ṵ ṵ Ṷ ṷ Ṹ ṹ Ṻ ṻ Ṽ ṽ Ṿ ṿ ...`,
  //  Greek Extended
  `ἀ ἁ ἂ ἃ ἄ ἅ ἆ ἇ Ἀ Ἁ Ἂ Ἃ Ἄ Ἅ Ἆ Ἇ ἐ ἑ ἒ ἓ ἔ ἕ Ἐ Ἑ Ἒ Ἓ Ἔ Ἕ ἠ ἡ ἢ ἣ ἤ ἥ ἦ ἧ Ἠ Ἡ Ἢ Ἣ Ἤ Ἥ Ἦ Ἧ ἰ ἱ ἲ ἳ ἴ ἵ ἶ ἷ Ἰ Ἱ Ἲ Ἳ Ἴ Ἵ Ἶ Ἷ ὀ ὁ ὂ ὃ ὄ ὅ Ὀ Ὁ Ὂ Ὃ Ὄ Ὅ ὐ ὑ ὒ ὓ ὔ ὕ ὖ ὗ Ὑ Ὓ Ὕ Ὗ ὠ ὡ ὢ ὣ ὤ ὥ ὦ ὧ Ὠ Ὡ Ὢ Ὣ Ὤ Ὥ Ὦ Ὧ ὰ ά ὲ έ ὴ ή ὶ ί ὸ ό ὺ ύ ὼ ώ ᾀ ᾁ ᾂ ᾃ ᾄ ᾅ ᾆ ᾇ ᾈ ᾉ ᾊ ᾋ ᾌ ᾍ ...`,
];

const config = {
  width: [100],//lodash.range(100, 101, 1),
  height: 400,
  fontSize: lodash.range(8, 14, 2),
  fontFamily: [
    'Times New Roman',
    'sans-serif',
    'Arial',
    'Arial Black',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Impact',
    'Trebuchet MS',
    'Verdana',
  ],
  fontWeight: [
    'normal',
    'bold',
  ],
  fontStyle: [
    'normal',
    // 'italic',
  ],
  textDecoration: [
    'none',
    // 'underline'
  ],
}
const defOptions = {
  style: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  }
};

// const str = `يولد جميع الناس أحرارًا متساوين في الكرامة والحقوق. وقد وهبوا عقلاً وضميرًا وعليهم أن يعامل بعضهم بعضًا بروح الإخاء.`;
// const str = `
// ₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯2
// 0B0₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿
//
// ℀℁ℂ℃℄℅℆ℇ℈℉ℊℋℌℍℎℏ2110ℐℑℒℓ℔ℕ№℗℘ℙℚℛℜℝ℞℟2120℠℡™℣ℤ℥Ω℧ℨ℩KÅ
// ℬℭ℮ℯ2130ℰℱℲℳℴℵℶℷℸℹ℺℻ℼℽℾℿ2140⅀⅁⅂⅃⅄ⅅⅆⅇⅈⅉ⅊⅋⅌⅍ⅎ⅏2150⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟2160ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯ2170ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻⅼⅽⅾⅿ
// `;

const cases = (() => {
  const result = [];
  let index = 0;
  // Грязно, но зато - быстро
  // Для корректного алгоритма нужно глянуть на гусеничный граф (дерево))
  for (let a = 0; a < config.width.length; a += 1) {
    for (let b = 0; b < config.fontSize.length; b += 1) {
      for (let c = 0; c < config.fontFamily.length; c += 1) {
        for (let d = 0; d < config.fontWeight.length; d += 1) {
          for (let e = 0; e < config.fontStyle.length; e += 1) {
            for (let f = 0; f < config.textDecoration.length; f += 1) {
              for (let g = 0; g < strs.length; g += 1) {
                result.push([{
                  index,
                  params: [a, b, c, d, e, f, g],
                }, 0, 0]);
                index += 1;
              }
            }
          }
        }
      }
    }
  }

  return result;
})();

const COUNT = cases.length;
let errorCounts = 0;
console.log(`test cases: ${COUNT}`);

describe(`test cases: ${COUNT}`, () => {
  const startTime = Date.now();

  test.each(cases)(
    "test",
    async (firstArg, secondArg, expectedResult) => {
      // debugger;
      const { params, index } = firstArg;
      if (index % 10 === 0) {
        const currentTime = Date.now();
        const leaveSec = Math.floor((currentTime - startTime) / 1000);
        const speed = index / leaveSec * 60;
        const estimateTimeMin = (COUNT - index) / speed;
        const estimateTimeHours = Math.floor(estimateTimeMin / 60).toFixed(1);

        const str = `
        count: ${index}
        leave (s): ${leaveSec} seconds
        leave (%): ${(index / COUNT * 100).toFixed(4)}%
        speed, items per minutes:  ${speed.toFixed(2)}
        estimate time, minutes: ${estimateTimeMin.toFixed(2)}
        estimate time, hours: ${estimateTimeHours}
        errorCounts: ${errorCounts}
        `;
        console.log(str);
      }

      const style = {
        ...defOptions.style,
        height: `${config.height}px`,
        width: `${config.width[params[0]]}px`,
        fontSize: `${config.fontSize[params[1]]}px`,
        fontFamily: config.fontFamily[params[2]],
        fontWeight: config.fontWeight[params[3]],
        fontStyle: config.fontStyle[params[4]],
        textDecoration: config.textDecoration[params[5]],
      }
      const options = { ...defOptions, style };
      const width = config.width[params[0]];
      const str = lodash.shuffle(strs[params[6]] + '\n\n\n\n\n\n\n\n').join('');

      await page.evaluate((...args) => window.run(...args), str, options);
      const png1 = await page.screenshot({
        type: 'png',
        encoding: 'binary',
        clip: {
          width: width + 5,
          x: 0,
          y: 0,
          height: config.height,
        }
      });

      const png2 = await page.screenshot({
        type: 'png',
        encoding: 'binary',
        clip: {
          width: width + 5,
          x: width + 10,
          y: 0,
          height: config.height,
        }
      });

      const img1 = PNG.sync.read(png1);
      const img2 = PNG.sync.read(png2);

      // смещение для шрифтов, которые вылазят за границу
      const SHIFT = 5;
      let diff;
      try {
        // threshold: точность. Ставим минимальную, начертание немного меняется при ручном переносе.
        diff = pixelmatch(img1.data, img2.data, null, width + SHIFT, config.height, {threshold: 1});
      } catch (e) {
        const png3 = await page.screenshot({
          type: 'png',
          encoding: 'binary',
          clip: {
            width: 800,
            x: 0,
            y: 0,
            height: 800,
          }
        });

        fs.writeFileSync('test/screenshots/img1.png', png1);
        fs.writeFileSync('test/screenshots/img2.png', png2);
        fs.writeFileSync('test/screenshots/img3.png', png3);
        console.log('make screenshot error');
        process.exit(-1);
      }

      if (diff > 0) {
        fs.writeFileSync(`test/screenshots/img${index}-0.png`, png1);
        fs.writeFileSync(`test/screenshots/img${index}-1.png`, png2);
        console.log('error value', params);
        console.log('error style', style);
        errorCounts += 1;
      }

      expect(0).toBe(diff);
    }
  );
});
