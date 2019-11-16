/* -------------------------------------------------------------------------- */
/*               Buscar los registros de la tabla paginando              */
/* -------------------------------------------------------------------------- */
const handleSearchPaciente = (db, req, res) => {
    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);

    db.select('*')
        .from('paciente')
        .offset(desde)
        .limit(limite)
        .where('estado', true)
        .orderBy('nombre', 'asc')
        .returning()
        .then(data => {
            if (!data) {
                return res.json('No hay datos');
            } else {
                return db('paciente')
                    .count('estado', {as: 'total'})
                    .where('estado', true)
                    .then(resp => res.json({
                        data: data,
                        totalMostrar: data.length,
                        totalRegistros: resp[0]
                    }))
                    .catch(error => res.status(401).json('Nooo'));
            }
        })
        .catch(error => res.status(401).json({
            ok: false,
            message: 'Error, algo salió mal'
        }));
}

/* -------------------------------------------------------------------------- */
/*                           Crear un nuevo registro                          */
/* -------------------------------------------------------------------------- */
const handleSearchPacienteById = (db, req, res) => {
    const {id} = req.params;

    db.select('*')
        .from('paciente')
        .where({'id': id, 'estado': true})
        .then(data => {
            if (data < 1) {
                return res.json('No hay datos');
            } else {
                return res.json({
                    ok: true,
                    data: data[0]
                });
            }
        })
        .catch(error => res.status(401).json('Error, algo salió mal'))
}

/* -------------------------------------------------------------------------- */
/*                               Nuevo registro                               */
/* -------------------------------------------------------------------------- */
const handleNewPaciente = (db, req, res, validationResult) => {
    const errors = validationResult(req);
    const {
        nit, 
        nombre, 
        apellido, 
        email, 
        fecha_nacimiento, 
        celular, 
        telefono1, 
        telefono2, 
        direccion, 
        avatar, 
        peso, 
        estatura, 
        id_tiposangre, 
        id_sexo,
        id_profesion} = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
      }
    db('paciente')
        .insert({
            nit, 
            nombre, 
            apellido, 
            email, 
            fecha_nacimiento, 
            celular, 
            telefono1, 
            telefono2, 
            direccion, 
            avatar, 
            peso, 
            estatura, 
            id_tiposangre, 
            id_sexo,
            id_profesion
        })
        .then(result => {
            return res.status(201).json({
                ok: true,
                message: 'Registro agregado exitosamente'
            })
        })
        .catch(error => res.status(401).json(error.detail));

}

/* -------------------------------------------------------------------------- */
/*                           Editar registros por ID                          */
/* -------------------------------------------------------------------------- */
const handleEditPaciente = (db, req, res, validationResult) => {
    const error = validationResult(req);
    const {id} = req.params;
    const {
        nit, 
        nombre, 
        apellido, 
        email, 
        fecha_nacimiento, 
        celular, 
        telefono1, 
        telefono2, 
        direccion, 
        avatar, 
        peso, 
        estatura, 
        id_tiposangre, 
        id_sexo,
        id_profesion} = req.body;
    if(!error.isEmpty()) {
        return res.status(422).json({errors: error.array()[0].msg});
    }
    db('paciente')
        .where('id', id)
        .update({ 
            nit, 
            nombre, 
            apellido, 
            email, 
            fecha_nacimiento, 
            celular, 
            telefono1, 
            telefono2, 
            direccion, 
            avatar, 
            peso, 
            estatura, 
            id_tiposangre, 
            id_sexo,
            id_profesion, 
            fecha_actualizacion: new Date()})
        .returning('*')
        .then(resp => {
            if (resp < 1) {
                return res.status(401).json({
                    ok: false,
                    message: 'Algo salió mal'
                });
            } else {
                return res.json(resp[0]);
            }
        })
        .catch(error => res.status(404).json('Imposible editar el registro'));
}

/* -------------------------------------------------------------------------- */
/*                        Deshabilitar registro por ID                        */
/* -------------------------------------------------------------------------- */
const handleDisablePaciente = (db, req, res) => {
    const {id} = req.params;
    db('paciente')
        .where('id', id)
        .update({estado: false})
        .then(resp => {
            if (!resp) {
                return res.status(401).json({
                    ok: false,
                    message: 'Algo salió mal'
                });
            } else {
                return res.json({
                    ok: true,
                    message: 'Se deshabilito correctamente el registro'
                });
            }
        })
        .catch(error => res.status(401).json({
            ok: false,
            message: 'Error en la petición'
        }));
}

/* -------------------------------------------------------------------------- */
/*                         Habilitar  registros por ID                        */
/* -------------------------------------------------------------------------- */
const handleEnablePaciente = (db, req, res) => {
    const {id} = req.params;
    db('paciente')
        .where('id', id)
        .update({estado: true})
        .then(resp => {
            if (!resp) {
                return res.status(401).json({
                    ok: false,
                    message: 'Algo salió mal'
                });
            } else {
                return res.json({
                    ok: true,
                    message: 'Se habilitó correctamente el registro'
                });
            }
        })
        .catch(error => res.status(401).json({
            ok: false,
            message: 'Error en la petición'
        }));
}

module.exports = {
    handleSearchPaciente,
    handleSearchPacienteById,
    handleNewPaciente,
    handleEditPaciente,
    handleDisablePaciente,
    handleEnablePaciente
}