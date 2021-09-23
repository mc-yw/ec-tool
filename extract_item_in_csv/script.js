// const fs = require('fs');
const csv = require('csv');
const iconv = require('iconv-lite');
const csvtojson = require('csvtojson');
const {Parser} = require('json2csv');
const dialog = require('electron').remote.dialog;


// CSVファイル選択のダイアログを開く
const btnCeFileSelect = document.getElementById('btn_ce-fileSelect');
const celectdFile = document.getElementById('ce-selectedFile');

btnCeFileSelect.addEventListener('click', openFileDialog, false);
function openFileDialog() {
  let filename = dialog.showOpenDialogSync(null, {
      properties: ['openFile'],
      title: 'Select a csv file',
      defaultPath: '.',
      filters: [
          {name: 'csv file', extensions: ['csv']}
      ]
  });
  console.log(filename);
  celectdFile.innerHTML = filename;
  // return filename;
}

/**
 * main
 */
const main = async () => {
  const parse = (path) => {
    return new Promise((resolve, reject) => {
      let datas = []
      fs.createReadStream(path)
        .pipe(iconv.decodeStream('Shift_JIS'))
        .pipe(iconv.encodeStream('utf-8'))
        .pipe(csvtojson().on('data', data => datas.push(JSON.parse(data)))) // 各行読んだらココが呼ばれるので配列にpush
        .on('end', () => resolve(datas)) // 全部終わったらココにくるので、resolveする
    })
  }

  // if (!module) {
    // 呼んでみる
    const filePath = celectdFile.innerHTML;
    parse(filePath).then((results) => {

      // 抽出したい商品番号のリストをテキストエリアから取り出し、配列に格納する
      const search_number = document.getElementById('ce_search_number').value;
      const search_number_array = search_number.split('\n');

      let newItemList = [];

      // 以下で検索処理を行う。結果はJSONで返る
      const searchedEle = results.filter(function(item, index){
        for (i = 0; i < search_number_array.length; i++) {
          if (search_number_array[i] == item['商品管理番号（商品URL）']){
            newItemList.push(item);
            // console.log(search_number_array[i])
            // console.log(item)
          } else if (search_number_array[i] == item['code']) {
            newItemList.push(item);
          }
        };
      })
      
      // 検索で絞り込んだJSONをCSVに戻す
      const parser = new Parser();
      const csv2 = parser.parse(newItemList);
      // 「UTF-8」を「Shift＿JIS」に改めて変換する
      const csv2_shiftJIS = iconv.encode( csv2 , "Shift_JIS" );

      // CSVファイルを書き出す
      try {
        const currentDateTime = new Date();
        const currentDateTime_str = currentDateTime.getFullYear().toString()+'-'+
                                    ('0'+(currentDateTime.getMonth()+1)).slice(-2).toString()+
                                    ('0'+currentDateTime.getDate()).slice(-2).toString()+'-'+
                                    currentDateTime.getHours().toString()+
                                    currentDateTime.getMinutes().toString()+
                                    ('0'+currentDateTime.getSeconds()).slice(-2).toString()+'_';

        fs.writeFileSync('output/csv/'+currentDateTime_str+'item.csv', csv2_shiftJIS);
        console.log('write end');
      }catch(e){
        console.log(e);
      }

    })
  // };
};

const btnCeExe = document.getElementById('btn_ce-exe');
btnCeExe.addEventListener('click', main, false);

