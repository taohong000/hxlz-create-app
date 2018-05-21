/*
* @Author: taohong
* @Date:   2018-05-17 16:15:27
* @Last Modified by:   taohong
* @Last Modified time: 2018-05-18 11:18:14
*/
const download = require('download-git-repo')
const path = require('path')

module.exports = function (target, repo) {
  target = path.join(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    download(repo,
        target, { clone: true }, (err) => {
      if (err) {
        reject(err)
      } else {
        // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
        resolve(path.resolve(process.cwd(), target))
      }
    })
  })
}
