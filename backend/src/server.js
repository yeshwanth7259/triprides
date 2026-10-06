require('dotenv').config();
const express=require('express');
const cors=require('cors');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const {z}=require('zod');
const db=require('./db');
const {sign,auth,allow}=require('./auth');
const app=express();
app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:3000'}));
app.use(express.json());
const port=process.env.PORT||4000;
const id=(x)=>Number(x);
const userSafe=u=>({id:u.id,name:u.name,email:u.email,phone:u.phone,role:u.role,status:u.status});
app.get('/api/health',(req,res)=>res.json({ok:true,service:'TripRide API',time:new Date().toISOString()}));

app.post('/api/auth/register',(req,res)=>{
 const s=z.object({name:z.string().min(2),email:z.string().email(),phone:z.string().min(8),password:z.string().min(6)}).safeParse(req.body);
 if(!s.success)return res.status(400).json({message:s.error.issues[0].message});
 try{const hash=bcrypt.hashSync(s.data.password,10);const r=db.prepare('INSERT INTO users(name,email,phone,password_hash,role) VALUES(?,?,?,?,?)').run(s.data.name,s.data.email,s.data.phone,hash,'CUSTOMER');const u=db.prepare('SELECT * FROM users WHERE id=?').get(r.lastInsertRowid);res.status(201).json({user:userSafe(u),token:sign(u)});}catch(e){res.status(409).json({message:'Email already registered'});}
});
app.post('/api/auth/login',(req,res)=>{
 const s=z.object({email:z.string().email(),password:z.string()}).safeParse(req.body);if(!s.success)return res.status(400).json({message:'Valid email and password required'});
 const u=db.prepare('SELECT * FROM users WHERE email=?').get(s.data.email);if(!u||!bcrypt.compareSync(s.data.password,u.password_hash))return res.status(401).json({message:'Invalid credentials'});
 res.json({user:userSafe(u),token:sign(u)});
});
app.get('/api/auth/me',auth,(req,res)=>res.json({user:req.user}));

app.get('/api/vehicles',(req,res)=>{
 const {type,city,seats}=req.query;let q='SELECT v.*,u.name operator_name FROM vehicles v LEFT JOIN users u ON u.id=v.operator_id WHERE v.status != "BLOCKED"';const p=[];
 if(type){q+=' AND v.type=?';p.push(type)} if(city){q+=' AND lower(v.city)=lower(?)';p.push(city)} if(seats){q+=' AND v.seats>=?';p.push(Number(seats))}
 res.json({vehicles:db.prepare(q+' ORDER BY v.seats').all(...p)});
});
app.post('/api/vehicles',auth,allow('ADMIN','OPERATOR'),(req,res)=>{
 const s=z.object({name:z.string(),type:z.string(),seats:z.number().int().positive(),registration:z.string(),city:z.string(),price_per_km:z.number().nonnegative(),operator_id:z.number().optional()}).safeParse(req.body);if(!s.success)return res.status(400).json({message:s.error.issues[0].message});
 try{const op=req.user.role==='OPERATOR'?req.user.id:(s.data.operator_id||null);const r=db.prepare('INSERT INTO vehicles(operator_id,name,type,seats,registration,city,price_per_km) VALUES(?,?,?,?,?,?,?)').run(op,s.data.name,s.data.type,s.data.seats,s.data.registration,s.data.city,s.data.price_per_km);res.status(201).json({vehicle:db.prepare('SELECT * FROM vehicles WHERE id=?').get(r.lastInsertRowid)});}catch(e){res.status(400).json({message:'Could not create vehicle'});}
});

app.post('/api/leads',(req,res)=>{
 const s=z.object({name:z.string().min(2),phone:z.string().min(8),service:z.string(),pickup:z.string(),destination:z.string(),travel_date:z.string(),passengers:z.number().int().positive(),customer_id:z.number().optional()}).safeParse(req.body);if(!s.success)return res.status(400).json({message:s.error.issues[0].message});
 const r=db.prepare('INSERT INTO leads(customer_id,name,phone,service,pickup,destination,travel_date,passengers) VALUES(?,?,?,?,?,?,?,?)').run(s.data.customer_id||null,s.data.name,s.data.phone,s.data.service,s.data.pickup,s.data.destination,s.data.travel_date,s.data.passengers);res.status(201).json({lead:db.prepare('SELECT * FROM leads WHERE id=?').get(r.lastInsertRowid)});
});

