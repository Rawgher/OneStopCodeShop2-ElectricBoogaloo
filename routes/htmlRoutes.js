var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    if (req.session.success) {
      res.render("index", {
        msg: "Welcome to the electric boogaloo!"
      });
    } else {
      res.redirect("/login");
    }
    req.session.errors = null;
  });

  // Load example page and pass in an example by id
  // LOGIN ROUTES
  app.get("/login", function(req, res) {
    res.render("login/index", {
      msg: "Welcome back/Create new?",
      title: "Form Validation",
      success: req.session.success,
      errors: req.session.errors
    });
  });

  app.post("/login", function(req, res) {
    req.check("email", "Invalid email address").isEmail();
    req
      .check("password", "Password is invalid")
      .isLength({
        min: 4
      })
      .equals(req.body.confirmPassword);
    var errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      req.session.success = false;
    } else {
      req.session.success = true;
      res.redirect("/");
    }
  });

  // CREATE ACCOUNT ROUTES
  app.get("/createAccount", function(req, res) {
    res.render("createAccount");
  });

  app.post("/submit", function(req, res) {
    req.check("email", "Invalid email address").isEmail();
    req
      .check("password", "Password is invalid")
      .isLength({
        min: 4
      })
      .equals(req.body.confirmPassword);
    var errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      req.session.success = false;
    } else {
      req.session.success = true;
    }
    res.redirect("/");
  });
    
  app.get("/forum", function(req, res) {
    res.render("forum/index", {
      msg: "Welcome to the forum!"
    });
  });

  app.get("/account", function(req, res) {
    db.Users.findOne({}).then(function(dbUsers) {
      res.render("myAccount/index", {
        users: dbUsers
      });
    });
  });

  app.get("/topics", function(req, res) {
    db.Topics.findAll({}).then(function(dbTopics) {
      res.render("topics/index", {
        topics: dbTopics
      });
    });
  });

  //will probably change to findOne and then get the functionality for it linked to the page?
  app.get("/author", function(req, res) {
    db.Posts.findAll({}).then(function(dbPosts) {
      res.render("author/index", {
        author: dbPosts
      });
    });
  });

  app.get("/posts", function(req, res) {
    db.Posts.findAll({}).then(function(dbPosts) {
      res.render("posts/index", {
        posts: dbPosts
      });
    });
  });

  app.post("/add-a-post", function(req, res) {
    db.Posts.create({}).then(function(dbPosts) {
      res.render("createPost/index", {
        newPost: dbPosts
      });
    });
  });

  app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/login");
  });
};
