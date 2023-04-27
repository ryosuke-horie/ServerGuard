const https = require('https');

/**
 * サーバー監視対象サイトのステータスをチェックする
 * @param url // 監視対象サイトのURL
 * @returns
 */
function browseWebsite(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve({
                    "success": true,
                    "message": "OK"
                });
            } else {
                console.log("There was an error in accessing this website. Error Code:" + res.statusCode);
                reject({
                    "success": false,
                    "message": "There was an error in accessing this website.",
                    "code": res.statusCode
                });
            }
        }).on('error', (err) => {
            console.log("There was an error in accessing this website.");
            reject({
                "success": false,
                "message": "There was an error in accessing this website.",
                "error": err
            });
        });
    });
}

// 監視が必要なサイトのリスト
const siteList = [
    'https://www.pachinkovista.com/pfactory/model_top.php',
    'https://www.operal.jp/login/index/',
    'https://www.fscorp.jp/',
    'https://www.j-net-gs.com/gsession/common/cmn001.do',
    'https://www.kenbaiki-pro.jp/',
]

function executeSiteListSequentially(siteList) {
    let promiseChain = Promise.resolve();
    siteList.forEach((site) => {
        promiseChain = promiseChain
            .then(() => browseWebsite(site))
            .then((result) => console.log(`Site ${site} check: ${result.message}`))
            .catch((error) => console.error(`Site ${site} check: ${error.message}`));
    });
}

executeSiteListSequentially(siteList);
