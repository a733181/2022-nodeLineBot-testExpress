require('dotenv').config();

const express = require('express');
const lineBot = require('linebot');

const getData = require('./commands/index');
const illustrate = require('./template/illustrate.json');

const app = express();
const port = process.env.PORT || 3000;

const bot = lineBot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

bot.on('message', (e) => {
  if (e.message.type !== 'text') return;
  if (e.message.text === '說明') {
    const reply = {
      type: 'flex',
      altText: '說明',
      contents: illustrate,
    };
    e.reply(reply);
  } else if (e.message.text === '今日社群話題') {
    getData(e, '/recipes/select');
  } else if (e.message.text === '人氣食譜') {
    getData(e, '/recipes/popular');
  } else if (e.message.text === '素食食譜') {
    getData(e, '/categories/28');
    getData(e, '/categories/28');
  } else if (e.message.text === '新廚上菜') {
    getData(e, '/recipes/newcomers');
  } else if (e.message.text === '當季食材料理') {
    getData(e, '/categories/608');
  } else if (e.message.text === '最新食譜') {
    getData(e, '/recipes/latest');
  } else if (e.message.text === '測試') {
    e.reply(e.message.text);
  } else {
    const page = e.message.text.split(' ')[1] || '';
    const text = `/search/${e.message.text}/${page ? `?page=${page}` : ''}`;
    getData(e, text);
  }
});

const linebotParser = bot.parser();
app.post('/linewebhook', linebotParser);
app.get('/', (req, res) => {
  res.status(200).send('ok');
});

app.listen(port, () => {
  console.log('機器人啟動');
});
