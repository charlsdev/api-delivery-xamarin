const { Schema, model } = require('mongoose');

const DeliverySchema = new Schema(
   {
      cedula: {
         type: String,
         require: true,
         maxlength: 10,
      },
      nameCompleto: {
         type: String,
         require: true,
      },
      direccion: {
         type: String,
         require: true,
      },
      estado: {
         type: String,
         require: true,
         // Entregado - Pendiente
      },
      producto: {
         type: String,
         require: true,
      },
      precio: {
         type: String,
         require: true,
      },
      cantidad: {
         type: String,
         require: true,
      },
      iva: {
         type: String,
         require: true,
      },
      subtotal: {
         type: String,
         require: true,
      },
      total: {
         type: String,
         require: true,
      },
   },
   {
      versionKey: false,
      timestamps: true,
   }
);

module.exports = model('Delivery', DeliverySchema);
