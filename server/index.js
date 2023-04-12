// require('dotenv').config();
const express = require("express");
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../notekeeper/build')));
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.KEEPERDB);
const session = require('express-session')
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')
app.use(session({
    secret: 'This is very secret thing.',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

const notesSchema = new mongoose.Schema({
    newTitle: String,
    newNote: String
})
const Note = mongoose.model("Note", notesSchema);
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String,
    facebookId: String,
    notes: [notesSchema]
})
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(express.json())


app.route('/user')
    .get(async (req, res) => {
        let foundUsers = await User.find({}).exec();
        res.send(foundUsers)
    })
    .put(async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        User.register({ username: username }, password, async (err, user) => {
            if (err) {
                res.send(err);
            } else {
                passport.authenticate("local")(req, res, () => {
                    console.log("Success");
                    res.send(JSON.stringify("Success"))
                })
            }
        })

    })
    .post(async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const user = new User({
            username: username,
            password: password
        })
        req.login(user, function (err) {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate("local")(req, res, () => {
                    console.log("Success login");
                    res.send(JSON.stringify("Success"))
                })
            }
        })
    })

app.route('/newnotes')
    .get(async (req, res) => {
        let foundNotes = await Note.find({}).exec();
        res.send(await Note.find({}).exec())
    })
    .put(async (req, res) => {
        let note = new Note({
            newTitle: req.body.newTitle,
            newNote: req.body.newNote
        })
        let addNoteResult = await note.save().then(() => {
            console.log("Successfully saved items to DB");
        });
    })
    .post(async (req, res) => {
        const deleteById = await Note.findByIdAndRemove(req.body.id);
        res.send("success")
    })

app.route("/usernote")
    .get(async (req, res) => {
        if (req.isAuthenticated()) {
            console.log(req.user._id);
            let foundUserNote = await User.findById(req.user._id)
            res.send(foundUserNote);
        } else {
            res.send(JSON.stringify("Unautheticated!"))
        }
    })
    .put(async (req, res) => {
        const userId = req.body.userId;
        const notes = req.body.notes;
        User.findById(userId, async function (err, docs) {
            if (err) {
                console.log(err);
                res.send(err)
            } else {
                docs.notes.push(notes);
                await docs.save();
                console.log("Save note successfully");
                await res.send(docs.notes);
            }
        })
    })
    .post(async (req, res) => {
        const itemId = req.body.itemId;
        User.findById(req.body.userId, async function (err, docs) {
            if (err) {
                console.log(err);
                res.send(err)
            } else {
                docs.notes.remove({ _id: itemId });
                await docs.save();
                console.log("Delete note successfully");
                await res.send(docs.notes);
            }
        });
    })
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});