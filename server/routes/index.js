const express = require('express');
const knex = require('knex');
const { check, validationResult} = require('express-validator');
const app = express();

// conección a la DB
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'calfaro',
        password: '',
        database: 'medicos'
    }
});

// Controllers
const profesion = require('../controllers/profesion');
const tipoSangre = require('../controllers/tipoSangre');
const sexo = require('../controllers/sexo');
const parentesco = require('../controllers/parentesco');
const motivoCita = require('../controllers/motivoCita');
const alergia = require('../controllers/alergia');
const paciente = require('../controllers/paciente');
const asignarAlergia = require('../controllers/asignarAlergia');
const contacto = require('../controllers/contacto');
const role = require('../controllers/role');
const puesto = require('../controllers/puesto');

// profesión
app.get('/profesiones/buscar', (req, res) => {profesion.handleGetProfesion(db, req, res)});
app.get('/profesion/:id', (req, res) => {profesion.handleSearchProfesionById(db, req, res)});
app.post('/profesion/new', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape(),
    check('estado').toBoolean(),
    check('fecha_creacion').toDate(),
    check('fecha_actualizacion').toDate()
], (req, res) => {profesion.handleNewProfesion(db, req, res, validationResult)});
app.put('/profesion/edit/:id', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').blacklist().trim().escape(),
    check('estado').toBoolean(),
    check('fecha_creacion').toDate(),
    check('fecha_actualizacion').toDate()
], (req, res) => {profesion.handleEditProfesion(db, req, res, validationResult)});
app.delete('/profesion/disable/:id', [
    check('estado').toBoolean(), 
    check('fecha_creacion').toDate(),
    check('fecha_actualizacion').toDate()
], (req, res) => {profesion.handleDisableProfesion(db, req, res)});
app.put('/profesion/enable/:id', [
    check('estado').toBoolean(), 
    check('fecha_creacion').toDate(),
    check('fecha_actualizacion').toDate()
], (req, res) => {profesion.handleEnableProfesion(db, req, res)});

// tipo de sangre
app.get('/tiposangre/buscar', (req, res) => {tipoSangre.handleGetTipoSangre(db, req, res)});
app.get('/tiposangre/:id', (req, res) => {tipoSangre.handleSearchById(db, req, res)});
app.post('/tiposangre/new', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape(),
    check('estado').toBoolean(),
    check('fecha_creacion').toDate(),
    check('fecha_actualizacion').toDate()
], (req, res) => {tipoSangre.handleNewTipoSangre(db, req, res, validationResult)});
app.put('/tiposangre/edit/:id', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape(),
    check('estado').toBoolean(),
    check('fecha_creacion').toDate(),
    check('fecha_actualizacion').toDate()
], (req, res) => {tipoSangre.handleEditTipoSangre(db, req, res, validationResult)});
app.delete('/tiposangre/disable/:id', [
    check('estado').toBoolean(), 
    check('fecha_creacion').toDate(),
    check('fecha_actualizacion').toDate()
], (req, res) => {tipoSangre.handleDisableTipoSangre(db, req, res, validationResult)});
app.put('/tiposangre/enable/:id', [
    check('estado').toBoolean(), 
    check('fecha_creacion').toDate(),
    check('fecha_actualizacion').toDate()
], (req, res) => {tipoSangre.handleEnableTipoSangre(db, req, res, validationResult)});

// Sexo
app.get('/sexo/buscar', (req, res) => {sexo.handleSearchSexo(db, req, res)});
app.get('/sexo/buscar/:id', (req, res) => {sexo.handleSearchSexoById(db, req, res)});
app.post('/sexo/new', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario')
], (req, res) => {sexo.handleNewSexo(db, req, res, validationResult)});
app.put('/sexo/edit/:id', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario')
], (req, res) => {sexo.handleEditSexo(db, req, res, validationResult)});
app.delete('/sexo/disable/:id', (req, res) => {sexo.handleDisableSexo(db, req, res)});
app.put('/sexo/enable/:id', (req, res) => {sexo.handleEnableSexo(db, req, res)});

// Parentesco
app.get('/parentesco/buscar', (req, res) => {parentesco.handleSearchParentesco(db, req, res)});
app.get('/parentesco/buscar/:id', (req, res) => {parentesco.handleSearchParentescoById(db, req, res)});
app.post('/parentesco/new', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {parentesco.handleNewParentesco(db, req, res, validationResult)});
app.put('/parentesco/edit/:id', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {parentesco.handleEditParentesco(db, req, res, validationResult)});
app.delete('/parentesco/disable/:id', (req, res) => {parentesco.handleDisableParentesco(db, req, res)});
app.put('/parentesco/enable/:id', (req, res) => {parentesco.handleEnableParentesco(db, req, res)});

// Motivo Cita
app.get('/motivocita/buscar', (req, res) => {motivoCita.handleSearchMotivoCita(db, req, res)});
app.get('/motivocita/buscar/:id', (req, res) => {motivoCita.handleSearchMotivoCitaById(db, req, res)});
app.post('/motivocita/new', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {motivoCita.handleNewMotivoCita(db, req, res, validationResult)});
app.put('/motivocita/edit/:id', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {motivoCita.handleEditMotivoCita(db, req, res, validationResult)});
app.delete('/motivocita/disable/:id', (req, res) => {motivoCita.handleDisableMotivoCita(db, req, res)});
app.put('/motivocita/enable/:id', (req, res) => {motivoCita.handleEnableMotivoCita(db, req, res)});

