const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')

module.exports = class HnrDb {
    constructor() {
        let firebaseConfig = {
            apiKey:
                'AAAACVfXeqA:APA91bHfu50ZWmJ5am8Z7v2sTmPD_1WeX8BMyXGEmDj0ec0oJEFeOUELqiqBnngmLnB7YAsaBdPAbnKhQnIt5KdT2ILTzUS3CEcRG2gcBDrxe35StwEPxS9csMo1GkpKFDynBX9HHY5v',
            authDomain: 'hacknroll-2019.firebaseapp.com',
            databaseURL: 'https://hacknroll-2019.firebaseio.com',
            projectId: 'hacknroll-2019',
            storageBucket: 'hacknroll-2019.appspot.com',
            appId: 'hacknroll-2019',
        }
        this.database = firebase.initializeApp(firebaseConfig).database()
    }
    create_user(user_dob, user_gender, user_id, user_username) {
        this.database.ref(`users/${user_id}`).set({
            dob: user_dob,
            gender: user_gender,
            username: user_username,
        })
    }
    get_user(user_id, cb) {
        this.database.ref(`users/${user_id}`).on('value', cb)
    }
    add_user_question(user_id, question_id, question_body) {
        this.database
            .ref(`questions/${user_id}/${question_id}`)
            .set(question_body)
    }
    get_user_questions(user_id, cb) {
        this.database.ref(`questions/${user_id}`).on('value', cb)
    }
    get_user_question_by_id(user_id, question_id, cb) {
        this.database.ref(`questions/${user_id}/${question_id}`).on('value', cb)
    }
    get_user_answers(user_id, cb) {
        this.database.ref(`answers/${user_id}`).on('value', cb)
    }
    get_preset_questions(cb) {
        this.database.ref(`preset-questions`).on('value', cb)
    }
    get_preset_questions(user_id, qn_arr) {
        this.database.ref(`users/${user_id}/preset_questions`).set(qn_arr)
    }
}
