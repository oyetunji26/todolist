// require

    const express = require('express');
    const bodyParser = require('body-parser');
    const date = require(__dirname + "/date.js");
    const port = 8080;
    const app = express();
    const db = require("mongoose")

// App set ejs view engine, use

    app.set("view engine","ejs");
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static("public"));
//database

    db.connect("mongodb://localhost:27017/todolistDB");

    const todoSchema = new db.Schema({
        name: String
    });

    const listSch = new db.Schema({

        name: String,
        items: []

    });

    const List = db.model("list",listSch);

    const todoColl = db.model("Item", todoSchema);
    let Items = [];

    // const item1 = new todoColl({
    //     name: "Welcome to your todolist!"
    // });
    // const item2 = new todoColl({
    //     name: "Hit the + button to add a new item"
    // });
    // const item3 = new todoColl({
    //     name: "<--- Hit this to delete an item"
    // });
    // const defaultItem = [item1,item2,item3];
// find function

    const find = async () => {
        let whatIGet = await todoColl.find({},{name : 1});
        for (let i = 0; i < whatIGet.length; i++) {

            if (! Items.includes(whatIGet[i].name))
            Items.push(whatIGet[i].name);

        }

    }




// // list schema



// update List function

    const addToList = async (listName,addVal) => {
        let whatIAdd = await List.find({name: listName});
        let itemsOf = whatIAdd[0].items;
        try {
            let idxOf = itemsOf.indexOf(addVal);
            if (!idxOf) {
                return 0;
            }
            itemsOf.push(addVal);
            await List.updateOne({name: listName}, {items: itemsOf});
            
        } catch (error) {
            console.error(error);
        }
    }

// delete function

    const del = async (delVal) => {
        let whatIDel = await todoColl.deleteOne({name: delVal });
        Items = [];
        // find();
    }

    const delFromList = async (listName,delVal) => {
        let whatIDel = await List.find({name: listName});
        let itemsOf = whatIDel[0].items;
        try {
            let idxOf = itemsOf.indexOf(delVal);
            itemsOf.splice(idxOf,1);
            await List.updateOne({name: listName}, {items: itemsOf});
            
        } catch (error) {
            console.error(error);
        }
    }

// app get
    app.get("/", (req,res) => {
        if(todoColl.find({}).length == Items.length) {

            res.render('list', {listTitle: "Today",Items: Items});

        }
        else {
            find();
            res.render('list', {listTitle: "Today",Items: Items});

        }

    });

    app.get("/:customListName", (req,res,err) => {
            let listName = req.params.customListName;
            const findList = async (lne) => {
                const list = new List({
                    name: lne,
                    items: ["tunji is a good boy"]
                });
                    
                    let found = await List.find({name: lne},{items: 1});
                    if (found == 0) {
                        list.save();
                    } 
                    else {
                        let listItems = [];
                        for (let i = 0; i < found[0].items.length; i++) {
                            if (! listItems.includes(found[0].items[i]))
                                listItems.push(found[0].items[i]);
                            // console.log(found[0].items[i]);
                        }
                        // console.log(found[0].items);
                        res.render('list', {listTitle: lne,Items: listItems});
                        // console.log(listItems);
                    }
            }
            findList(listName);
            // upd(lname,);
    });


// App post

    let findAfterPost = () => {
        Items = [];
        find();
    }

    app.post("/delete/:customListName", (req,res) => {

        let name = req.body.check;
        let listName = req.params.customListName;

        listName == "Today" ? (del(name), findAfterPost(), res.redirect("/")) : (delFromList(listName,name), res.redirect("/" + listName));

        // res.redirect("/");

    });


    app.post("/:listName", (req,res) => {

        let item = req.body.item;
        let listName = req.params.listName;

        if (listName == "Today") {

            const insertOne = new todoColl({
                name: item
            });

            if(!Items.includes(item))
                insertOne.save();

            findAfterPost();
            res.redirect("/");

        } else {

            addToList(listName,item);
            listItems = [];
            res.redirect("/" + listName);
        }
    });


// App listens to port
    app.listen(port, (req,res) => {

        find();
        console.log(`server is opened at port ${port}`);

    });

//mongodb://localhost:27017