Rails.application.routes.draw do
  # Telegram Routes
  telegram_webhook TelegramWebhooksController, Rails.env.to_sym
end
