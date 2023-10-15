import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { gql, useMutation } from '@apollo/client';
import {  history } from 'umi';
import { USER_TYPE } from '@/constants';

const LoginPage: React.FC = () => {

  const [errorMsg, setErrorMsg] = useState('')

  const LOGINQUERY = gql`
    mutation($input: UsersPermissionsLoginInput!) {
      login(loginInput: $input  ){
        jwt:token
        user{
          id
          username
          email
          role
          phone
        }
      }
    }
  `;

  const [toLogin, { loading: loginLoading, data: loginData }] = useMutation(LOGINQUERY, {
    onCompleted: (data) => {

      // set sessionstorage
      const str = JSON.stringify(data.login)
      sessionStorage.setItem("user", str)
      sessionStorage.setItem("token", data.login.jwt)
      sessionStorage.setItem("role", data.login?.user?.role)
      console.log(loginData,"loginData")
      if(data.login.user.role === USER_TYPE.EMPLOYEE){
        // if user role is EMPLOYEE, go to reservation management page by default, else go to hotel reservation page
        history.push('/reservation-management')
      }else{
        history.push('/reservation')
      }
      

    },
    onError: (err) => {
      setErrorMsg(err.message)
    }
  });

  const onFinish = (values: any) => {
    setErrorMsg('')
    // values.provider="local"
    toLogin({
      variables: {
        input: values
      }
    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{
      padding: "25px",
      height:'100vh',
      paddingTop: '25%'
    }}>
      <div style={{width: "100%", textAlign:'center'}}>
        <img style={{margin: "auto"}} src='https://www.hilton.com/modules/assets/svgs/logos/HH.svg'/>
      </div>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout='vertical'
        style={{
          margin: "0 auto",
          maxWidth: "500px"
        }}

      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <div className='text-red-800 my-2'>{errorMsg}</div>
        <Form.Item>
          <Button type="primary" danger htmlType="submit" className='w-full' loading={loginLoading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
    
  );
};

export default LoginPage;
