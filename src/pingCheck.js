// ping監視
const { spawn } = require('child_process');

/**
 * IPアドレスのリストを使ってpingを送信する関数
 * @param {string[]} ipList 監視するIPアドレスの配列
 * @returns {Promise<boolean[]>} すべてのIPアドレスがpingに応答している場合trueを返すPromiseオブジェクト
 */
function pingIpAddress(ipList) {
    const promises = ipList.map((ip) => {
        return new Promise((resolve, reject) => {
            const ping = spawn('ping', [ip, '-t', '5']);

            ping.on('close', (code) => {
                if (code === 0) {
                    resolve(true);
                } else {
                    reject(new Error(`Ping failed on IP address ${ip} with code ${code}`));
                }
            });
        });
    });

    return Promise.all(promises);
}

// TODO:追加
const ipList = [
    '221.186.158.81', // パチンコビスタ
    '52.68.221.182',  // 券売機
];

/**
 * すべてのIPアドレスがpingに応答しているかチェックする関数
 */
async function checkAllIpAddresses() {
    try {
        const results = await pingIpAddress(ipList);
        const allSuccess = results.every((result) => result === true);
        if (allSuccess) {
            console.log('All IP addresses have responded to ping');
        } else {
            console.log('Some IP addresses did not respond to ping');
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 実行
checkAllIpAddresses();

