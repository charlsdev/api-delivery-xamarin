require('dotenv').config();
require('./database');
const DeliveryModel = require('./model/Delivery');

const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
   res.status(200).json({
      msg: 'Welcome to API - Delivery Xamarin'
   });
});

app.post('/api', async (req, res) => {
   const {
      Cedula: cedula,
      NameCompleto: nameCompleto,
      Direccion: direccion,
      Estado: estado,
      Producto: producto,
      Precio: precio,
      Cantidad: cantidad
   } = req.body;

   let iva = 0, subtotal = 0, total = 0;

   try {
      total = parseFloat(cantidad).toFixed(2) * parseFloat(precio).toFixed(2);
      iva = parseFloat(total).toFixed(2) * 0.12;
      subtotal = parseFloat(total).toFixed(2) - parseFloat(iva).toFixed(2);

      const newPedido = new DeliveryModel({
         cedula,
         nameCompleto,
         direccion,
         estado,
         producto,
         precio,
         cantidad,
         iva: parseFloat(iva).toFixed(2),
         subtotal: parseFloat(subtotal).toFixed(2),
         total: parseFloat(total).toFixed(2)
      });

      const saveDel = newPedido.save();

      if (saveDel) {
         return res.status(200).json({
            msg: 'Pedido separado con éxito...'
         });
      } else {
         return res.status(408).json({
            msg: 'No se ha podido separar su pedido...'
         });
      }
   } catch (e) {
      console.log(e);

      return res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.get('/api', async (req, res) => {
   let allDelivery = [], dataDelivery;

   try {
      dataDelivery = await DeliveryModel
         .find()
         .lean()
         .exec();

      if (dataDelivery.length > 0) {
         dataDelivery.forEach(dely => {
            const { _id, ...allDel} = dely;

            allDelivery.push({
               id: _id,
               ...allDel
            });
         });

         return res.status(200).json(allDelivery);
      } else {
         return res.status(404).json({
            msg: 'No existen pedidos registrados...'
         });
      }
   } catch (e) {
      console.log(e);

      return res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.get('/api/:id', async (req, res) => {
   const {
      id
   } = req.params;

   try {
      const oneDelivery = await DeliveryModel
         .findById(id);

      if (oneDelivery) {
         const delivery = {
            id: oneDelivery._id,
            cedula: oneDelivery.cedula,
            nameCompleto: oneDelivery.nameCompleto,
            direccion: oneDelivery.direccion,
            estado: oneDelivery.estado,
            producto: oneDelivery.producto,
            precio: oneDelivery.precio,
            cantidad: oneDelivery.cantidad,
            iva: oneDelivery.iva,
            subtotal: oneDelivery.subtotal,
            total: oneDelivery.total,
         };

         return res.status(200).json(delivery);
      } else {
         return res.status(404).json({
            msg: 'Pedido no encontrado...'
         });
      }
   } catch (e) {
      console.log(e);

      return res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.delete('/api/:id', async (req, res) => {
   const {
      id
   } = req.params;

   try {
      const deleteDelivery = await DeliveryModel
         .deleteOne({
            _id: id
         });

      if (deleteDelivery.deletedCount > 0) {
         return res.status(200).json({
            msg: 'Pedido eliminado con éxito...'
         });
      } else {
         return res.status(404).json({
            msg: 'Pedido no encontrado...'
         });
      }
   } catch (e) {
      console.log(e);

      return res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.put('/api', async (req, res) => {
   const {
      Id: id,
      Cedula: cedula,
      NameCompleto: nameCompleto,
      Direccion: direccion,
      Estado: estado,
      Producto: producto,
      Precio: precio,
      Cantidad: cantidad
   } = req.body;

   let iva = 0, subtotal = 0, total = 0;

   try {
      total = parseFloat(cantidad).toFixed(2) * parseFloat(precio).toFixed(2);
      iva = parseFloat(total).toFixed(2) * 0.12;
      subtotal = parseFloat(total).toFixed(2) - parseFloat(iva).toFixed(2);

      const updateDelivery = await DeliveryModel
         .updateOne({
            _id: id
         }, {
            $set: {
               cedula,
               nameCompleto,
               direccion,
               estado,
               producto,
               precio,
               cantidad,
               iva: parseFloat(iva).toFixed(2),
               subtotal: parseFloat(subtotal).toFixed(2),
               total: parseFloat(total).toFixed(2)
            }
         });

      if (updateDelivery.modifiedCount > 0) {
         return res.status(200).json({
            msg: 'Pedido actualizado con éxito...'
         });
      } else {
         return res.status(408).json({
            msg: 'Pedido no actualizado...'
         });
      }
   } catch (e) {
      console.log(e);

      return res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.listen(app.get('port'), () => {
   console.log(
      `[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] - Servidor en el puerto ${app.get('port')}`
   );
});