/* -------------------------------------------------------------------------- */
/*               Buscar los registros de la tabla sexo paginando              */
/* -------------------------------------------------------------------------- */
const handleSearchContacto = (db, req, res) => {
    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);

    db.select('*')
        .from('contacto')
        .offset(desde)
        .limit(limite)
        .where('estado', true)
        .orderBy('nombre', 'asc')
        .returning()
        .then(data => {
            if (data.length < 1) {
                return res.json('No hay datos');
            } else {
                return db('contacto')
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
const handleSearchContactoById = (db, req, res) => {
    const {id} = req.params;

    db.select('*')
        .from('contacto')
        .where({'id': id, 'estado': true})
        .then(sexo => {
            if (sexo < 1) {
                return res.json('No hay datos');
            } else {
                return res.json({
                    ok: true,
                    sexo: sexo[0]
                });
            }
        })
        .catch(error => res.status(401).json('Error, algo salió mal'))
}

/* -------------------------------------------------------------------------- */
/*                               Nuevo registro                               */
/* -------------------------------------------------------------------------- */
const handleNewContacto = (db, req, res, validationResult) => {
    const errors = validationResult(req);
    const {
        nombre,
        apellido,
        email,
        celular,
        telefono1,
        telefono2,
        direccion,
        id_parentesco,
        id_paciente
    } = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
      }
    db('contacto')
        .insert({
            nombre,
            apellido,
            email,
            celular,
            telefono1,
            telefono2,
            direccion,
            id_parentesco,
            id_paciente
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
const handleEditContacto = (db, req, res, validationResult) => {
    const error = validationResult(req);
    const {id} = req.params;
    const {
        nombre,
        apellido,
        email,
        celular,
        telefono1,
        telefono2,
        direccion,
        id_parentesco,
        id_paciente
    } = req.body;
    if(!error.isEmpty()) {
        return res.status(422).json({errors: error.array()[0].msg});
    }
    db('contacto')
        .where('id', id)
        .update({ 
            nombre,
            apellido,
            email,
            celular,
            telefono1,
            telefono2,
            direccion,
            id_parentesco,
            id_paciente,
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
const handleDisableContacto = (db, req, res) => {
    const {id} = req.params;
    db('contacto')
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
const handleEnableContacto = (db, req, res) => {
    const {id} = req.params;
    db('contacto')
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
    handleSearchContacto,
    handleSearchContactoById,
    handleNewContacto,
    handleEditContacto,
    handleDisableContacto,
    handleEnableContacto
}