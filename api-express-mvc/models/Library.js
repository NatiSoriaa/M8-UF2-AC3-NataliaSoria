// const mysql = require("mysql2");
const { MongoClient} = require("mongodb");
const dbConfig = require("../config/mysql.config.js");

class Library {
  constructor() {
    // En el constructor, creamos una conexión a la base de datos
    // y la guardamos en la propiedad connection de la clase

    // 1.Declaramos la conexión
    // let connection = mysql.createConnection({
    //   host: dbConfig.HOST,
    //   user: dbConfig.USER,
    //   password: dbConfig.PASSWORD,
    //   database: dbConfig.DB
    // });
    this.client = new MongoClient(dbConfig.URL);
    this.connection = this.client.connect()
    .then(client => {
      console.log("Successfully connected to the MongoDB database.");
      this.db = client.db(dbConfig.DB); 
      this.collection = this.db.collection("books");
    })
    .catch(error => {
      console.error("Error connecting to MongoDB:", error);
    });

    // 2.Abrimos la conexión
    // connection.connect(error => {
    //   if (error) throw error;
    //   console.log("Successfully connected to the database.");
    // });

    // 3.Dejamos la conexión en la propiedad connection, promisificada
    // (para poder utilizarlas más cómodamente en el resto de métodos de la clase)
    // this.connection = connection.promise();
  }

  close = async () => {
    // this.connection.end();
    await this.client.close();
  }


  // métodos de la clase Library
  listAll = async () => {
    // console.log(this.connection)
    // const [results, fields] = await this.connection.query("SELECT * FROM books");
    // return results;
    try {
      const books = await this.db.collection("books").find().toArray();
      return books;
    } catch (error) {
      console.error("Error retrieving books:", error);
      return [];
    }
  }

  create = async (newBook) => {
    try {
      // const [results, fields] = await this.connection.query("INSERT INTO books SET ?", newBook);
      // return results.affectedRows;
      const result = await this.collection.insertOne(newBook);
      return result.insertedId;
    }
    catch (error) {
      return error;
    }

  };

  update = async (book) => {
    try{
      // const[results] = await this.connection.query("UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?", [book.title, book.author, book.year, book.id]);
      // return results.affectedRows;
      const result = await this.collection.updateOne(
        { _id: new ObjectId(book.id) }, 
        { $set: { title: book.title, author: book.author, year: book.year } }
      );
      return result.modifiedCount;
    }
    catch (error) {
      return error;
    }
  }

  delete = async (id) => {
    try {
      // const [results] = await this.connection.query("DELETE FROM books WHERE id = ?", [id]);
      // return results.affectedRows;
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount;
    } 
    catch (error) {
      return error;
    }
  }
}

module.exports = Library;