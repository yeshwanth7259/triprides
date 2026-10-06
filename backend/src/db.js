const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'tripride.sqlite'));
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE,
 phone TEXT,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK(role IN ('CUSTOMER','OPERATOR','DRIVER','ADMIN')),
 status TEXT NOT NULL DEFAULT 'ACTIVE',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS vehicles (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 operator_id INTEGER,
 name TEXT NOT NULL,
 type TEXT NOT NULL,
 seats INTEGER NOT NULL,
 registration TEXT NOT NULL UNIQUE,
 city TEXT NOT NULL,
 price_per_km REAL NOT NULL DEFAULT 0,
 image TEXT,
 status TEXT NOT NULL DEFAULT 'AVAILABLE',
 FOREIGN KEY(operator_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS bookings (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 booking_code TEXT NOT NULL UNIQUE,
 customer_id INTEGER NOT NULL,
 vehicle_id INTEGER,
 operator_id INTEGER,
 driver_id INTEGER,
 service TEXT NOT NULL,
 pickup TEXT NOT NULL,
 destination TEXT NOT NULL,
 travel_date TEXT NOT NULL,
 travel_time TEXT NOT NULL,
 return_date TEXT,
 passengers INTEGER NOT NULL,
 amount REAL NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'PENDING',
 payment_status TEXT NOT NULL DEFAULT 'UNPAID',
 notes TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(customer_id) REFERENCES users(id),
 FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
 FOREIGN KEY(operator_id) REFERENCES users(id),
 FOREIGN KEY(driver_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS leads (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 customer_id INTEGER,
 name TEXT NOT NULL,
 phone TEXT NOT NULL,
 service TEXT NOT NULL,
 pickup TEXT NOT NULL,
 destination TEXT NOT NULL,
 travel_date TEXT NOT NULL,
 passengers INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'NEW',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(customer_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS documents (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 owner_id INTEGER NOT NULL,
 vehicle_id INTEGER,
 type TEXT NOT NULL,
 document_no TEXT,
 expiry_date TEXT,
 status TEXT NOT NULL DEFAULT 'PENDING',
 FOREIGN KEY(owner_id) REFERENCES users(id),
 FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
);
`);

function seedUser(name,email,phone,password,role){
 const existing=db.prepare('SELECT id FROM users WHERE email=?').get(email);
 if(existing) return existing.id;
 const hash=bcrypt.hashSync(password,10);
 return db.prepare('INSERT INTO users(name,email,phone,password_hash,role) VALUES(?,?,?,?,?)').run(name,email,phone,hash,role).lastInsertRowid;
}
function seed(){
 const admin=seedUser('Super Admin','admin@tripride.in','9999999999','Admin@123','ADMIN');
 const customer=seedUser('Rahul Kumar','customer@tripride.in','9000000001','Customer@123','CUSTOMER');
 const operator=seedUser('TripRide Operator','operator@tripride.in','9000000002','Operator@123','OPERATOR');
 const driver=seedUser('Ramesh Kumar','driver@tripride.in','9000000003','Driver@123','DRIVER');
 const count=db.prepare('SELECT COUNT(*) c FROM vehicles').get().c;
 if(!count){
   const add=db.prepare('INSERT INTO vehicles(operator_id,name,type,seats,registration,city,price_per_km,image) VALUES(?,?,?,?,?,?,?,?)');
   add.run(operator,'Toyota Innova Crysta','CAR',6,'KA01AB1234','Bengaluru',24,'/vehicles/crysta.svg');
   add.run(operator,'Maruti Ertiga','CAR',6,'KA01CD5678','Bengaluru',18,'/vehicles/ertiga.svg');
   add.run(operator,'Tempo Traveller 17 Seater','TEMPO_TRAVELLER',17,'KA01EF9012','Bengaluru',38,'/vehicles/tempo.svg');
   add.run(operator,'Mini Bus 25 Seater','MINI_BUS',25,'KA01GH3456','Bengaluru',55,'/vehicles/minibus.svg');
   add.run(operator,'Bus 35 Seater','BUS',35,'KA01IJ7890','Bengaluru',70,'/vehicles/bus.svg');
   add.run(operator,'Bus 50 Seater','BUS',50,'KA01KL2468','Bengaluru',90,'/vehicles/bus.svg');
 }
 const bc=db.prepare('SELECT COUNT(*) c FROM bookings').get().c;
 if(!bc){
   const v=db.prepare('SELECT id FROM vehicles WHERE registration=?').get('KA01AB1234');
   db.prepare(`INSERT INTO bookings(booking_code,customer_id,vehicle_id,operator_id,driver_id,service,pickup,destination,travel_date,travel_time,passengers,amount,status,payment_status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run('TRP1001',customer,v.id,operator,driver,'Airport Taxi','Bengaluru Airport','HSR Layout','2026-10-15','10:00',4,1200,'CONFIRMED','PAID');
   db.prepare(`INSERT INTO bookings(booking_code,customer_id,vehicle_id,operator_id,driver_id,service,pickup,destination,travel_date,travel_time,passengers,amount,status,payment_status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run('TRP1002',customer,3,operator,driver,'Tempo Traveller','Bengaluru','Coorg','2026-10-18','06:00',12,18000,'PENDING','UNPAID');
 }
}
seed();
module.exports=db;
