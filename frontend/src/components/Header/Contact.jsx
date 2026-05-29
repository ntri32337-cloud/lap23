import { useState } from "react";
import axios from "axios";

export default function Contact() {

const [name,setName] = useState("");
const [phone,setPhone] = useState("");
const [email,setEmail] = useState("");
const [message,setMessage] = useState("");

const handleSubmit = async () => {

if(!name || !message){
alert("Vui lòng nhập đầy đủ thông tin");
return;
}

try{

await axios.post("https://backend-lap23.onrender.com/api/contacts",{
name,
phone,
email,
message
});

alert("Gửi liên hệ thành công");

setName("");
setPhone("");
setEmail("");
setMessage("");

}catch(error){
console.log(error);
alert("Gửi thất bại");
}

};

return(

<div className="container contact-page">

<h2>Liên hệ đại lý bia nước ngọt</h2>

<div className="contact-grid">

<div className="contact-info">

<h4>Thông tin</h4>

<p>📞 Hotline: 0392418310</p>
<p>📍 Địa chỉ: Hóc Môn - TP.HCM</p>
<p>⏰ Giờ mở cửa: 8h - 22h</p>

</div>

<div className="contact-form">

<input
placeholder="Họ và tên"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Số điện thoại"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<textarea
placeholder="Nội dung"
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

<button onClick={handleSubmit}>
Gửi liên hệ
</button>

</div>

</div>

</div>

)

}