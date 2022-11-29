const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const template = require('../template/template.json');

const API_URL = 'https://icook.tw';

const renderHandler = (e, contentArr) => {
  const cookings = [];
  contentArr.forEach((cooking) => {
    const replyMessage = JSON.parse(JSON.stringify(template));
    replyMessage.hero.url = cooking.imgSrc;
    replyMessage.body.contents[0].text = cooking.title;
    replyMessage.footer.contents[0].action.uri = cooking.link;
    replyMessage.body.contents[1].contents.push(
      {
        type: 'box',
        layout: 'baseline',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text: 'by',
            color: '#aaaaaa',
            size: 'sm',
            flex: 1,
          },
          {
            type: 'text',
            text: cooking.by,
            wrap: true,
            color: '#666666',
            size: 'sm',
            flex: 5,
          },
        ],
      },
      {
        type: 'box',
        layout: 'baseline',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            color: '#aaaaaa',
            size: 'sm',
            flex: 1,
            text: '說明：',
          },
          {
            type: 'text',
            text: cooking.description,
            wrap: true,
            color: '#666666',
            size: 'sm',
            flex: 5,
          },
        ],
      },
      {
        type: 'box',
        layout: 'baseline',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text: '食材：',
            color: '#aaaaaa',
            size: 'sm',
            flex: 1,
          },
          {
            type: 'text',
            text: cooking.ingredient,
            wrap: true,
            color: '#666666',
            size: 'sm',
            flex: 5,
          },
        ],
      },
    );
    cookings.push(replyMessage);
  });

  if (cookings.length > 12) {
    const newCookins = cookings.splice(0, 12);
    const reply1 = {
      type: 'flex',
      altText: '食譜查詢結果',
      contents: {
        type: 'carousel',
        contents: newCookins,
      },
    };
    const reply2 = {
      type: 'flex',
      altText: '食譜查詢結果',
      contents: {
        type: 'carousel',
        contents: cookings,
      },
    };
    e.reply([reply1, reply2]);
  } else {
    const reply = {
      type: 'flex',
      altText: '食譜查詢結果',
      contents: {
        type: 'carousel',
        contents: cookings,
      },
    };
    e.reply(reply);
  }
};

module.exports = async (e, text) => {
  try {
    const { data } = await axios.get(`${API_URL}${text}`);
    const $ = cheerio.load(data);
    const contentArr = [];
    $('.browse-recipe-item').each(function () {
      const imgSrc = $(this).find('img.browse-recipe-cover-img').attr('data-src');

      const title = $(this).find('.browse-recipe-name').text().trim();
      const by = $(this).find('.browse-username-by').text().trim();
      const description = $(this).find('.browse-recipe-content-description').text().trim() || '無';
      const ingredient = $(this).find('.browse-recipe-content-ingredient').text().trim();
      const link = API_URL + $(this).find('.browse-recipe-link').attr('href');

      contentArr.push({
        imgSrc,
        title,
        by,
        description,
        ingredient,
        link,
      });
    });
    renderHandler(e, contentArr);
  } catch (err) {
    console.log(err);
    e.reply('找不到食譜');
  }
};
