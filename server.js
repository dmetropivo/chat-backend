const Websocket = require('ws')

const chatsList = [
    {
        name: 'First chat',
        id: 123,
        history: [],
    },
    {
        name: 'Second chat',
        id: 543534534,
        history: [],
    },
    {
        name: 'Third chat',
        id: 111,
        history: [],
    },
    {
        name: 'Fourth chat',
        id: 154545,
        history: [],
    },
]

const chatsState = {
    123: {
        name: 'First chat',
        id: 123,
        history: [],
    },
    543534534: {
        name: 'Second chat',
        id: 543534534,
        history: [],
    },
    111: {
        name: 'Third chat',
        id: 111,
        history: [],
    },
    154545: {
        name: 'Fourth chat',
        id: 154545,
        history: [],
    },
}

const wss = new Websocket.Server({ port: 4000 })

// const heartBeatTime = 50000

const chatsHistory = {

}


wss.on('connection', function (ws) {
    ws.isAlive = true
    const newChatList = chatsList?.map((item) => {
        return {
            name: item.name,
            id: item.id,
            history: chatsState[item.id].history.slice(-10),
        }
    })

    ws.send(JSON.stringify(
        {
            data: newChatList,
            event: 'getChats',
        }
    ))

    ws.on('message', function (message) {
        const data = JSON.parse(message.toString())

        chatsState[data.chatID].history.push({message: data.message, name: data.name})

        wss.clients.forEach(client => {
            if (client.readyState === Websocket.OPEN) {
                client.send(JSON.stringify({
                    data, event: 'message'
                }))

            }
        })
    })

    ws.on('close', function (message) {
        wss.clients.forEach(function each (client) {

        })
    })
})