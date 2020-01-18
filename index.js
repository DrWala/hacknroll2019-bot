const Telegraf = require('telegraf')
const { startCommand } = require('./commands')
const { userMiddleware, debugMiddleware } = require('./middlewares')
const Database = require('./firebase')

// For Scenes
const WizardScene = require('telegraf/scenes/wizard')
const Markup = require('telegraf/markup') // Get the markup module
const Stage = require('telegraf/stage')

const { session } = Telegraf
const { BOT_NAME, BOT_TOKEN } = process.env

let db = new Database()

const init = async bot => {
    const welcomeWizard = new WizardScene(
        'welcome_wizard',
        ctx => {
            console.log('IN WELCOME WIZARD')
            ctx.reply(
                "Hi, what's your date of birth in the following format: DD/MM/YY?"
            )
            return ctx.wizard.next()
        },
        ctx => {
            console.log(ctx.update.message.from)
            ctx.wizard.state.dob = ctx.message.text
            ctx.wizard.state.user_id = ctx.update.message.from.id
            ctx.wizard.state.username = ctx.update.message.from.username
            ctx.reply(`Got it, what's your gender?`)
            // Go to the following scene
            return ctx.wizard.next()
        },
        ctx => {
            ctx.wizard.state.gender = ctx.message.text
            db.create_user(
                ctx.wizard.state.dob,
                ctx.wizard.state.gender,
                ctx.wizard.state.user_id,
                ctx.wizard.state.username
            )
            ctx.reply('Got it. End of convo')
            // TODO: save to DB via firebase
            return ctx.scene.leave()
        }
    )

    /**
     * Middlewares
     */
    bot.use(session())
    const stage = new Stage([welcomeWizard])
    bot.use(stage.middleware())
    // bot.hears('/pick_preset_questions', ctx => {
    //     console.log("FUCK IM HERE")

    // })
    bot.command('pick_preset_questions', ctx => {
        console.log('Trying to get preset questions wizard')
        
        // Stage.enter('preset_questions_wizard')
    })
    bot.start(ctx => ctx.scene.enter('welcome_wizard'))
    bot.use(userMiddleware())
    bot.use(debugMiddleware())

    /**
     * Commands
     */
    // bot.start((ctx) => ctx.scene.enter("welcome_wizard"))

    return bot
}

/**
 * Init bot function.
 *
 * @param {Telegraf} bot The bot instance.
 * @param {Object} dbConfig The knex connection configuration.
 * @return {Promise<Telegraf>} Bot ready to launch.
 */
init(new Telegraf(BOT_TOKEN, { username: 'LetsCalmBot' })).then(bot => {
    /**
     * Run
     */
    bot.launch()
})

module.exports = init
