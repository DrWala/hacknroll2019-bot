const Stage = require('telegraf/stage')
const WizardScene = require('telegraf/scenes/wizard')
const Markup = require('telegraf/markup')
const Composer = require('telegraf/composer')


const stepHandler = new Composer()
stepHandler.action('next', (ctx) => {
  ctx.reply('Step 2. Via inline button')
  return ctx.wizard.next()
})
stepHandler.command('next', (ctx) => {
  ctx.reply('Step 2. Via command')
  return ctx.wizard.next()
})
stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))

const superWizard = new WizardScene('super-wizard',
  (ctx) => {
    ctx.reply('Step 1', Markup.inlineKeyboard([
      Markup.urlButton('❤️', 'http://telegraf.js.org'),
      Markup.callbackButton('➡️ Next', 'next')
    ]).extra())
    return ctx.wizard.next()
  },
  stepHandler,
  (ctx) => {
    ctx.reply('Step 3')
    return ctx.wizard.next()
  },
  (ctx) => {
    ctx.reply('Step 4')
    return ctx.wizard.next()
  },
  (ctx) => {
    ctx.reply('Done')
    return ctx.scene.leave()
  }
)

module.exports = () => async (ctx) => {
    if (ctx.chat.type === 'private') {
      // Setup stage here
      // ctx.reply(`
      //   Hello! ${ctx.from.username}
      // `)
      // Greeter scene
      const stage = new Stage([superWizard], { default: 'super-wizard' })
      ctx.scene.enter('super-wizard')
    }
}