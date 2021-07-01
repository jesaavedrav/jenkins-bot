const Discord = require("discord.js");
const config = require("./config.json");
const express = require('express')
const app = express()
const port = config.API_PORT

const client = new Discord.Client();

const prefix = "!";
client.on("message", async function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    if (command === "build") {
        try {
            var response = await buildJenkinsJob(config.BASE_JENKINS_URL, config.JENKINS_TOKEN)
            message.reply(response.data.message);
        } catch (error) {
            message.reply(error.message);
        }


    }
});

client.on('ready', async () => {

    app.get('/report', (req, res) => {
        let params = req.query
        let channel = config.CHANNELS.find(element => element.ID === params.channelid || element.KEY === params.channelkey)
        let channel = client.channels.cache.get(channelId)
        channel.send(buildMessage(channel.NAME, params.status, params.phase))
        res.send('sucess-api-rest')
    })
})

const buildMessage = (...args) => {
    var message = []

    message.push(`**Pipeline: ${args[0]}**`)
    message.push("")
    message.push(`Status: ${args[1]}`)
    message.push(`Phase: ${args[2]}`)
    message.push("")
    if (args.length > 3) {
        message.push("*Additional information:*")
        for (i = 3; i > args.length; i++) {
            message.push(args[i])
        }
        message.push("")
    }

    return message.join("\n")
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

client.login(config.BOT_TOKEN);