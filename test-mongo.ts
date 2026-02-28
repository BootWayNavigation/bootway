import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://bootwayuser:eiEMnTdGnka9jHMA@bootwaycluster.cmbrsir.mongodb.net/?appName=BootWayCluster";

async function run() {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const tasks = await db?.collection("tasks").find({ submissionNote: { $exists: true } }).toArray();
    console.log("Tasks with submissions:", tasks?.length);
    console.log(tasks);
    mongoose.disconnect();
}

run();
