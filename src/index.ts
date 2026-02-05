import http from 'node:http';
import { hello } from '#hello';
import moment from 'moment';

const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    // res.write(hello())
    // res.write(`\nWaktu saat ini: ${moment().format('YYYY-MM-DD HH:mm:ss')}`)
    // res.end(JSON.stringify({
    //     message: hello(),
    //     time: moment().format('YYYY-MM-DD HH:mm:ss'),
    //     url: req.url
    // }))

    if (req.url === '/') {
        res.end(JSON.stringify({
            message: hello(),
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            url: req.url
        }))
    } else if (req.url === '/time') {
        res.end(JSON.stringify({
            message: "You are accessing endpoint /time",
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            url: req.url,
        }))
    } else {
        res.statusCode = 404
        res.write(JSON.stringify({
            message: "You are accessing endpoint that not found",
            url: req.url,
        }))
        res.end()
    }
}

const server = http.createServer(requestListener)

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/')
})