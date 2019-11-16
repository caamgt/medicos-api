/* -------------------------------------------------------------------------- */
/*            Obtener todos los registros que esten en estado true            */
/* -------------------------------------------------------------------------- */
const handleGetProfesion = (db, req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    db.select('*')
        .from('profesion')
        .offset(desde)
        .limit(limite)
        .where('estado', true)
        .orderBy('nombre', 'asc')
        .returning()
        .then(data => {
            if (data < 1) {
                return res.json('No hay informaicón');
            } else {
                return db('profesion')
                    .count('estado', {as: 'total'})
                    .where('estado', true)
                    .then(resp => res.json({
                        profesiones: data,
                        totalMostrar: data.length,
                        totalRegistros: resp
                    }))
                    .catch(error => res.status(401).json('Noooooooo'));
            }
        })
        .catch(error => res.status(401).json('Error'));
}

/* -------------------------------------------------------------------------- */
/*                          Buscar un registro por ID                         */
/* -------------------------------------------------------------------------- */
const handleSearchProfesionById = (db, req, res) => {
    const {id} = req.params;
    db.select('*')
        .from('profesion')
        .where({'id': id, 'estado': true})
        .then(profesion => {
            if (profesion.length === 0) {
                return res.json('No hay información');
            } else {
                return res.json({
                    ok: true,
                    profesion: profesion[0]
                });
            }
        })
        .catch(error => res.status(400).json({
            ok: false,
            message: 'Error, algo salió mal'
        }));
}

/* -------------------------------------------------------------------------- */
/*                               Nuevo registro                               */
/* -------------------------------------------------------------------------- */

const handleNewProfesion = (db, req, res, validationResult) => {
    const errors = validationResult(req);
    const {nombre, descripcion} = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
      }
    db('profesion')
        .insert({
            nombre: nombre,
            descripcion: descripcion
        })
        .then(result => {
            return res.json({
                ok: true,
                message: 'Registro agregado exitosamente'
            })
        })
        .catch(error => res.status(401).json('Error'));

}

/* -------------------------------------------------------------------------- */
/*                           Editar registros por ID                          */
/* -------------------------------------------------------------------------- */

const handleEditProfesion = (db, req, res, validationResult) => {
    const error = validationResult(req);
    const {id} = req.params;
    const {nombre, descripcion} = req.body;
    if(!error.isEmpty()) {
        return res.status(422).json({errors: error.array()[0].msg});
    }
    db('profesion')
        .where('id', id)
        .update({ nombre, descripcion, fecha_actualizacion: new Date()})
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


const handleDisableProfesion = (db, req, res) => {
    const {id} = req.params;
    db('profesion')
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

const handleEnableProfesion = (db, req, res) => {
    const {id} = req.params;
    db('profesion')
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
    handleGetProfesion,
    handleSearchProfesionById,
    handleNewProfesion,
    handleEditProfesion,
    handleDisableProfesion,
    handleEnableProfesion
}