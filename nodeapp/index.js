const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const randomName = require("random-name");
const port = 3000;

app.set("view engine", "jade");

app.get("/", async (req, res) => {
  const name = `${randomName.first()} ${randomName.last()}`;

  const connection = await mysql.createConnection({
    host: "db",
    user: "root",
    port: 3310,
    password: "root",
    database: "nodedb",
  });

  await connection.query(
    `CREATE TABLE IF NOT EXISTS USERS (
      id int NOT NULL AUTO_INCREMENT,
      name VARCHAR(50),
      PRIMARY KEY (id)
    );`
  );

  await connection.query(`INSERT INTO USERS (NAME) VALUES('${name}');`);
  const [data] = await connection.query(`SELECT * FROM USERS ORDER BY NAME;`);
  await connection.end();

  res.render("index", { users: data });
});

app.listen(port, () => console.log(`running on port ${port}`));
