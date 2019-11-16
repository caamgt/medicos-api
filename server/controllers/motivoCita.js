/* -------------------------------------------------------------------------- */
/*               Buscar los registros de la tabla paginando              */
/* -------------------------------------------------------------------------- */
const handleSearchMotivoCita = (db, req, res) => {
    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);

    db.select('*')
        .from('motivocita')
        .offset(desde)
        .limit(limite)
        .where('estado', true)
        .orderBy('nombre', 'asc')
        .returning()
        .then(data => {
            if (!data) {
                return res.json('No hay datos');
            } else {
                return db('motivocita')
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
const handleSearchMotivoCitaById = (db, req, res) => {
    const {id} = req.params;

    db.select('*')
        .from('motivocita')
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
const handleNewMotivoCita = (db, req, res, validationResult) => {
    const errors = validationResult(req);
    const {nombre} = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
      }
    db('motivocita')
        .insert({
            nombre: nombre
        })
        .then(result => {
            return res.status(201).json({
                ok: true,
                message: 'Registro agregado exitosamente'
            })
        })
        .catch(error => res.status(401).json('Error'));

}

/* -------------------------------------------------------------------------- */
/*                           Editar registros por ID                          */
/* -------------------------------------------------------------------------- */
const handleEditMotivoCita = (db, req, res, validationResult) => {
    const error = validationResult(req);
    const {id} = req.params;
    const {nombre} = req.body;
    if(!error.isEmpty()) {
        return res.status(422).json({errors: error.array()[0].msg});
    }
    db('motivocita')
        .where('id', id)
        .update({ nombre, fecha_actualizacion: new Date()})
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
const handleDisableMotivoCita = (db, req, res) => {
    const {id} = req.params;
    db('motivocita')
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
const handleEnableMotivoCita = (db, req, res) => {
    const {id} = req.params;
    db('motivocita')
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
    handleSearchMotivoCita,
    handleSearchMotivoCitaById,
    handleNewMotivoCita,
    handleEditMotivoCita,
    handleDisableMotivoCita,
    handleEnableMotivoCita
}