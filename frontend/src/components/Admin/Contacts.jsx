import { useEffect, useState } from "react";
import axios from "axios";

export default function Contacts(){

const [contacts,setContacts] = useState([]);

const getContacts = async ()=>{

try{

const res = await axios.get("http://localhost:5000/api/contacts");

setContacts(res.data.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
getContacts();
},[]);


return(

<div>

<h2>Quản lý liên hệ</h2>

<table className="table table-bordered">

<thead>

<tr>
<th>#</th>
<th>Tên</th>
<th>Điện thoại</th>
<th>Email</th>
<th>Nội dung</th>
</tr>

</thead>

<tbody>

{contacts.length === 0 && (
<tr>
<td colSpan="5">Không có liên hệ.</td>
</tr>
)}

{contacts.map((c,index)=>(
<tr key={c._id}>

<td>{index+1}</td>
<td>{c.name}</td>
<td>{c.phone}</td>
<td>{c.email}</td>
<td>{c.message}</td>

</tr>
))}

</tbody>

</table>

</div>

)

}