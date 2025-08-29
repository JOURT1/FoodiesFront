const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

// Middleware de validación
const validarRegistro = [
  body('nombreCompleto')
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener al menos 3 caracteres')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const validarLogin = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .exists()
    .withMessage('La contraseña es requerida')
];

// Función para generar JWT
const generarToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Registro de usuario
router.post('/registro', validarRegistro, async (req, res) => {
  try {
    // Verificar errores de validación
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errores: errores.array()
      });
    }

    const { nombreCompleto, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está registrado. Intenta iniciar sesión.'
      });
    }

    // Hashear contraseña
    const passwordHash = await Usuario.hashPassword(password);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombreCompleto,
      email,
      passwordHash,
      rol: 'usuario' // Siempre como usuario por defecto
    });

    await nuevoUsuario.save();

    // Generar token
    const token = generarToken(nuevoUsuario._id);

    // Respuesta exitosa (sin enviar el hash de contraseña)
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      usuario: nuevoUsuario.toSafeObject()
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Login de usuario
router.post('/login', validarLogin, async (req, res) => {
  try {
    // Verificar errores de validación
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errores: errores.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Este email no está registrado. Por favor, regístrate primero.'
      });
    }

    // Verificar contraseña
    const passwordValida = await usuario.verificarPassword(password);
    if (!passwordValida) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      usuario: usuario.toSafeObject()
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Verificar token (opcional, para validar sesiones)
router.get('/verificar', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.userId);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    res.json({
      success: true,
      usuario: usuario.toSafeObject()
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

// Actualizar rol del usuario
router.put('/actualizar-rol', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rol } = req.body;

    // Validar que el rol sea válido
    const rolesValidos = ['usuario', 'foodie', 'restaurante'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido'
      });
    }

    // Actualizar el usuario
    const usuario = await Usuario.findByIdAndUpdate(
      decoded.userId, 
      { 
        rol: rol,
        updatedAt: new Date()
      }, 
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: `Rol actualizado a ${rol} exitosamente`,
      usuario: usuario.toSafeObject()
    });

  } catch (error) {
    console.error('Error actualizando rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
