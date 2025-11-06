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

  const req = socket.request;

  socket.on("joinRoom", (data) => {
    req.session.user = data.user;
    console.log("Este es req.user ", req.session.user)
    console.log("🚀 ~ io.on ~ req.session.room:", data.room);
    if (req.session.room != undefined){
      socket.leave(req.session.room);
    }
    req.session.room = data.room;
    socket.join(req.session.room);


    io.to(req.session.room).emit("joined_OK_room", {
      user: req.session.user,
      room: req.session.room,
    });
    console.log("Este es el room ", req.session.room)
    console.log("Este es el user ", req.session.user)
  });

  socket.on("enviarIdsDeJugadores", (data)=>{
    console.log(data)
    io.to(req.session.room).emit("recibirIdsDeJugadores", {
      data: data
    })
  })

  socket.on("partidaInitSend", (data) => {
    io.to(req.session.room).emit("partidaInitReceive", {
      message: "Se recibio el evento partidaInit"
    })
    console.log("Se esta iniciando la partida")
  })

  socket.on("iniciarDentroDeLaPartida", (data) => {
    io.to(req.session.room).emit("iniciarDentroDeLaPartida", {
      jugadores: data.jugadores
    })
    console.log("Se esta iniciando la partida desde dentro")
  })

  socket.on("terminarPartida", (data) => {
    io.to(req.session.room).emit("terminarPartida", {

    })
    console.log("La partida ha terminado")
  })

  socket.on("cambioRonda", (data) => {
    io.to(req.session.room).emit("cambioRonda", {
      jugadores: data
    })
  })

  socket.on("cambioTurno", (data) => {
    data.index = data.index + 1
    io.to(req.session.room).emit("cambioTurno", {
      jugadores: data.jugadores,
      palabra: data.palabra,
      index: data.index
    })
  })

  socket.on("pingAll", (data) => {
    console.log("PING ALL: ", data);
    io.emit("pingAll", { event: "Ping to all", message: data });
  });

  socket.on('leaveRoomAdmin', (data) => {
    io.to(req.session.room).emit("leftRoomAdmin", {
      message: "Has abandonado la partida"
    })
    socket.leave(req.session.room);
  })

  socket.on("leaveRoomPlayer", (data)=>{
    io.to(req.session.room).emit("leftRoomPlayer",{
      user: data
    }
    )
  })

  socket.on("sendMessage", (data) => {
    io.to(req.session.room).emit("newMessage", {
      message: data.message,
      room: data.room,
    });
  })
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
    console.log(req.query)
    respuesta = await realizarQuery(
      `SELECT * FROM UsuariosKey WHERE id_usuario = "${req.query.id}"`
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

app.get("/traerTodosUsuarios", async function (req, res) {
  try {
    respuesta = await realizarQuery(
      `SELECT * FROM UsuariosKey`
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


app.get("/ingresarUsuario", async function (req, res) {
  try {
    let checkNombre = await realizarQuery(
      `SELECT nombre FROM UsuariosKey WHERE nombre = "${req.query.nombre}"`
    );
    if (checkNombre.length === 0) {
      res.send({ id_usuario: "-1" });
      return;
    }
    let checkContraseña = await realizarQuery(
      `SELECT contraseña FROM UsuariosKey WHERE nombre = "${req.query.nombre}" AND contraseña = "${req.query.contraseña}"`
    );
    if (checkContraseña.length === 0) {
      res.send({ id_usuario: "-2" });
      return;
    }
    let respuesta = await realizarQuery(
      `SELECT id_usuario FROM UsuariosKey WHERE nombre = "${req.query.nombre}"`
    );
    res.send(respuesta);
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message });
  }
});

app.get("/traerFotoUsuario", async function (req, res) {
  try {
    let foto = await realizarQuery(`SELECT foto FROM UsuariosKey WHERE id_usuario = "${req.query.id}"`)
    res.send({ foto: foto })
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message });
  }
}
)

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
      res.send({ respuesta });
    } else {
      res.send({ id: "-1" });
    }
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message });
  }
});


//ELIMINAR USUARIO ELIMINAR USUARIO ELIMINAR USUARIO ELIMINAR USUARIO ELIMINAR USUARIO ELIMINAR USUARIO 


app.put('/eliminarUsuario', async function (req, res) {
  try {
    const username = req.body.username;

    // Actualizar la partida en la base de datos
    await realizarQuery(`
      UPDATE UsuariosKey
      SET estaActivo = false
      WHERE nombre = "${username}"
    `);

    res.send({ mensaje: "Se ha borrao el uchuario" });
  } catch (error) {
    res.send({ mensaje: "Error al borrar usuario", error: error.message });
  }
});

