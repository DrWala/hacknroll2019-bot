const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const short = require('short-uuid')
const my_db = require('./firebase.js')

const keyboard = Markup.inlineKeyboard([
    Markup.urlButton('❤️', 'http://telegraf.js.org'),
    Markup.callbackButton('Delete', 'delete'),
])

let db = new my_db()
db.get_user()
db.add_user_question(1, 'my_id', { hi: 'bye' })

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start(ctx => ctx.reply('Hello'))
bot.help(ctx => ctx.reply('Help message'))
bot.on('message', ctx =>
    ctx.telegram.sendCopy(ctx.chat.id, ctx.message, Extra.markup(keyboard))
)
bot.action('delete', ({ deleteMessage }) => deleteMessage())
bot.launch()
