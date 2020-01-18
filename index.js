const Telegraf = require('telegraf')
const { startCommand } = require('./commands')
const { userMiddleware, debugMiddleware } = require('./middlewares')

const { session } = Telegraf
const { BOT_NAME, BOT_TOKEN } = process.env

const init = async (bot) => {

  /**
   * Middlewares
   */
  bot.use(session())
  bot.use(userMiddleware())
  bot.use(debugMiddleware())

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
    bot.startPolling()
  })

module.exports = init