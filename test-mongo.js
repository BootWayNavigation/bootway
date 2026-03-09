const mongoose = require("mongoose");

const MONGO_URI = "mongodb://bootwayuser:eiEMnTdGnka9jHMA@ac-9a7tqm3-shard-00-00.cmbrsir.mongodb.net:27017,ac-9a7tqm3-shard-00-01.cmbrsir.mongodb.net:27017,ac-9a7tqm3-shard-00-02.cmbrsir.mongodb.net:27017/?ssl=true&replicaSet=atlas-n9iouq-shard-0&authSource=admin&retryWrites=true&w=majority&appName=BootWayCluster";

async function run() {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const tasks = await db?.collection("tasks").find({ "submissionNote": { $exists: true } }).toArray();
    console.log("Tasks with submissionNote explicitly set:", tasks?.length);
    console.log(tasks);
    mongoose.disconnect();
}

run();
