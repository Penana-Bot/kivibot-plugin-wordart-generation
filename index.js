const axios = require('axios').default;
const { KiviPlugin, segment } = require('@kivibot/core')
const plugin = new KiviPlugin('艺术字生成', '1.0.2')
const fs = require('fs');
const { escape } = require('querystring');

function 文本取中间(文本内容, 关键字A, 关键字B) {
    var str = 文本内容;
    var aPos = str.indexOf(关键字A);
    var bPos = str.indexOf(关键字B, aPos + 关键字A.length);
    var retstr = str.substr(aPos + 关键字A.length, 文本内容.length - (aPos + 关键字A.length) - (文本内容.length - bPos));
    return retstr;

}
plugin.onMounted((bot, admins) => {
    plugin.onMessage(event => {
        const message = event.raw_message;
        if (message.includes("艺术字 ")) {
            var key = 文本取中间(message + "||", "艺术字 ", "||");
            if (key == "") {
                key = "参数错误";
            }
            axios.post('http://www.yishuzi.com/make.php?file=g&page=50', "id=" + key + "&zhenbi=20191123&id2=5&id3=9&id4=803&id1=" + 文本取中间(message + "||", key + " ", "||"))
                .then(function(response) {
                    var uri = response.data.zhenbi[0].info[0]
                    axios.get(uri, {
                            responseType: 'arraybuffer',
                        })
                        .then(function(response) {
                            fs.writeFileSync(__dirname + "\\test.gif", response.data);
                            event.reply([
                                segment.image(__dirname + "\\test.gif"),
                            ]);
                        })
                        .catch(function(error) {
                            event.reply(error)
                        })
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    })

})
module.exports = { plugin };