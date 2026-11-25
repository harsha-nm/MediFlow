import React,{useState} from 'react';
export default function Calendar({rows}){
 const [month,M]=useState(()=>new Date()),[selected,S]=useState(null);
 const y=month.getFullYear(),m=month.getMonth(),first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();
 const days=Array.from({length:n},(_,i)=>rows.filter(r=>new Date(r.slot).toDateString()===new Date(y,m,i+1).toDateString()));
 return <div className="calendar"><div className="toolbar"><button onClick={()=>{M(new Date(y,m-1,1));S(null)}}>Previous month</button><h3>{month.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</h3><button onClick={()=>{M(new Date(y,m+1,1));S(null)}}>Next month</button></div><div className="calendar-grid">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><small key={d}>{d}</small>)}{Array.from({length:first},(_,i)=><span key={'blank'+i}/>)}{days.map((r,i)=><button className={selected===i?'chosen':''} key={i} onClick={()=>S(i)}>{i+1}<small>{r.length} bookings</small></button>)}</div>{selected!==null&&<div><h3>{new Date(y,m,selected+1).toLocaleDateString()}</h3>{days[selected].map(r=><p key={r._id}>{new Date(r.slot).toLocaleTimeString()} · {r.patient?.name} · {r.doctor?.name} · {r.status}</p>)}{!days[selected].length&&<p>No appointments.</p>}</div>}</div>
}
