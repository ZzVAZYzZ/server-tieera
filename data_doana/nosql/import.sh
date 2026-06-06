#!/bin/bash

mongoimport 
  --db doana 
  --collection orders 
  --file /seed/doana.orders.json

mongoimport 
  --db doana 
  --collection payments 
  --file /seed/doana.payments.json

mongoimport 
  --db doana 
  --collection reviews 
  --file /seed/doana.reviews.json