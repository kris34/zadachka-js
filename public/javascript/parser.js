const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const Channel = require('../../models/channelModel');

async function parse(path) {
  try {
    const data = await readFileAsync(path, 'utf-8');
    const arr = data.split('\n');

    const parser = new Parser(arr);
    const storage = parser.storager();

    for (let item of storage) {
      await Channel.create(item);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

class Parser {
  constructor(arr) {
    this.arr = arr;
    this.transliterationMap = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      ё: 'yo',
      ж: 'zh',
      з: 'z',
      и: 'i',
      й: 'y',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'kh',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'sch',
      ъ: '',
      ы: 'y',
      ь: '',
      э: 'e',
      ю: 'yu',
      я: 'ya',
      А: 'A',
      Б: 'B',
      В: 'V',
      Г: 'G',
      Д: 'D',
      Е: 'E',
      Ё: 'Yo',
      Ж: 'Zh',
      З: 'Z',
      И: 'I',
      Й: 'Y',
      К: 'K',
      Л: 'L',
      М: 'M',
      Н: 'N',
      О: 'O',
      П: 'P',
      Р: 'R',
      С: 'S',
      Т: 'T',
      У: 'U',
      Ф: 'F',
      Х: 'Kh',
      Ц: 'Ts',
      Ч: 'Ch',
      Ш: 'Sh',
      Щ: 'Sch',
      Ъ: '',
      Ы: 'Y',
      Ь: '',
      Э: 'E',
      Ю: 'Yu',
      Я: 'Ya',
    };
  }

  storager() {
    const arr = this.arr;

    const storage = [];

    for (let i = 1; i < arr.length; i++) {
      if (!arr[i].startsWith('#')) {
        continue;
      }

      const splitted = arr[i].split(',');
      const additionalArr = splitted[0].slice(10).split('"');
      const additional = this.additional(additionalArr);

      if(additional.tvgId == ''){ 
        additional.tvgId = 'Not provided!'
      }

      if(additional.groupTitle == ''){ 
        additional.groupTitle = 'Not provided!'
      }

      if (splitted[0].length == 8) {
        continue;
      }

      const duration = splitted[0].slice(8, 10);

      if (splitted[1].length > 100) {
        splitted[1] = 'Name unavailable!';
      }

      const transliterated = this.transliterate(splitted[1]);

      storage.push({
        name: transliterated,
        duration: duration,
        URL: arr[i + 1],
        tvgId: additional.tvgId,
        groupTitle: additional.groupTitle,
      });
    }

    return storage;
  }

  transliterate(text) {
    const chars = text.split('');

    const transliteratedText = chars.map((char) => {
      const transliteratedChar = this.transliterationMap[char] || char;
      return transliteratedChar;
    });

    return transliteratedText.join('');
  }

  additional(arr) {
    const obj = {
      tvgId: '',
      groupTitle: '',
    };

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == ' tvg-id=') {
        obj.tvgId = arr[i + 1];
      } else if (arr[i] == ' group-title=') {
        obj.groupTitle = this.transliterate(arr[i + 1]);
      }
    }
    return obj;
  }
}

module.exports = parse;
