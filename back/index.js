var express = require("express"); //Tipo de servidor: Express
var bodyParser = require("body-parser"); //Convierte los JSON
const cors = require("cors");
const session = require("express-session"); // Para el manejo de las variables de sesión
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express

const port = process.env.PORT || 4000; // Puerto por el que estoy ejecutando la página Web

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);

const server = app.listen(port, () => {
  console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});

const io = require("socket.io")(server, {
  cors: {
    // IMPORTANTE: REVISAR PUERTO DEL FRONTEND
    origin: ["http://localhost:3000", "http://localhost:3001"], // Permitir el origen localhost:3000
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    credentials: true, // Habilitar el envío de cookies
  },
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

/*
	A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
	A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
	A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
*/

let contador = 0; // Movido fuera del evento connection

io.on("connection", (socket) => {
  // Enviar el valor actual del contador al nuevo cliente
  socket.emit("respuestaPersonalizada", { contador });

  const req = socket.request;

  socket.on("joinRoom", (data) => {
    console.log("🚀 ~ io.on ~ req.session.room:", req.session.room);
    if (req.session.room != undefined && req.session.room.length > 0)
      socket.leave(req.session.room);
    req.session.room = data.room;
    socket.join(req.session.room);

    socket.on("chat-messages", (data) => {
      console.log("Usuario unido a sala:", data.room);
      setCurrentRoom(data.room);
    });

    io.to(req.session.room).emit("chat-messages", {
      user: req.session.user,
      room: req.session.room,
    });
  });

  socket.on("pingAll", (data) => {
    console.log("PING ALL: ", data);
    io.emit("pingAll", { event: "Ping to all", message: data });
  });

  socket.on("sendMessage", (data) => {
    io.to(req.session.room).emit("newMessage", {
      room: req.session.room,
      message: data,
    });
  });
});

// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------

//EMPIEZA LO NUESTRO//

//recibe mail -> retorna el id.

app.get("/user", async function (req, res) {
  try {
    respuesta = await realizarQuery(
      `SELECT * FROM UsuariosWpp WHERE mail = "${req.query.mail}"`
    );
    if (respuesta.length > 0) {
      res.send(respuesta);
    } else {
      res.send(-1);
    }
  } catch (error) {
    res.send({
      mensaje: "Tuviste un error en back/user",
      error: error.message,
    });
  }
});

app.post("/insertUsuario", async function (req, res) {
  try {
    let check = await realizarQuery(
      `SELECT mail FROM UsuariosWpp WHERE mail = "${req.body.mail}"`
    );
    if (check.length == 0) {
      //Este condicional corrobora que exista algun usuario con ese mail
      await realizarQuery(`INSERT INTO UsuariosWpp (mail, contraseña, nombre, foto) VALUES
                ("${req.body.mail}", "${req.body.contraseña}", "${req.body.nombre}", "${req.body.foto}")`); //Cambiar a nombres de variables que sean el username y la password, el récord por default es 0
      let respuesta = await realizarQuery(
        `SELECT id_usuario FROM UsuariosWpp WHERE mail = "${req.body.mail}"`
      ); //Pasarle como parámetro el nombre de usuario, de acá en más nos manejaremos con el id de usuario
      res.send({ res: respuesta });
    } else {
      res.send({ res: "-1" });
    }
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message });
  }
});

// ---------------------NO USO EL RESTO PARA ESTE TRABAJO----------------------------------------------------------------

//recibe chat ID -> retorna todo de todos de mensajes
app.get("/mensaje", async function (req, res) {
  try {
    let respuesta = await realizarQuery(
      `SELECT * FROM Mensajes WHERE id_chat = "${req.query.id_chat}"`
    );
    res.send(respuesta);
  } catch (error) {
    res.send({
      mensaje: "Tuviste un error en back/mensaje",
      error: error.message,
    });
  }
});
//recibe usuario ID -> retorna todo de todos de chats
app.get("/chat", async function (req, res) {
  try {
    let respuesta = await realizarQuery(`            
            SELECT *
            FROM Chats 
            INNER JOIN UsuariosEnChat 
            ON Chats.id_chat = UsuariosEnChat.id_chat 
            Where UsuariosEnChat.id_usuario ="${req.query.id_usuario}"`);
    res.send(respuesta);
  } catch (error) {
    res.send({
      mensaje: "Tuviste un error en back/mensaje",
      error: error.message,
    });
  }
});

//Pedidos de la tabla users
app.post("/insertUsuario", async function (req, res) {
  try {
    let check = await realizarQuery(
      `SELECT mail FROM UsuariosWpp WHERE mail = "${req.body.mail}"`
    );
    if (check.length == 0) {
      //Este condicional corrobora que exista algun usuario con ese mail
      await realizarQuery(`INSERT INTO UsuariosWpp (mail, contraseña, nombre, foto) VALUES
                ("${req.body.mail}", "${req.body.contraseña}", "${req.body.nombre}", "${req.body.foto}")`); //Cambiar a nombres de variables que sean el username y la password, el récord por default es 0
      let respuesta = await realizarQuery(
        `SELECT id_usuario FROM UsuariosWpp WHERE mail = "${req.body.mail}"`
      ); //Pasarle como parámetro el nombre de usuario, de acá en más nos manejaremos con el id de usuario
      res.send({ res: respuesta });
    } else {
      res.send({ res: "-1" });
    }
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message });
  }
});

//Pedidos tabla chat
app.post("/insertChat", async function (req, res) {
  try {
    //Este condicional corrobora que exista algun usuario con ese mail
    await realizarQuery(`INSERT INTO Chats (nombre, foto) VALUES
            ("${req.body.nombre}", "${req.body.foto}")`); //Pasarle como parámetro el nombre de usuario, de acá en más nos manejaremos con el id de usuario
    let respuesta = await realizarQuery(`SELECT MAX(id_chat) AS id FROM Chats`);
    await realizarQuery(`INSERT INTO UsuariosEnChat (id_chat, id_usuario) VALUES
                (${respuesta[0].id}, ${req.body.id_usuario})`);
    res.send({ mensaje: respuesta });
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message });
  }
});

//Pedidos tabla mensajes
app.post("/insertMensaje", async function (req, res) {
  try {
    //Este condicional corrobora que exista algun usuario con ese mail
    let fechaActual = new Date();
    let fechaSql = fechaActual.toISOString();
    let fecha = fechaSql.slice(0, -1);
    await realizarQuery(`INSERT INTO Mensajes (fecha, contenido, leido, id_chat, id_usuario) VALUES
            ("${fecha}", "${req.body.contenido}", ${0}, ${req.body.id_chat}, ${req.body.id_usuario})`);
    res.send({ mensaje: "Mensaje guardado" });
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message });
  }
});