// Alergia
app.get('/alergia/buscar', (req, res) => {alergia.handleSearchAlergia(db, req, res)});
app.get('/alergia/buscar/:id', (req, res) => {alergia.handleSearchAlergiaById(db, req, res)});
app.post('/alergia/new', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {alergia.handleNewAlergia(db, req, res, validationResult)});
app.put('/alergia/edit/:id', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {alergia.handleEditAlergia(db, req, res, validationResult)});
app.delete('/alergia/disable/:id', (req, res) => {alergia.handleDisableAlergia(db, req, res)});
app.put('/alergia/enable/:id', (req, res) => {alergia.handleEnableAlergia(db, req, res)});

// Paciente
app.get('/paciente/buscar', (req, res) => {paciente.handleSearchPaciente(db, req, res)});
app.get('/paciente/buscar/:id', (req, res) => {paciente.handleSearchPacienteById(db, req, res)});
app.post('/paciente/new', [
    check('nit').trim().escape(),
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('apellido').not().isEmpty().trim().escape().withMessage('El apellido es necesario'),
    check('email').isEmail(),
    check('fecha_nacimiento').toDate(),
    check('celular').not().isEmpty().unescape().trim().escape().withMessage('El celular es necesario'),
    check('telefono1').unescape().trim().escape(),
    check('telefono2').unescape().trim().escape(),
    check('direccion').unescape().trim().escape(),
    check('avatar').isEmpty(),
    check('estado').toBoolean(),
    check('peso').isInt().withMessage('Tiene que ser sin decimales'),
    check('estatura').isFloat().withMessage('Tiene que ser decimal'),
    check('id_tiposangre').isNumeric(),
    check('id_sexo').isNumeric()
], (req, res) => {paciente.handleNewPaciente(db, req, res, validationResult)});
app.put('/paciente/edit/:id', [
    check('nit').trim().escape(),
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('apellido').not().isEmpty().trim().escape().withMessage('El apellido es necesario'),
    check('email').isEmail(),
    check('fecha_nacimiento').toDate(),
    check('celular').not().isEmpty().unescape().trim().escape().withMessage('El celular es necesario'),
    check('telefono1').unescape().trim().escape(),
    check('telefono2').unescape().trim().escape(),
    check('direccion').unescape().trim().escape(),
    check('avatar').isEmpty(),
    check('estado').toBoolean(),
    check('peso').isInt().withMessage('Tiene que ser sin decimales'),
    check('estatura').isFloat().withMessage('Tiene que ser decimal'),
    check('id_tiposangre').isNumeric(),
    check('id_sexo').isNumeric()
], (req, res) => {paciente.handleEditPaciente(db, req, res, validationResult)});
app.delete('/paciente/disable/:id', (req, res) => {paciente.handleDisablePaciente(db, req, res)});
app.put('/paciente/enable/:id', (req, res) => {paciente.handleEnablePaciente(db, req, res)});

// Contacto
app.get('/contacto/buscar', (req, res) => {contacto.handleSearchContacto(db, req, res)});
app.get('/contacto/buscar/:id', (req, res) => {contacto.handleSearchContactoById(db, req, res)});
app.post('/contacto/new', [
    check('nombre').isString().not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('apellido').isString().not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('email').isEmail(),
    check('celular').trim().escape(),
    check('telefono1').trim().escape(),
    check('telefono2').trim().escape(),
    check('direccion').trim().escape()
], (req, res) => {contacto.handleNewContacto(db, req, res, validationResult)});
app.put('/contacto/edit/:id', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('apellido').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('email').isEmail(),
    check('celular').trim().escape(),
    check('telefono1').trim().escape(),
    check('telefono2').trim().escape(),
    check('direccion').trim().escape()
], (req, res) => {contacto.handleEditContacto(db, req, res, validationResult)});
app.delete('/contacto/disable/:id', (req, res) => {contacto.handleDisableContacto(db, req, res)});
app.put('/contacto/enable/:id', (req, res) => {contacto.handleEnableContacto(db, req, res)});

// Roles
app.get('/role/buscar', (req, res) => {role.handleSearchRole(db, req, res)});
app.get('/role/buscar/:id', (req, res) => {role.handleSearchRoleById(db, req, res)});
app.post('/role/new', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {role.handleNewRole(db, req, res, validationResult)});
app.put('/role/edit/:id', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {role.handleEditRole(db, req, res, validationResult)});
app.delete('/role/disable/:id', (req, res) => {role.handleDisableRole(db, req, res)});
app.put('/role/enable/:id', (req, res) => {role.handleEnableRole(db, req, res)});

// Puesto
app.get('/puesto/buscar', (req, res) => {puesto.handleSearchPuesto(db, req, res)});
app.get('/puesto/buscar/:id', (req, res) => {puesto.handleSearchPuestoById(db, req, res)});
app.post('/puesto/new', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {puesto.handleNewPuesto(db, req, res, validationResult)});
app.put('/puesto/edit/:id', [
    check('nombre').not().isEmpty().trim().escape().withMessage('El nombre es necesario'),
    check('descripcion').unescape().trim().escape()
], (req, res) => {puesto.handleEditPuesto(db, req, res, validationResult)});
app.delete('/puesto/disable/:id', (req, res) => {puesto.handleDisablePuesto(db, req, res)});
app.put('/puesto/enable/:id', (req, res) => {puesto.handleEnablePuesto(db, req, res)});

// Asignar Alergia a un Paciente
app.post('/asignaralergia', [
    check('id_paciente').not().isEmpty().trim().escape().withMessage('El paciente es necesario'),
    check('id_alergia').not().isEmpty().trim().escape().withMessage('La alergia es necesaria')
], (req, res) => {asignarAlergia.handleAsignarAlergia(db, req, res, validationResult)});

module.exports = app;