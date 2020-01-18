const Telegraf = require('telegraf')
const { startCommand } = require('./commands')
const { userMiddleware, debugMiddleware } = require('./middlewares')

// For Scenes
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')

const { session } = Telegraf
const { BOT_NAME, BOT_TOKEN } = process.env


const init = async (bot) => {

  const { enter, leave } = Stage

  const echoScene = new Scene('echo')
  echoScene.enter((ctx) => ctx.reply('echo scene'))
  echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
  echoScene.command('back', leave())
  echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
  echoScene.on('message', (ctx) => ctx.reply('Only text messages please'))

  /**
   * Middlewares
   */
  bot.use(session())
  bot.use(userMiddleware())
  bot.use(debugMiddleware())
  const stage = new Stage([echoScene], { ttl: 10 })
  bot.use(stage.middleware())
  bot.command('echo', (ctx) => ctx.scene.enter('echo'))
  bot.on('message', (ctx) => ctx.reply('Try /echo or /greeter'))

  /**
   * Commands
   */
  bot.start(startCommand())

  return bot
}


/**
 * Init bot function.
 *
 * @param {Telegraf} bot The bot instance.
 * @param {Object} dbConfig The knex connection configuration.
 * @return {Promise<Telegraf>} Bot ready to launch.
 */
init(new Telegraf(BOT_TOKEN, { username: "LetsCalmBot" }))
  .then((bot) => {
    /**
     * Run
     */
    bot.launch()
  })

module.exports = init