//AMIGOS---------------------------------------------------------------------------------------------------
app.get('/traerAmigos', async function (req, res) {
  try {
    const idUsuario = req.query.id;

    let respuesta = await realizarQuery(`
            SELECT 
                UsuariosKey.id_usuario,
                UsuariosKey.nombre,
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


app.post('/insertarAmigos', async function (req, res) {
  try {
    let check = await realizarQuery(`SELECT id_relacion FROM Relaciones WHERE (id_usuario1 = "${req.body.id}" AND id_usuario2 = "${req.body.id2}") OR (id_usuario1 = "${req.body.id2}" AND id_usuario2 = "${req.body.id}")`);
    if (check.length == 0) {     //Este condicional corrobora que exista algun usuario con ese mail
      await realizarQuery(`INSERT INTO Relaciones ( id_usuario1, id_usuario2) VALUES
                ("${req.body.id}", "${req.body.id2}")`); //Si no existe, inserta la solicitud
      await realizarQuery(`DELETE FROM Solicitudes WHERE id_solicitud = "${req.body.id_solicitud}"
        `);
      res.send({ res: 1 })
    } else {
      res.send({ res: -1 }) //Si ya existe, devuelve -1
    };
  } catch (error) {
    res.send({ mensaje: "Tuviste un error", error: error.message })
  }
})


// SOLICITUDES DE AMISTAD----------------------------------------------------------------------------------

app.get('/traerSolicitudes', async function (req, res) {
  try {
    const idUsuario = req.query.id;

    let respuesta = await realizarQuery(`
            SELECT 
                Solicitudes.id_solicitud,
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
            DELETE FROM Solicitudes WHERE id_solicitud = "${id_solicitud}"
        `);
    res.send({ mensaje: "Solicitud eliminada correctamente" });
  } catch (error) {
    res.send({ mensaje: "Error al eliminar solicitud", error: error.message });
  }
});

app.post('/insertarSolicitud', async function (req, res) {
  try {
    let check = await realizarQuery(`SELECT id_solicitud FROM Solicitudes WHERE (id_usuario_envio = "${req.body.id}" AND id_usuario_recibo = "${req.body.id_envio}") OR (id_usuario_envio = "${req.body.id_envio}" AND id_usuario_recibo = "${req.body.id}")`);
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

app.post('/crearPartida', async function (req, res) {
  try {
    const { id_usuario_admin } = req.body;

    // Generar un código random de 5 letras
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let codigo_entrada = '';
    for (let i = 0; i < 5; i++) {
      codigo_entrada += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    // Crear la partida en la base de datos
    await realizarQuery(`
      INSERT INTO Partidas (activa, codigo_entrada, id_usuario_admin, id_usuario_ganador)
      VALUES (1, "${codigo_entrada}", "${id_usuario_admin}", NULL)
    `);

    let respuesta = await realizarQuery(`SELECT MAX(id_partida) AS id_partida FROM Partidas`)
    res.send({ id_partida: respuesta });

  } catch (error) {
    res.send({ mensaje: "Error al crear partida", error: error.message });
  }
});

//actualizar valores partida actualiara a false cuando termine la partida y establece al usuario ganador que recibe del body
app.put('/actualizarValoresPartidaFalse', async function (req, res) {
  try {
    const { id_partida, } = req.body;

    // Actualizar la partida en la base de datos
    await realizarQuery(`
      UPDATE Partidas
      SET activa = 0,
      WHERE id_partida = "${id_partida}"
    `);

    res.send({ mensaje: "Partida actualizada exitosamente" });
  } catch (error) {
    res.send({ mensaje: "Error al actualizar partida", error: error.message });
  }
});

app.put('/actualizarValoresPartidaTrue', async function (req, res) {
  try {
    const { id_partida, } = req.body;

    // Actualizar la partida en la base de datos
    await realizarQuery(`
      UPDATE Partidas
      SET activa = 1,
      WHERE id_partida = "${id_partida}"
    `);

    res.send({ mensaje: "Partida actualizada exitosamente" });
  } catch (error) {
    res.send({ mensaje: "Error al actualizar partida", error: error.message });
  }
});

app.get('/chequearUsuariosPartida', async function (req, res) {
  try {
    const idPartida = req.query.id;

    let respuesta = await realizarQuery(`
      SELECT UsuariosKey.id_usuario, UsuariosKey.nombre, UsuariosKey.foto
      FROM UsuariosKey
      INNER JOIN UsuariosEnPartida
      ON UsuariosKey.id_usuario = UsuariosEnPartida.id_usuario
      WHERE UsuariosEnPartida.id_partida = "${idPartida}"
    `);

    res.send(respuesta);
  } catch (error) {
    res.send({ mensaje: "Error al traer los usuarios de la partida", error: error.message });
  }
});

// app.get('/traerPartidasActivas', async function (req, res) {
//     try {
//         const idUsuario = req.query.id;
//         let respuesta = await realizarQuery(`
//             SELECT 
//                 p.id_partida,
//                 p.codigo_entrada,
//                 p.id_usuario_admin,
//                 p.id_usuario_ganador
//             FROM Partidas p
//             INNER JOIN UsuariosEnPartida uep 
//                 ON p.id_partida = uep.id_partida
//             WHERE uep.id_usuario = "${idUsuario}"
//                 AND p.activa = 1
//         `);

//         if (respuesta.length > 0) {
//             res.send(respuesta);
//         } else {
//             res.send([]);
//         }
//     } catch (error) {
//         res.send({ 
//             mensaje: "Error al obtener partidas activas", 
//             error: error.message 
//         });
//     }
// });


app.post('/AgregarUsuarioAPartida', async function (req, res) {
  try {
    const { id_partida, id_usuario } = req.body;

    // Verificar si el usuario ya está en la partida
    let check = await realizarQuery(`SELECT * FROM UsuariosEnPartida WHERE id_partida = "${id_partida}" AND id_usuario = "${id_usuario}"`);
    if (check.length > 0) {
      res.send({ mensaje: "El usuario ya está en la partida" });
      return;
    }
    // Agregar el usuario a la partida
    await realizarQuery(`
            INSERT INTO UsuariosEnPartida (id_partida, id_usuario)
            VALUES ("${id_partida}", "${id_usuario}")
        `);
    res.send({ mensaje: "Usuario agregado a la partida exitosamente" });
  } catch (error) {
    res.send({ mensaje: "Error al agregar usuario a la partida", error: error.message });
  }
});


app.get('/traerPartidasActivasAmigos', async function (req, res) {
  try {
    const idUsuario = req.query.id;

    let amigos = [];
    let partidasAmigosAdmin = [];

    // Buscar relaciones del usuario
    let rta1 = await realizarQuery(`
            SELECT * 
            FROM Relaciones 
            WHERE id_usuario1 = "${idUsuario}" OR id_usuario2 = "${idUsuario}"
        `);

    // Obtener los IDs de amigos
    for (let i = 0; i < rta1.length; i++) {
      if (rta1[i].id_usuario1 == idUsuario) {
        amigos.push(rta1[i].id_usuario2);
      } else {
        amigos.push(rta1[i].id_usuario1);
      }
    }

    //  Buscar partidas activas donde los amigos sean admin
    for (let i = 0; i < amigos.length; i++) {
      let rta2 = await realizarQuery(`
                SELECT 
                    Partidas.id_partida,
                    Partidas.codigo_entrada,
                    Partidas.id_usuario_admin,
                    UsuariosKey.nombre AS admin_nombre,
                    Partidas.id_usuario_ganador
                FROM Partidas
                INNER JOIN UsuariosKey 
                    ON Partidas.id_usuario_admin = UsuariosKey.id_usuario
                WHERE Partidas.id_usuario_admin = "${amigos[i]}" 
                  AND Partidas.activa = 1
            `);

      if (rta2.length > 0) {
        partidasAmigosAdmin.push(...rta2);
      }
    }

    res.send(partidasAmigosAdmin);

  } catch (error) {
    res.send({
      mensaje: "Error al obtener partidas activas de amigos",
      error: error.message
    });
  }
});

app.get('/traerPartidaPorCodigo', async function (req, res) {
  try {
    let respuesta = await realizarQuery(`
            SELECT * FROM Partidas WHERE codigo_entrada = "${req.query.codigo.toUpperCase()}" AND activa = 1
        `);
    console.log(respuesta);
    if (respuesta.length > 0) {
      res.send(respuesta)
    } else {
      res.send({ mensaje: "No se encontró una partida activa con ese código" });
      return;
    }
  } catch (error) {
    res.send({ mensaje: "Error al traer partida por código", error: error.message });
  }
});

app.get('/traerCodigo', async function (req, res) {
      const { id_partida} = req.body;
  try {
      let respuesta = await realizarQuery(`
            SELECT codigo_entrada FROM Partidas WHERE id_partida = "${id_partida}" AND activa = 1
        `);
    console.log(respuesta);
    if (respuesta.length > 0) {
      res.send(respuesta)
    } else {
      res.send({ mensaje: "Error, no existe esa partida" });
      return;
    }
  } catch (error) {
    res.send({ mensaje: "Error al traer partida por código", error: error.message });
  }
});

