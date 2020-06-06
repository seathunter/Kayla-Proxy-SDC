const express = require('express');
const cors = require('cors');
const path = require('path');
const httpProxy = require('http-proxy');
const axios = require('axios');
const proxy = httpProxy.createProxyServer();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/loaderio-65b060a45d87f701223f64f319940e1d/', (req, res) => {
        res.send('loaderio-65b060a45d87f701223f64f319940e1d');
});

const menu = 'http://54.185.2.221';
const photos = 'http://54.200.132.22';
const reservations = 'http://18.236.94.193';

app.use('/:listingId', express.static(path.resolve(__dirname, '../client/public')));

// app.get('/everything/:id', (req, res) => {
//   const id = req.params.id;
//   const promiseMenu1 = axios.get(`${menu}/restaurant/${id}`)
//     .then((result) => result.data[0]);
//   const promiseSidebar = axios.get(`${menu}/listing/photos/sidebar/${id}`)
//     .then((result) => result.data);
//   const promisePhotos = axios.get(`${photos}/listing/photos/${id}`)
//     .then((result) => result.data);
//   const promiseReservations = axios.get(`${reservations}/reservations/${id}`)
//     .then((result) => result.data)

//   Promise.all([promiseMenu1, promiseSidebar, promisePhotos, promiseReservations])
//     .then(results => res.send(result))
//     .catch(err => console.log(err));
// });



app.get('/everything/:listingId', (req, res) => {
  let id = req.params.listingId;
  let photoData = axios.get(`${photos}/listing/photos/${id}`)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      console.log(err);
    });
  let sideData = axios.get(`${photos}/listing/photos/sidebar/${id}`)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      console.log(err);
    });
  let reserveData = axios.get(`${reservations}/reservations/${id}`)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      console.log(err);
    });
  let restaurantData = axios.get(`${menu}/restaurant/${id}`)
    .then((result) => {
      return result.data[0];
    })
    .catch((err) => {
      console.log(err);
    });


  Promise.all([photoData, sideData, reserveData, restaurantData])
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.all('/restaurant/*', (req, res) => {
  proxy.web(req, res, {target: menu});
});

app.all('/restaurants/*', (req, res) => {
  proxy.web(req, res, {target: menu});
});

app.all('/listing*', (req, res) => {
  proxy.web(req, res, {target: photos});
});

app.all('/reservations/*', (req, res) => {
   proxy.web(req, res, {target: reservations});
});

/*
app.get('/:id', (req, res) => {
  if (!req.params.id) {
    res.status(400);
    res.end();
  } else {
    res.sendFile('index.html', { root: path.resolve(__dirname, '../public')});
  }
})
*/

app.listen(port, () => console.log(`Master app listening on port ${port}`));