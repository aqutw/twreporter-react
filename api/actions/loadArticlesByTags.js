import superAgent from 'superagent'
import qs from 'qs'
import config from '../constants'

export default function loadArticlesByTags(req) {
  return new Promise((resolve, reject) => {
    const query = req.query
    let params = qs.parse(query)
    const { API_PROTOCOL, API_HOST, API_PATH } = config
    const url = API_PROTOCOL + '://' + API_HOST + API_PATH + '/tags'

    superAgent['post'](url)
    .timeout(500)
    .send(params)
    .end( function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res.body)
      }
    })
  })
}
