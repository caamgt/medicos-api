/* -------------------------------------------------------------------------- */
/*             Buscar todos los registros que están en estado true            */
/* -------------------------------------------------------------------------- */
const handleGetTipoSangre = (db, req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    db.select('*')
        .from('tiposangre')
        .offset(desde)
        .limit(limite)
        .where('estado', true)
        .orderBy('nombre', 'asc')
        .returning()
        .then(resp => {
            if (resp < 1) {
                return res.json('No hay datos');
            } else {
                return db('tiposangre')
                    .count('estado', {as: 'total'})
                    .where('estado', true)
                    .then(data => {
                        return res.json({
                            ok: true,
                            TipoSangre: resp,
                            totalMostrar: resp.length,
                            totalRegistros: data
                        });
                    })
                    .catch(error => res.status(401).json('Noooooo'));
            }
        })
        .catch(error => res.status(401).json({
            ok: false,
            message: 'Error'
        }));
}

/* -------------------------------------------------------------------------- */
/*                                Buscar por ID                               */
/* -------------------------------------------------------------------------- */
const handleSearchById = (db, req, res) => {
    const {id} = req.params;
    db.select('*')
        .from('tiposangre')
        .where('id', id)
        .returning('*')
        .then(tiposangre => {
            if (tiposangre.length === 0) {
                return res.json('No hay datos')
            } else {
                return res.json({
                    ok: true,
                    tipoSangre: tiposangre[0]
                });
            }
        })
        .catch(error => res.status(401).json({
            ok: false,
            message: 'Error'
        }))
}

/* -------------------------------------------------------------------------- */
/*                               Nuevo registro                               */
/* -------------------------------------------------------------------------- */

const handleNewTipoSangre = (db, req, res, validationResult) => {
    const {nombre, descripcion} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
    } else {
        db('tiposangre')
            .insert({nombre, descripcion, fecha_creacion: new Date()})
            .returning('*')
            .then(resp => {
                return res.json({
                    ok: true,
                    tipoSangre: resp[0],
                    message: 'Registro agregado exitosamente'
                });
            })
            .catch(error => res.status(401).json({
                ok: false,
                message: 'Error, algo salió mal'
            }))
    }
}

const handleEditTipoSangre = (db, req, res, validationResult) => {
    const {id} = req.params;
    const {nombre, descripcion} = req.body;
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()[0].msg});
    } else {
        db('tiposangre')
            .where('id', id)
            .update({nombre, descripcion, fecha_actualizacion: new Date()})
            .returning('*')
            .then(resp => {
                if (!resp) {
                    return res.status(401).json({
                        ok: false,
                        message: 'Algo salió mal'
                    });
                } else {
                    return res.json(resp[0]);
                }
            })
            .catch(error => res.status(404).json({
                ok: false,
                message: 'Error, algo salió mal'
            }));
    }
}

const handleEnableTipoSangre = (db, req, res, validationResult) => {
    const {id} = req.params;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        db('tiposangre')
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
                        message: 'Se habilitó exitosamente el registro'
                    });
                }
            })
            .catch(error => res.status(401).json({
                ok: false,
                message: 'Error, algo salió mal'
            }))
    }
}

const handleDisableTipoSangre = (db, req, res, validationResult) => {
    const {id} = req.params;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        db('tiposangre')
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
                message: 'Error, algo salió mal'
            }))
    }
}

module.exports = {
    handleGetTipoSangre,
    handleNewTipoSangre,
    handleEditTipoSangre,
    handleEnableTipoSangre,
    handleDisableTipoSangre,
    handleSearchById
}