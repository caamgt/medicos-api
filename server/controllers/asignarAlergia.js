const handleAsignarAlergia = (db, req, res, validationResult) => {
    const {paciente, alergia} = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(422).json({errors: error.array()[0].msg});
    }
    db('paciente_alergia')
        .returning('*')
        .insert({
            id_paciente: paciente, 
            id_alergia: alergia
        })
        .then(resp => {
            return res.status(200).json(resp[0]);
        })
        .catch(error => res.status(401).json('Error, algo salió mal'));
}

module.exports = {
    handleAsignarAlergia
}