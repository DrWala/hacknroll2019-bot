class TelegramWebhooksController < Telegram::Bot::UpdatesController
    include Rails.application.routes.url_helpers
    # use callbacks like in any other controllers
    around_action :with_locale
  
    def start!(data = nil, *)
      # do_smth_with(data)
  
      # There are `chat` & `from` shortcut methods.
      # For callback queries `chat` if taken from `message` when it's available.
      response = <<~EOS
        *Hi there!*
  
        *About Teleboard*\n
        @TeleboardedBot allows you to drop any message, note, web URL and conveniently search through it from a web app all from Telegram!
  
        *Commands*\n
        */access* allows you to see the url to access the contents of this board\n
        */name_board* allows you to name your board to access it more conveniently by its name
      EOS
      # There is `respond_with` helper to set `chat_id` from received message:
      respond_with :message, text: response, parse_mode: :Markdown
    end
    
    private
    def with_locale(&block)
      I18n.with_locale(locale_for_update, &block)
    end
  
    def locale_for_update
      if from
        # locale for user
      elsif chat
        # locale for chat
      end
    end
  end
  