app.post('/api/bookings',auth,(req,res)=>{
 const s=z.object({vehicle_id:z.number().int().positive(),service:z.string(),pickup:z.string(),destination:z.string(),travel_date:z.string(),travel_time:z.string(),return_date:z.string().optional(),passengers:z.number().int().positive(),amount:z.number().nonnegative(),notes:z.string().optional()}).safeParse(req.body);if(!s.success)return res.status(400).json({message:s.error.issues[0].message});
 const v=db.prepare('SELECT * FROM vehicles WHERE id=? AND status="AVAILABLE"').get(s.data.vehicle_id);if(!v)return res.status(404).json({message:'Vehicle not available'});
 const op=v.operator_id;const code='TRP'+crypto.randomInt(10000,99999);const r=db.prepare(`INSERT INTO bookings(booking_code,customer_id,vehicle_id,operator_id,service,pickup,destination,travel_date,travel_time,return_date,passengers,amount,notes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(code,req.user.id,v.id,op,s.data.service,s.data.pickup,s.data.destination,s.data.travel_date,s.data.travel_time,s.data.return_date||null,s.data.passengers,s.data.amount,s.data.notes||'');
 res.status(201).json({booking:db.prepare('SELECT * FROM bookings WHERE id=?').get(r.lastInsertRowid)});
});
app.get('/api/bookings',auth,(req,res)=>{
 let q=`SELECT b.*,c.name customer_name,c.phone customer_phone,v.name vehicle_name,v.type vehicle_type,v.seats,u.name operator_name,d.name driver_name FROM bookings b JOIN users c ON c.id=b.customer_id LEFT JOIN vehicles v ON v.id=b.vehicle_id LEFT JOIN users u ON u.id=b.operator_id LEFT JOIN users d ON d.id=b.driver_id`;
 const p=[];if(req.user.role==='CUSTOMER'){q+=' WHERE b.customer_id=?';p.push(req.user.id)} else if(req.user.role==='OPERATOR'){q+=' WHERE b.operator_id=?';p.push(req.user.id)} else if(req.user.role==='DRIVER'){q+=' WHERE b.driver_id=?';p.push(req.user.id)} q+=' ORDER BY b.created_at DESC';res.json({bookings:db.prepare(q).all(...p)});
});
app.patch('/api/bookings/:id/status',auth,(req,res)=>{
 const s=z.object({status:z.enum(['PENDING','CONFIRMED','REJECTED','IN_PROGRESS','COMPLETED','CANCELLED'])}).safeParse(req.body);if(!s.success)return res.status(400).json({message:'Invalid status'});
 const b=db.prepare('SELECT * FROM bookings WHERE id=?').get(id(req.params.id));if(!b)return res.status(404).json({message:'Booking not found'});
 const permitted=req.user.role==='ADMIN'||(req.user.role==='OPERATOR'&&b.operator_id===req.user.id)||(req.user.role==='DRIVER'&&b.driver_id===req.user.id)||(req.user.role==='CUSTOMER'&&b.customer_id===req.user.id);if(!permitted)return res.status(403).json({message:'You cannot update this booking'});
 db.prepare('UPDATE bookings SET status=? WHERE id=?').run(s.data.status,b.id);res.json({booking:db.prepare('SELECT * FROM bookings WHERE id=?').get(b.id)});
});
app.patch('/api/bookings/:id/assign',auth,allow('ADMIN','OPERATOR'),(req,res)=>{
 const s=z.object({driver_id:z.number().int().positive()}).safeParse(req.body);if(!s.success)return res.status(400).json({message:'driver_id required'});db.prepare('UPDATE bookings SET driver_id=? WHERE id=?').run(s.data.driver_id,id(req.params.id));res.json({ok:true});
});

app.get('/api/admin/summary',auth,allow('ADMIN'),(req,res)=>{
 const total=db.prepare('SELECT COUNT(*) c FROM bookings').get().c;const leads=db.prepare('SELECT COUNT(*) c FROM leads WHERE status="NEW"').get().c;const revenue=db.prepare('SELECT COALESCE(SUM(amount),0) s FROM bookings WHERE status IN ("CONFIRMED","IN_PROGRESS","COMPLETED")').get().s;const active=db.prepare('SELECT COUNT(*) c FROM bookings WHERE status="IN_PROGRESS"').get().c;const vehicles=db.prepare('SELECT COUNT(*) c FROM vehicles').get().c;const operators=db.prepare('SELECT COUNT(*) c FROM users WHERE role="OPERATOR"').get().c;const drivers=db.prepare('SELECT COUNT(*) c FROM users WHERE role="DRIVER"').get().c;res.json({totalBookings:total,newLeads:leads,revenue,activeTrips:active,vehicles,operators,drivers});
});
app.get('/api/admin/users',auth,allow('ADMIN'),(req,res)=>res.json({users:db.prepare('SELECT id,name,email,phone,role,status,created_at FROM users ORDER BY created_at DESC').all()}));
app.get('/api/admin/leads',auth,allow('ADMIN'),(req,res)=>res.json({leads:db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all()}));
app.get('/api/admin/bookings',auth,allow('ADMIN'),(req,res)=>res.json({bookings:db.prepare(`SELECT b.*,c.name customer_name,c.phone customer_phone,v.name vehicle_name,u.name operator_name,d.name driver_name FROM bookings b JOIN users c ON c.id=b.customer_id LEFT JOIN vehicles v ON v.id=b.vehicle_id LEFT JOIN users u ON u.id=b.operator_id LEFT JOIN users d ON d.id=b.driver_id ORDER BY b.created_at DESC`).all()}));
app.get('/api/admin/vehicles',auth,allow('ADMIN'),(req,res)=>res.json({vehicles:db.prepare('SELECT v.*,u.name operator_name FROM vehicles v LEFT JOIN users u ON u.id=v.operator_id ORDER BY v.id DESC').all()}));

app.listen(port,()=>console.log(`TripRide API running on http://localhost:${port}`));
