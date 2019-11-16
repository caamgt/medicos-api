/* -------------------------------------------------------------------------- */
/*               Buscar los registros de la tabla sexo paginando              */
/* -------------------------------------------------------------------------- */
const handleSearchSexo = (db, req, res) => {
    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);

    db.select('*')
        .from('sexo')
        .offset(desde)
        .limit(limite)
        .where('estado', true)
        .orderBy('nombre', 'asc')
        .returning()
        .then(sexo => {
            if (sexo < 1) {
                return res.json('No hay datos');
            } else {
                return db('sexo')
                    .count('estado', {as: 'total'})
                    .where('estado', true)
                    .then(resp => res.json({
                        profesiones: sexo,
                        totalMostrar: sexo.length,
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
const handleSearchSexoById = (db, req, res) => {
    const {id} = req.params;

    db.select('*')
        .from('sexo')
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
const handleNewSexo = (db, req, res, validationResult) => {
    const errors = validationResult(req);
    const {nombre} = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
      }
    db('sexo')
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
const handleEditSexo = (db, req, res, validationResult) => {
    const error = validationResult(req);
    const {id} = req.params;
    const {nombre} = req.body;
    if(!error.isEmpty()) {
        return res.status(422).json({errors: error.array()[0].msg});
    }
    db('sexo')
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
const handleDisableSexo = (db, req, res) => {
    const {id} = req.params;
    db('sexo')
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
const handleEnableSexo = (db, req, res) => {
    const {id} = req.params;
    db('sexo')
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
    handleSearchSexo,
    handleSearchSexoById,
    handleNewSexo,
    handleEditSexo,
    handleDisableSexo,
    handleEnableSexo
}