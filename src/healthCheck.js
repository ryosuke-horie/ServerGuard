// HTTPヘルスチェック

const https = require('https');

/**
 * 監視対象のウェブサイトのHTTPステータスをチェックする関数
 * @param {string} url 監視するURL
 * @param {number} timeout HTTP接続タイムアウト
 * @returns {Promise<object>} HTTPステータスコードの情報が組み込まれたPromiseオブジェクト
 */
function browseWebsite(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'HEAD',
            timeout,
        };
        https
            .request(url, options, (res) => {
                const { statusCode } = res;
                resolve({
                    success: statusCode >= 200 && statusCode < 300,
                    statusCode,
                });
            })
            .on('error', (err) => {
                reject({
                    success: false,
                    statusCode: 0,
                    error: err,
                });
            })
            .end();
    });
}

// サーバー監視対象のURLリスト
const siteList = [
    'https://www.pachinkovista.com/pfactory/model_top.php', // パチンコビスタ
    'https://www.operal.jp/login/index/',                   // 券売機
    'https://www.fscorp.jp/',                               // エフエス
    'https://www.j-net-gs.com/gsession/common/cmn001.do',   // グループセッション
    'https://www.kenbaiki-pro.jp/',                         // 券売機プロ
];

/**
 * サイトリストを順番に処理する関数
 * @param {string[]} siteList 監視するURLの配列
 * @returns {Promise<object[]>} 各サイトの結果が含まれたPromiseオブジェクト
 */
function executeSiteListSequentially(siteList) {
    const promiseArray = siteList.map((site) => {
        return browseWebsite(site)
            .then((result) => {
                console.log(`Site ${site} check: ${result.success ? 'OK' : 'Error'}`);
                return result;
            })
            .catch((error) => {
                console.error(`Site ${site} check: ${error.error ? error.error.message : error.message}`);
                return error;
            });
    });

    return Promise.all(promiseArray);
}

// 実行
executeSiteListSequentially(siteList).then((result) => {
    console.log('All sites checked.');
    console.log(result);
})

