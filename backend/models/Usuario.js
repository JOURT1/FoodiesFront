const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: [true, 'El nombre completo es requerido'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^.+@.+\..+$/, 'Por favor ingresa un email válido']
  },
  passwordHash: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [20, 'Hash de contraseña inválido']
  },
  rol: {
    type: String,
    enum: ['usuario', 'foodie', 'restaurante'],
    default: 'usuario',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Esto automaticamente maneja createdAt y updatedAt
});

// Middleware para actualizar updatedAt antes de guardar
usuarioSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para verificar contraseña
usuarioSchema.methods.verificarPassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Método estático para hashear contraseña
usuarioSchema.statics.hashPassword = async function(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Método para obtener datos seguros del usuario (sin password)
usuarioSchema.methods.toSafeObject = function() {
  const usuario = this.toObject();
  delete usuario.passwordHash;
  return usuario;
};

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');

module.exports = Usuario;
