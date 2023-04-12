import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(Yup)


export default function Register() {
    const [registerStatus, setRegisterStatus] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [noteHidden, setNoteHidden] = useState(false)
    const [errMessage, setError] = useState("");
    const [errStatus, setErrorStatus] =useState(false)
    const formSchema = Yup.object().shape({
        username: Yup.string()
            .email()
            .required('Username is required'),
        password: Yup.string().required('Password is mendatory')
            .min(8, 'Password must be at 8 char long')
            .minLowercase(1, 'Password must be minimum 1 Lower character')
            .minUppercase(1, 'Password must be minimum 1 Upper character')
            .minNumbers(1, 'Password must be minimum 1 Number')
        ,
        confirmPwd: Yup.string()
            .required('Password is mendatory')
            .oneOf([Yup.ref('password')], 'Passwords does not match'),
    })
    const formOptions = { resolver: yupResolver(formSchema) }
    const { register, handleSubmit, formState, setValue } = useForm(formOptions)
    const { errors } = formState
    function onSubmit(data) {
        console.log(JSON.stringify(data, null, 4))
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: data.username,
                password: data.password
            })
        };
        fetch("/user", requestOptions)
            .then(response => response.json())
            .then(datas => {
                console.log(datas);
                if(datas ==="Success"){
                    setRegisterStatus(true)
                    setHidden(true)
                    setNoteHidden(true)
                    setErrorStatus(false)
                }else{
                    setHidden(true)
                    setNoteHidden(false)
                    setRegisterStatus(false)
                    setError(datas.message);
                    setErrorStatus(true)
                }
                
            })
        setValue('username', "")
        setValue('password', "")
        setValue('confirmPwd', "")
       
        return false
    }
    return (
        <div className="container mt-3 p-5">
            <h1 className='text-center regis-header'>Keeper Note Register</h1>
            <div className="px-10">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            name="username"
                            type="email"
                            {...register('username')}
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        />
                        <div className="invalid-feedback">{errors.username?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            {...register('password')}
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        />
                        <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            name="confirmPwd"
                            type="password"
                            {...register('confirmPwd')}
                            className={`form-control ${errors.confirmPwd ? 'is-invalid' : ''}`}
                        />
                        <div className="invalid-feedback">{errors.confirmPwd?.message}</div>
                    </div>
                    <div className="mt-3 text-center">
                        <button type="submit" className="btn btn-warning btn-submit ">
                            Submit
                        </button>
                        {hidden && <p className='text-center regis-end'>Register {registerStatus ? "Successfully" : "Failed"}!</p>}
                        {errStatus && <p className='text-center regis-end'>{errMessage}</p>}
                        {noteHidden&&<p className='text-center regis-end'>Go to note page and let start your note!</p>}
                    </div>
                </form>
            </div>
        </div>
    )
}