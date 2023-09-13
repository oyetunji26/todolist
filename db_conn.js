db.connect("mongodb://localhost:27017/todolistDB");

const todoSchema = new db.Schema({
    name: String
});

let post = () => {
    Items = [];
    find();
    res.redirect("/");
}


const todoColl = db.model("Item", todoSchema);

const find = async () => {
    let whatIGet = await todoColl.find({},{name : 1});
    for (let i = 0; i < whatIGet.length; i++) {
        if (! Items.includes(whatIGet[i].name))
            Items.push(whatIGet[i].name);
    }
}

const del = async (delVal) => {
    let whatIDel = await todoColl.deleteOne({name: delVal });
}
