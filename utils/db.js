// import { createPool } from "mysql";

// //store in a variable to use multiple times if needed
// //environment variables, must match .env
// const host = process.env.DB_HOST;
// const user = process.env.DB_USER;
// const password = process.env.DB_PWD;
// const database = process.env.DB_NAME;

// class Connection {
//   constructor() {
//     if (!this.pool) {
//       console.log("creating connection pool...");
//       this.pool = createPool({
//         connectionLimit: 100,
//         host,
//         user,
//         password,
//         database,
//       });

//       return this.pool;
//     }

//     return this.pool;
//   }
// }

// const instance = new Connection();

// //instance is a connection we are making to our database (AWS)
// export default instance;

const { createPool } = require("mysql");

const connection = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

module.exports = connection;
