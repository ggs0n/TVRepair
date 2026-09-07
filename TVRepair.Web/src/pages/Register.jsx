import { Link } from "react-router"
import { useNavigate } from "react-router";
import { apiUrl } from "../config/api";

export default function Register()

{
    const navigate = useNavigate()

    async function SubmitRegister(event)
    {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const response = await fetch
        (apiUrl('/api/Authentication/registercustomer'),
        {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify( {
             name : formData.get("name"),
             email : formData.get("email"),
             password : formData.get("password"),
             customertype : formData.get("customertype")
            })
        })

        const ErrorMessage = await response.text();

        if(response.ok)
        {
            alert("Success");
            navigate("/login");
        }
        else return alert(ErrorMessage);
    }

    return (
        <>
        <div className="border border-5">
        <form onSubmit={SubmitRegister}>
        <div className="container p-2 gap-2 flex flex-column col-5">
            <h1>Registration Detail</h1>
            <label>Name : </label>
            <input name="name" type="text" className="form-control"></input>
            <label>Email : </label>
            <input name="email" type="text" className="form-control"></input>
            <label><input type="radio" name="customertype" value="customer"></input> Customer</label>
            <label><input type="radio" name="customertype" value="technician"></input> Technician</label>
            <label>Password :</label>
            <input name="password" type="password" className="form-control"></input><br/>
            <label>Re-enter Password :</label>
            <input type="password" className="form-control"></input>
        </div>
        <div className="flex container align-items-center gap-2 col-5">
            <button type="submit">Register</button>
        </div>
        </form>
        </div>
        </>
    )
}
