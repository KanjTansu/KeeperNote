import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(Yup)
export default function Login() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [hidden, setHidden] = useState(false)
  const [noteHidden, setNoteHidden] = useState(false)
  const [errMessage, setError] = useState("");
  const [errStatus, setErrorStatus] = useState(false)
  const formSchema = Yup.object().shape({
    username: Yup.string()
      .email()
      .required('Username is required'),
    password: Yup.string().required('Password is mendatory')
      .min(8, 'Password must be at 8 char long')
      .minLowercase(1, 'Password must be minimum 1 Lower character')
      .minUppercase(1, 'Password must be minimum 1 Upper character')
      .minNumbers(1, 'Password must be minimum 1 Number')
  })
  const formOptions = { resolver: yupResolver(formSchema) }
  const { register, handleSubmit, formState, setValue } = useForm(formOptions)
  const { errors } = formState
  function onSubmit(data) {
    console.log(JSON.stringify(data, null, 4))
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: data.username,
        password: data.password
      })
    };
    fetch("/user", requestOptions)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          setLoginStatus(true)
          setHidden(true)
          setNoteHidden(true)
          setErrorStatus(false)
        } else {
          setHidden(true)
          setLoginStatus(false)
          setNoteHidden(false)
          setError(response.statusText);
          setErrorStatus(true)
        }

      })
    setValue('username', "")
    setValue('password', "")

    return false;
  }

  return (
    <div className="container mt-3 p-5">
      <h1 className='text-center regis-header'>Keeper Note Login</h1>
      <div className='container px-10'>
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
          <div className="mt-3 text-center">
            <button type="submit" className="btn btn-warning btn-submit">
              Login
            </button>
            {hidden && <p className='text-center regis-end'>Login {loginStatus ? "Successfully" : "Failed"}!</p>}
            {errStatus && <p className='text-center regis-end'>User {errMessage}!</p>}
            {noteHidden && <h1 className='text-center regis-end'>Go to note page and let start your note!</h1>}
          </div>
        </form>
      </div>
    </div>
  )
}