import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminContacts() {

const [contacts,setContacts] = useState([]);

const [newContact,setNewContact] = useState({
name:"",
phone:"",
email:"",
message:""
});

const getContacts = async () => {

try{

const res = await axios.get("https://backend-lap23.onrender.com/api/contacts");

setContacts(res.data.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
getContacts();
},[]);


const handleChange = (e)=>{
setNewContact({
...newContact,
[e.target.name]:e.target.value
});
};


const addContact = async ()=>{

try{

await axios.post("https://backend-lap23.onrender.com/api/contacts",newContact);

getContacts();

setNewContact({
name:"",
phone:"",
email:"",
message:""
});

}catch(err){
console.log(err);
}

};


return(

<div className="admin-content">

<h2>Quản lý liên hệ</h2>

<table className="admin-table">

<thead>

<tr>
<th>#</th>
<th>Tên</th>
<th>Điện thoại</th>
<th>Email</th>
<th>Nội dung</th>
<th>Hành động</th>
</tr>

</thead>

<tbody>

<tr>

<td>Mới</td>

<td>
<input
name="name"
value={newContact.name}
onChange={handleChange}
/>
</td>

<td>
<input
name="phone"
value={newContact.phone}
onChange={handleChange}
/>
</td>

<td>
<input
name="email"
value={newContact.email}
onChange={handleChange}
/>
</td>

<td>
<input
name="message"
value={newContact.message}
onChange={handleChange}
/>
</td>

<td>
<button
className="btn-add"
onClick={addContact}
>
Thêm
</button>
</td>

</tr>


{contacts.length === 0 && (

<tr>
<td colSpan="6">
Không có liên hệ.
</td>
</tr>

)}

{contacts.map((c,index)=>(

<tr key={c._id}>

<td>{index+1}</td>

<td>{c.name}</td>

<td>{c.phone}</td>

<td>{c.email}</td>

<td>{c.message}</td>

<td>

<button className="btn-delete">
Xóa
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}