const express = require("express");
const bodyParser = require('body-parser');
const request = require("request");
const app = express();
const mailchimp = require('@mailchimp/mailchimp_marketing');
const listId = "bf7d4a2278";

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



//Mailchimp API
mailchimp.setConfig({
  apiKey: '3d724e95784a40166b862421a4a9f405-us18',
  server: 'us18',
});

async function callPing() {
  const response = await mailchimp.ping.get();
  console.log(response);
}
callPing();




app.post('/', function(req, res) {

  const subscribingUser = {
    firstName: req.body.FNAME,
    lastName: req.body.LNAME,
    email: req.body.EMAIL
  };

  app.post("/failed", function(req, res) {
    res.redirect("/");
  });

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      res.sendFile(__dirname + "/success.html");
      console.log(
        `Successfully added contact as an audience member.
      The contact's id is ${response.id}.`);

    } catch (e) {
      if (e.status === 400) {
        res.sendFile(__dirname + "/failed.html");
        console.error(`This email is not subscribed to this list`, e);
      }
    }
  }
  run();

});



app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});

// app.post('/', function(req, res){
//   console.log(
// `first name: ${req.body.fname}
//   last name: ${req.body.lname}
//    password: ${req.body.email}`);
// });

app.listen(process.env.PORT, function() {
  console.log("server is running..");
});
