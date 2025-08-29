const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    
    // Configurar la base de datos y crear índices si es necesario
    await configurarBaseDatos();
    
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

const configurarBaseDatos = async () => {
  try {
    const Usuario = require('../models/Usuario');
    
    // Crear índice único para email si no existe
    await Usuario.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Índices de base de datos configurados correctamente');
    
  } catch (error) {
    console.log('Error configurando índices:', error.message);
  }
};

module.exports = conectarDB;
