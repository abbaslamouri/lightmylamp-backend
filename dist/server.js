"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
// import dotenv from 'dotenv'
// dotenv.process.env()
const app_1 = __importDefault(require("./app"));
// import process.env from './process.env/default'
const dbConnect = async () => {
    // const dbUrl = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_IP}:${process.env.MONGO_DB_PORT}`
    // console.log('DBURI', process.env.DB_URI)
    // console.log('ENV', process.env.NODE_ENV)
    // console.log('JWT SECRET', process.env.JWT_SECRET)
    try {
        // if (!process.env.JWT_SECRET) throw new Error('Environment variable JWT_SECRET is not defined')
        // if (!process.env.DB_URI) throw new Error('Environment variable DB_URI is not defined')
        const port = process.env.PORT || '5000';
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log(colors_1.default.magenta.bold(`Database connection succesfull`));
        app_1.default.listen(port, () => {
            console.log(colors_1.default.cyan.bold(`server running on port ${port}...`));
        });
    }
    catch (err) {
        console.log(colors_1.default.red.bold(`Mongo DB Error ${err}`));
        // console.log(colors.red.bold(`Mongo DB Error Message ${err.message}`))
    }
};
dbConnect();
// mongoose
//   .connect(dbUrl, { dbName: process.env.DB_NAME })
//   .then(() => {
//     console.log(colors.magenta.bold(`Database connection succesfull`))
//     app.listen(process.env.PORT, () => {
//       console.log(colors.cyan.bold(`server running on port ${process.env.PORT}...`))
//     })
//   })
//   .catch((err) => {
//     console.log(colors.red.bold(`Mongo DB Error ${err}`))
//     console.log(colors.red.bold(`Mongo DB Error Message ${err.message}`))
//   })
// const port = process.env.PORT || 8080
// app.listen(8080, () => {
//   console.log(colors.cyan.bold(`server running on port ${port}...`))
// })
