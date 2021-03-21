let database = require("../database");

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database.cindy.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database.cindy.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: database.cindy.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database.cindy.reminders.push(reminder);
    console.log(database.cindy.reminders);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implement this code
    let updatedRem = []
    let reminderToUpdate = req.params.id;
    let truthValue = null;
    if (req.body.completed == 'true') {
      truthValue = true
    }
    else {
      truthValue = false
    }
    for (const reminder of database.cindy.reminders) {
      if (reminder.id == reminderToUpdate){
        let newReminder = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        completed: truthValue,
        };
        updatedRem.push(newReminder);

      }else {
        updatedRem.push(reminder);
      }
    }
    //spread operator - taking all of remsFiltered and making sure database does not get over written
    database.cindy.reminders = [...updatedRem];
    console.log(database.cindy.reminders);
    res.redirect("/reminders");
  
  },

  delete: (req, res) => {
    // Implement this code
    let reminderToDel = req.params.id;
    // let searchResult = database.cindy.reminders.find(function (reminder) {
    //   return reminder.id == reminderToFind;
    // });
    let remsFiltered = database.cindy.reminders.filter(function (reminder){
      if (reminder.id != reminderToDel){
        return reminder
      }
    });
    //spread operator - taking all of remsFiltered and making sure database does not get over written
    database.cindy.reminders = [...remsFiltered];
    console.log(database.cindy.reminders);
    res.redirect("/reminders");
  
  },
};

module.exports = remindersController;
