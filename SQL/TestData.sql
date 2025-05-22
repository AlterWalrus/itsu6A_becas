INSERT INTO `checktec`.`usuario` (`id_Usuario`, `Nombre`, `Apellido_paterno`, `Apellido_materno`, `Correo`, `Usuario`, `Contrasenia`, `Rol`, `Ultimo_acceso`) VALUES ('1', 'Rubén Ociel', 'Medina', 'Pérez', 'nose', 'ruben', '123', 'Admin', '2025-02-04 12:00:00');
INSERT INTO `checktec`.`usuario` (`id_Usuario`, `Nombre`, `Apellido_paterno`, `Apellido_materno`, `Correo`, `Usuario`, `Contrasenia`, `Rol`, `Ultimo_acceso`) VALUES ('2', 'Rubén', 'Zamudio', 'González', 'nose2', 'ruben2', '234', 'Miembro_CESA', '2025-02-04 12:00:00');

INSERT INTO `checktec`.`alumno` (`id_Alumno`, `Nombre`, `Apellido_paterno`, `Apellido_materno`, `No_Control`, `id_Carrera`, `Semestre`, `id_Cafeteria`, `Correo`, `Telefono`, `estatus_beca`, `Huella`) VALUES ('1', 'Pepito', 'Pipipu', 'Pirulin', '22123123', '1', '2', '1', 'pepito@gmail.com', '45211112312', '1', '999');
INSERT INTO `checktec`.`alumno` (`id_Alumno`, `Nombre`, `Apellido_paterno`, `Apellido_materno`, `No_Control`, `id_Carrera`, `Semestre`, `id_Cafeteria`, `Correo`, `Telefono`, `estatus_beca`, `Huella`) VALUES ('2', 'Benito', 'Comela', 'Sopa', '11223344', '1', '3', '1', 'benito@gmail.com', '45212312312', '1', '999');
INSERT INTO `checktec`.`alumno` (`id_Alumno`, `Nombre`, `Apellido_paterno`, `Apellido_materno`, `No_Control`, `id_Carrera`, `Semestre`, `id_Cafeteria`, `Correo`, `Telefono`, `estatus_beca`, `Huella`) VALUES ('3', 'Rosa', 'Meridiano', 'Wiriri', '32323232', '2', '2', '2', 'rosa@gmail.com', '45298787665', '1', '999');
INSERT INTO `checktec`.`alumno` (`id_Alumno`, `Nombre`, `Apellido_paterno`, `Apellido_materno`, `No_Control`, `id_Carrera`, `Semestre`, `id_Cafeteria`, `Correo`, `Telefono`, `estatus_beca`, `Huella`) VALUES ('4', 'Eduardo', 'Onganiza', 'Recorta', '44543543', '5', '1', '1', 'lalo@gmail.com', '45232132121', '1', '999');
INSERT INTO `checktec`.`alumno` (`id_Alumno`, `Nombre`, `Apellido_paterno`, `Apellido_materno`, `No_Control`, `id_Carrera`, `Semestre`, `id_Cafeteria`, `Correo`, `Telefono`, `estatus_beca`, `Huella`) VALUES ('5', 'Kentoky', 'Cabeza', 'De Becerra', '12312312', '4', '1', '3', 'zaca@gmail.com', '45265765756', '0', '999');

INSERT INTO `checktec`.`asistencia` (`id_Asistencia`, `Fecha_asistencia`, `id_Alumno`) VALUES ('1', '2025-04-01 12:00:00', '1');
INSERT INTO `checktec`.`asistencia` (`id_Asistencia`, `Fecha_asistencia`, `id_Alumno`) VALUES ('2', '2025-04-02 12:00:00', '2');
INSERT INTO `checktec`.`asistencia` (`id_Asistencia`, `Fecha_asistencia`, `id_Alumno`) VALUES ('3', '2025-04-03 12:00:00', '2');
INSERT INTO `checktec`.`asistencia` (`id_Asistencia`, `Fecha_asistencia`, `id_Alumno`) VALUES ('4', '2025-04-01 12:00:00', '3');
INSERT INTO `checktec`.`asistencia` (`id_Asistencia`, `Fecha_asistencia`, `id_Alumno`) VALUES ('5', '2025-04-02 12:00:00', '3');
INSERT INTO `checktec`.`asistencia` (`id_Asistencia`, `Fecha_asistencia`, `id_Alumno`) VALUES ('6', '2025-04-03 12:00:00', '3');

INSERT INTO `checktec`.`asistencia` (`Fecha_asistencia`, `id_Alumno`) VALUES ('2025-05-12 12:00:00', '1');
INSERT INTO `checktec`.`asistencia` (`Fecha_asistencia`, `id_Alumno`) VALUES ('2025-05-13 12:00:00', '1');
INSERT INTO `checktec`.`asistencia` (`Fecha_asistencia`, `id_Alumno`) VALUES ('2025-05-12 12:00:00', '2');
INSERT INTO `checktec`.`asistencia` (`Fecha_asistencia`, `id_Alumno`) VALUES ('2025-05-11 12:00:00', '1');
INSERT INTO `checktec`.`asistencia` (`Fecha_asistencia`, `id_Alumno`) VALUES ('2025-05-14 12:00:00', '3');
INSERT INTO `checktec`.`asistencia` (`Fecha_asistencia`, `id_Alumno`) VALUES ('2025-05-13 12:00:00', '3');
