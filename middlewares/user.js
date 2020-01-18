const { errorHandler } = require('../helpers')

module.exports = () => async (ctx, next) => {
  if (ctx.session.user) {
    return next()
  }

  const id = Number(ctx.from.id)
  const date = new Date()
  const user = id


  ctx.session.restricted = true
  ctx.session.user = { ...ctx.from, created_at: date }

  return next()
}
