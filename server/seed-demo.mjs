import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
dotenv.config({path:path.join(path.dirname(fileURLToPath(import.meta.url)),'.env')});
if(!process.env.MONGO_URI) throw Error('Missing MONGO_URI in server/.env');
const tag='MF21-DEMO';
const id=(n)=>new mongoose.Types.ObjectId('6d66323100000000'+n.toString(16).padStart(8,'0'));
const now=new Date(); const day=new Date(now);day.setHours(0,0,0,0);
const specialties=['General Medicine','Dermatology','Pediatrics','Orthopedics','ENT','Ophthalmology','Cardiology'];
const patients=Array.from({length:500},(_,i)=>({_id:id(i+1),name:`Demo Patient ${String(i+1).padStart(3,'0')}`,age:18+(i*17)%65,phone:`DEMO-${String(i+1).padStart(4,'0')}`,demoBatch:tag,createdAt:now,updatedAt:now}));
const doctors=Array.from({length:15},(_,i)=>({_id:id(1001+i),name:`Dr. Demo ${String(i+1).padStart(2,'0')}`,specialty:specialties[i%specialties.length],demoBatch:tag,createdAt:now,updatedAt:now}));
const appointments=Array.from({length:2500},(_,i)=>{const offset=Math.floor(i/75)-29;const slot=new Date(day);slot.setDate(slot.getDate()+offset);slot.setHours(9+Math.floor((i%75)/15),0,0,0);const status=offset<0?(i%10===0?'Cancelled':'Completed'):offset===0?(slot<now?(i%3===0?'Waiting':'Completed'):'Booked'):'Booked';return {_id:id(2001+i),patient:patients[(i*37)%500]._id,doctor:doctors[i%15]._id,slot,status,active:status!=='Cancelled',demoBatch:tag,createdAt:now,updatedAt:now};});
const prescriptions=appointments.filter(a=>a.status==='Completed').slice(0,1000).map((a,i)=>({_id:id(5001+i),appointment:a._id,notes:'Synthetic demonstration record. No medication or clinical advice. Consultation documentation example only.',demoBatch:tag,createdAt:now,updatedAt:now}));
try{await mongoose.connect(process.env.MONGO_URI);const db=mongoose.connection.db;console.log('Database:',db.databaseName);for(const [name,docs] of Object.entries({patients,doctors,appointments,prescriptions})){const col=db.collection(name);const ids=docs.map(d=>d._id);const conflict=await col.findOne({_id:{$in:ids},demoBatch:{$ne:tag}});if(conflict)throw Error(`Existing ID conflict in ${name}; stopping without overwriting.`);const result=await col.bulkWrite(docs.map(d=>({updateOne:{filter:{_id:d._id,demoBatch:tag},update:{$setOnInsert:d},upsert:true}})),{ordered:true});console.log(`${name}: ${result.upsertedCount} added; ${await col.countDocuments({demoBatch:tag})} demo records; ${await col.countDocuments()} total`);}console.log('Seed complete. Refresh MediFlow.');}finally{await mongoose.disconnect();}
