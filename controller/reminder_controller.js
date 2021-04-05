let database = require("../database");
let request = require('request');
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

      res.render("reminder/index", { reminders: req.user.reminders, weathName: weatherName, weathCel: celcius, weathDesc: description });
    });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { 
        user: req.user,
        reminders: req.user.reminders });
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
