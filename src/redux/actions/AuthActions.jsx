import Axios from 'axios'
import {USER_LOGIN_START, USER_LOGIN_FAILED, USER_LOGIN_SUCCESS, USER_REGISTER_START, USER_REGISTER_FAILED,USER_REGISTER_SUCCESS,SEARCH_RESULT} from "./type"
import { API_URL } from '../../supports/ApiUrl'



export const LoginUser=({username,password})=>{
    return (dispatch)=>{
        dispatch({type:USER_LOGIN_START})
        if(username===''||password===''){//kalo ada input yang kosong
            dispatch({type:USER_LOGIN_FAILED,payload:'username atau password tidak terisi'})
        }else{
            Axios.get(`${API_URL}/users`,{
                params:{
                    username:username,
                    password:password
                }
            })
            .then((res)=>{
                if(res.data.length){//user ada
                    localStorage.setItem('iduser',res.data[0].id)
                    dispatch({type: USER_LOGIN_SUCCESS,payload:res.data[0]})
                }else{
                    dispatch({type: USER_LOGIN_FAILED,payload:'username atau password tidak terdaftar'})
                }
            }).catch((err)=>{
                console.log(err)
                dispatch({type:USER_LOGIN_FAILED,payload:err.message})
            })
        }
    }
}

export const RegisterUser=({username,email,password,confirmpassword})=>{
    return (dispatch)=>{
        dispatch({type:USER_REGISTER_START})
        if(username===''||email===''||password===''||confirmpassword===''){
            dispatch({type:USER_REGISTER_FAILED,payload:'Mohon mengisi semua data terlebih dahulu'})
        }else{
            Axios.get(`${API_URL}/users?username=${username}`)
            .then ((res)=>{
                if(res.data.length){
                    dispatch({type:USER_REGISTER_FAILED,payload:'Username sudah ada, mohon Login'})
                }else if(password !== confirmpassword){
                    dispatch({type:USER_REGISTER_FAILED,payload:'Konfirmasi password tidak sama'})
                }else{
                    Axios.post(`${API_URL}/users`,{ username: username, password: password, role: 'user' })
                    .then((res1)=>{
                        dispatch({type:USER_REGISTER_SUCCESS,payload:'Registrasi berhasil, silahkan login dengan akun anda'})
                    }).catch((err1)=>{
                        console.log(err1)
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }
}

export const errormessageclear=()=>{
    return{
        type:'ErrorClear'
    }
}

export const searchitem=(search)=>{
    return(dispatch)=>{
        Axios.get(`${API_URL}/products?_expand=kategori&name_like=${search}`)
        .then((res) => {
            console.log(res.data)
            // var hasilcari=[]
            // hasilcari.push(res.data)
            // console.log(hasilcari)
            dispatch({type:SEARCH_RESULT,payload:res.data})
            // console.log(res.data[0].name)
            // var hasilcari=res.data
            // this.setState({ hasilcari: res.data })
        }).catch((err) => {
            console.log(err)
        })
    }
}

// export const successmessageclear=()=>{
//     return{
//         type:'ErrorClear'
//     }
// }

export const KeepLogin=(data)=>{
    return {
        type:USER_LOGIN_SUCCESS,
        payload:data
    }
}