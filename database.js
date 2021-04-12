const { database } = require("./models/userModel");

let Database = [
    {   name:"cindy",
        id: 1,
        email: "cindy123@gmail.com",
        password: "cindy123",
        reminders: [{id: 1, title: "Welcome to Reminder App", description: "Try Creating a Reminder !", tags: "Fun", completed: false}],
        friendReminders: [],
        friends: []
    },
    {
        name: "alex",
        id: 2,
        email: "alex123@gmail.com",
        password: "alex",
        reminders: [{id: 1, title: "Terry", description: "Ball", tags: "Must", completed: false}],
        friendReminders: [],
        friends:[]
    },
    {   name: "jimmy",
        id: 3,
        email: "jimmy123@gmail.com",
        password: "jimmy123!",
        reminders: [{id: 1, title: "Rick and morty", description: "lmao", tags: "rawrxD", completed: false},
        {id: 2, title: "Piegeon", description: "Fly", tags: "Animal", completed: false}],
        friendReminders: [],
        friends: []
      },
    ];
module.exports = Database;
