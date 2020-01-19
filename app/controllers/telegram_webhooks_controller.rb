class TelegramWebhooksController < Telegram::Bot::UpdatesController
    include Rails.application.routes.url_helpers
    include Telegram::Bot::UpdatesController::MessageContext

    # use callbacks like in any other controllers
    around_action :with_locale
  
    def start!(data = nil, *)
      message = self.payload
  
      # USER DATA
      username = message["from"]["username"]
      user_id = message["from"]["id"]
      
      # FIREBASE SHIT
      firebase_url    = 'https://hacknroll-2019.firebaseio.com/'
      firebase_secret = 'LXM1UqfFrDfE3Ew1mKRvHAXl8wFbhFKNJXv41clY'
      firebase = Firebase::Client.new(firebase_url, firebase_secret)
      firebase.set("users/#{user_id}", {
        username: username
      })
      response = <<~EOS
        Hi #{username}! What's your age?
      EOS
      save_context :start_convo
      respond_with :message, text: response, parse_mode: :Markdown
    end

    ###########################
    # HANDLES START OF CONVOS
    ###########################

    def start_convo(data = nil, *)
      message = self.payload

      # USER DATA
      user_id = message["from"]["id"]
      age = message["text"]

      # FIREBASE SHIT
      firebase_url    = 'https://hacknroll-2019.firebaseio.com/'
      firebase_secret = 'LXM1UqfFrDfE3Ew1mKRvHAXl8wFbhFKNJXv41clY'
      firebase = Firebase::Client.new(firebase_url, firebase_secret)
      firebase.set("users/#{user_id}", {
        age: age
      })
      save_context :get_gender
      respond_with :message, text: 'Got your age! What is your gender?'
    end

    def get_gender(data = nil, *)
      message = self.payload

      # USER DATA
      user_id = message["from"]["id"]
      gender = message["text"]

      # FIREBASE SHIT
      firebase_url    = 'https://hacknroll-2019.firebaseio.com/'
      firebase_secret = 'LXM1UqfFrDfE3Ew1mKRvHAXl8wFbhFKNJXv41clY'
      firebase = Firebase::Client.new(firebase_url, firebase_secret)
      firebase.set("users/#{user_id}", {
        gender: gender
      })
      respond_with :message, text: "Got it! Set your daily questions in the link here: https://someurl.com/preset?user_id=#{user_id}"
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
  