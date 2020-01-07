import React from 'react';
import CONSTS from "../constants";
import { Form, Icon, Input, Button } from 'antd';
import { sha512 } from 'js-sha512'
import { connect } from "react-redux";
import { setToken } from "../store/actions";

class LoginForm extends React.Component {

  componentDidMount(){
    if(localStorage.getItem('token')){
      this.props.history.push(CONSTS.SECURED_VIEW);
    }
  }

  loginAPICall = async (val) => {
    try{
      const response = await fetch(CONSTS.BASE_URL + 'v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: val.username, password: sha512(val.password) })
      });
      const respObject = await response.json()
      localStorage.setItem('token', respObject.data.access_token)
      this.props.setToken({token:respObject.data.access_token})
      this.props.history.push(CONSTS.SECURED_VIEW);
      return respObject
    }catch(e){
      console.log(e);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.loginAPICall(values)
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

const mapStateToProps = (state) => {
  return {
    reduxState: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setToken: token => dispatch(setToken(token))
  };
}

const LoginComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedLoginForm);
export default LoginComponent
