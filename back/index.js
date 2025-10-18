var express = require("express"); //Tipo de servidor: Express
var bodyParser = require("body-parser"); //Convierte los JSON
const cors = require("cors");
const session = require("express-session"); // Para el manejo de las variables de sesión
const { realizarQuery } = require("./modulos/mysql");
var multer = require("multer")// Middleware para manejar multipart/form-data (para la foto)

const upload = multer({ storage: multer.memoryStorage() }); // Configuración de multer para almacenar en memoria la foto y luego dividir entre req.body y req.file
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
  console.log(`Servidor NodeJS corriendo en http://localhost:${port}`);
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

//USUARIOS-------------------------------------------------------------------------------------------------

app.get("/traerDatosUsuarios", async function (req, res) {
  try {
    respuesta = await realizarQuery(
      `SELECT * FROM UsuariosKey WHERE id_usuario = "${req.query.id}"`
    );
    console.log(respuesta);
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

app.get("/traerTodosUsuarios", async function (req, res) {
  try {
    respuesta = await realizarQuery(
      `SELECT * FROM UsuariosKey`
    );
    console.log(respuesta);
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


app.get("/ingresarUsuario", async function (req, res) {
  try {
    let checkNombre = await realizarQuery(
      `SELECT nombre FROM UsuariosKey WHERE nombre = "${req.query.nombre}"`
    );
    if (checkNombre.length === 0) {
      res.send({ id: "-1" });
      return;
    }
    let checkContraseña = await realizarQuery(
      `SELECT contraseña FROM UsuariosKey WHERE nombre = "${req.query.nombre}" AND contraseña = "${req.query.contraseña}"`
    );
    if (checkContraseña.length === 0) {
      res.send({ id: "-2" });
      return;
    }
    let respuesta = await realizarQuery(
      `SELECT id_usuario FROM UsuariosKey WHERE nombre = "${req.query.nombre}"`
    );
    res.send({ id: respuesta });
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message });
  }
});

app.post("/insertarUsuario", upload.single("foto"), async function (req, res) { // Con upload.single("foto") manejo la subida de la foto y la division de datos en req.body y req.file
  try {
    let check = await realizarQuery(
      `SELECT nombre FROM UsuariosKey WHERE nombre = "${req.body.nombre}"`
    );
    if (check.length == 0) {
      const foto = req.file ? req.file.buffer : null; // Obtiene el buffer de la foto subida, el dato que se inserta en SQL, en blob, y en caso que no haya lo declara como null
        await realizarQuery(
          "INSERT INTO UsuariosKey (nombre, contraseña, foto) VALUES (?, ?, ?)",
          [req.body.nombre, req.body.contrasena, foto]) //Se inserta el buffer en la base de datos, no se podia de la anterior manera porque el binario se traducia a string (o eso entendí)
        let respuesta = await realizarQuery(
          `SELECT id_usuario FROM UsuariosKey WHERE nombre = "${req.body.nombre}"`
        );
        res.send(respuesta);
      }else {
      res.send({ id: "-1" });
    }
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message });
  }
});

//AMIGOS------------------------------------------------------ --------------------------------------------
app.get('/traerAmigos', async function (req, res) {
    try {
        const idUsuario = req.query.id;

        let respuesta = await realizarQuery(`
            SELECT 
                UsuariosKey.id_usuario,
                UsuariosKey.nombre,
                usuarioskey.mail
                UsuariosKey.foto
            FROM Relaciones
            INNER JOIN UsuariosKey 
                ON (UsuariosKey.id_usuario = Relaciones.id_usuario1 OR UsuariosKey.id_usuario = Relaciones.id_usuario2)
            WHERE (Relaciones.id_usuario1 = "${idUsuario}" OR Relaciones.id_usuario2 = "${idUsuario}")
              AND UsuariosKey.id_usuario != "${idUsuario}"
        `);

        res.send(respuesta);

    } catch (error) {
        res.send({ mensaje: "Error al traer amigos", error: error.message });
    }
});

// SOLICITUDES DE AMISTAD----------------------------------------------------------------------------------

app.get('/traerSolicitudes', async function (req, res) {
    try {
        const idUsuario = req.query.id;

        let respuesta = await realizarQuery(`
            SELECT 
                solicitudes.id_solicitud,
                UsuariosKey.id_usuario,
                UsuariosKey.nombre,
                UsuariosKey.foto
            FROM Solicitudes
            INNER JOIN UsuariosKey 
                ON UsuariosKey.id_usuario = Solicitudes.id_usuario_envio
            WHERE Solicitudes.id_usuario_recibo = "${idUsuario}"
        `);

        res.send(respuesta);

    } catch (error) {
        res.send({ mensaje: "Error al traer solicitudes", error: error.message });
    }
});

app.delete('/eliminarSolicitud', async function (req, res) {
    try {
        const id_solicitud = req.body.id;
        await realizarQuery(`
            DELETE FROM Solicitudes 
            WHERE id_solicitud = "${id_solicitud}"
        `);
        res.send({ mensaje: "Solicitud eliminada correctamente" });
    } catch (error) {
        res.send({ mensaje: "Error al eliminar solicitud", error: error.message });
    }
});

app.post('/insertarSolicitud', async function (req, res) {
    try {
        let check = await realizarQuery(`SELECT id_solicitud FROM Solicitudes WHERE id_solicitud = "${req.body.id}"`);
        if (check.length == 0) {     //Este condicional corrobora que exista algun usuario con ese mail
            await realizarQuery(`INSERT INTO Solicitudes ( id_usuario_envio, id_usuario_recibo) VALUES
                ("${req.body.id}", "${req.body.id_envio}")`);  //Si no existe, inserta la solicitud
            res.send({ res: 1 })
        } else {
            res.send({ res: -1 }) //Si ya existe, devuelve -1
        };
    } catch (error) {
        res.send({ mensaje: "Tuviste un error", error: error.message })
    }
})

