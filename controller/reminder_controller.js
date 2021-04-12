let database = require("../database");
let request = require('request');
const { forEach } = require("../database");
const key = '4f5b9936701e58d475a62473c9b6352b';
const location = 'Vancouver,CA';

let remindersController = {
  list: (req, res) => {

    const URL = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=' + key;
    request({
      headers: {},
      uri: URL,
      method: 'GET',
      }, (err, response, body) => {
      const data = JSON.parse(body);
      // console.log(data);
      let weatherName = data.name
      let celcius = Math.round(parseFloat(data.main.temp)-273.15);
      let description = data.weather[0].description;
      let userfriends = req.user.friends;

      if (req.user.friends != undefined) {
        res.render("reminder/index", { 
          reminders: req.user.reminders, 
          friendReminders: req.user.friendReminders, 
          weathName: weatherName, 
          weathCel: celcius, 
          weathDesc: description,
          friends: userfriends
          });

      } else {
        res.render("reminder/index", { 
          reminders: req.user.reminders, 
          weathName: weatherName, 
          weathCel: celcius, 
          weathDesc: description, 
          friends: userfriends
        });
      }
    });
  },

  friends: (req, res) => {
    listOfFriends = []
    database.forEach(function (userdata) {
      if (userdata.id != req.user.id) {
        listOfFriends.push({name:userdata.name, id:userdata.id})
      };
    });
    // console.log(listOfFriends)
    res.render("reminder/friends", {friendList: listOfFriends});
  },

  addFriends: (req, res) => {
    let user_keys = []
    let friends_keys = []
    let all_reminders = []
    let reqObj = JSON.parse(JSON.stringify(req.body));
    let friends = req.user.friends;

    console.log(reqObj)
    friendKeys = Object.keys(reqObj);
    
    console.log("friends keys: " + friendKeys);
    console.log(req.user.friends)

    friendKeys.forEach(function (userKey) {
      user_keys.push(userKey)

      database.forEach(function (userdata) {
        if (userKey == userdata.id) {
          friends_keys.push(userdata.name);
        }
      })
    })

    req.user.friends = friends_keys

    let reminder_id = 1
    database.forEach(function (datauser) {
      user_keys.forEach(function (userKey) {
        if (userKey == datauser.id) {
          for (let dataReminder of datauser.reminders) {
            dataReminder.id = reminder_id
            all_reminders.push(dataReminder)
            reminder_id = reminder_id + 1
          }
        }
      })
    })
    
    req.user.friendReminders = all_reminders
    res.redirect("/reminders");
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let buddies = req.user.friends;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { 
        user: req.user,
        reminders: req.user.reminders,
        friends: buddies});
    }
  },

  create: (req, res) => {
    let reminder = {
      id: req.user.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      subtask: req.body.subtask.split(","),
      tags: req.body.tags.split(","),
      completed: false,
      date: req.body.date.replace("T", " ")
    };
    req.user.reminders.push(reminder);
    console.log(req.user.reminders);
    res.redirect("/reminders");
  },

  searchBar: (req, res) => {
    let matchingReminders = []
    let searchToken = req.query.search;
    let amigos = req.user.friends;

    console.log(`DEBUG: userSearchTerm is: ${searchToken}`);

    for (let i = 0; i < req.user.reminders.length; i++) {
        // if substring found
        if (req.user.reminders[i].title.includes(searchToken)) {
          matchingReminders.push(req.user.reminders[i]);
        }
    }
    res.render("reminder/index", {
        user: req.user,
        reminders: matchingReminders,
        friendReminders: req.user.friends,
        weathName: "", 
        weathCel: "", 
        weathDesc: "",
        friends: amigos
    });
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implement this code
    let updatedRem = []
    let reminderToUpdate = req.params.id;
    console.log(reminderToUpdate);
    let truthValue = null;
    if (req.body.completed == 'true') {
      truthValue = true
    } else {
      truthValue = false
    }
    for (const reminder of req.user.reminders) {
      if (reminder.id == reminderToUpdate){
        console.log(reminder.id);
        let newReminder = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        subtask: req.body.subtask.split(","),
        tags: req.body.tags.split(","),
        completed: truthValue,
        date: req.body.date.replace("T", " ")
        };
        updatedRem.push(newReminder);

      }else {
        updatedRem.push(reminder);
      }
    }
    //spread operator - taking all of remsFiltered and making sure database does not get over written
    req.user.reminders = [...updatedRem];
    console.log(req.user.reminders);
    res.redirect("/reminders");
  },

  delete: (req, res) => {
    // Implement this code
    let reminderToDel = req.params.id;
    // let searchResult = req.user.find(function (reminder) {
    //   return reminder.id == reminderToFind;
    // });
    let remsFiltered = req.user.reminders.filter(function (reminder){
      if (reminder.id != reminderToDel){
        return reminder
      }
    });
    //spread operator - taking all of remsFiltered and making sure database does not get over written
    req.user.reminders = [...remsFiltered];
    console.log(req.user.reminders);
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
