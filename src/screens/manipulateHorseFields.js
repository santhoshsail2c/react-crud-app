import React from 'react';
import CONSTS from "../constants";
import moment from 'moment';
import { Form, DatePicker, Tooltip, Icon, Input, Button, Radio, Select, message } from 'antd';
import PropTypes from 'prop-types';

const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

class HorseComp extends React.Component {

  state = { loading: false }

  static propTypes = {
    getHorsesAPICall: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    editStatus: PropTypes.bool.isRequired,
    editItem: PropTypes.object
  }

  createHorsesAPICall = async (val) => {
    const { horse_name, horse_number, age_verified, dob, color, ushja_registered } = val;
    this.setState({
      loading: true
    })
    try{
      const response = await fetch(CONSTS.BASE_URL + 'v1/horses', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          horse_name,
          horse_number,
          age_verified: age_verified === 'true' ? true : false,
          dob: moment(dob).format("YYYY-MM-DD"),
          color,
          ushja_registered: ushja_registered === 'true' ? true : false
        })
      });
      const respObject = await response.json()
      message.success('Horse added Successfully')
      this.props.form.resetFields()
      this.props.getHorsesAPICall()
      this.props.modalClose()
      this.setState({
        loading: false
      })
      return respObject
    }catch(e){
      console.log(e);
      message.error('Oops try again')
    }
  }

  editHorsesAPICall = async (val) => {

    const { horse_name, horse_number, age_verified, dob, color, ushja_registered } = val;
    
    this.setState({
      loading: true
    })

    try{
      const response = await fetch(CONSTS.BASE_URL + 'v1/horses/'+ this.props.editItem.id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('token'),
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          horse_name: horse_name,
          horse_number: horse_number,
          age_verified: age_verified === 'true' ? true : false,
          dob: moment(dob).format("YYYY-MM-DD"),
          color: color,
          ushja_registered: ushja_registered === 'true' ? true : false
        })
      });
      const respObject = await response.json()
      this.props.form.resetFields()
      this.props.modalClose()
      this.setState({
        loading: false
      })
      message.success('Horse updated Successfully')
      return respObject
    }catch(e){
      console.log(e);
      message.error('Oops try again')
    }

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.props.editStatus){
          this.editHorsesAPICall(values)
        }else{
          this.createHorsesAPICall(values)
        }
      }
    });
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { editStatus, editItem } = this.props;
    return(
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label={
            <span>
              Horse Name&nbsp;
              <Tooltip title="Please input name of the horse.">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          } hasFeedback>
          {getFieldDecorator('horse_name', {
            rules: [
              {
                required: true,
                message: 'Please input horse name!',
              },
            ],
            initialValue: editStatus ? editItem && editItem.horse_name : ''
          })(<Input allowClear maxLength={255} />)}
        </Form.Item>
        <Form.Item label={
            <span>
              Horse number&nbsp;
              <Tooltip title="Please input number of the horse.">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          } hasFeedback>
          {getFieldDecorator('horse_number', {
            rules: [
              {
                required: true,
                message: 'Please input horse number!',
              },
            ],
            initialValue: editStatus ? editItem && editItem.horse_number : ''
          })(<Input allowClear />)}
        </Form.Item>
        <Form.Item label={
            <span>
              Age Verified&nbsp;
              <Tooltip title="Select if age verified or not">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }>
          {getFieldDecorator('age_verified', {

            initialValue: editStatus ? (editItem && editItem.age_verified === 1 ? "true" : "false") : ''
          })(
            <Radio.Group>
              <Radio.Button value="true">Yes</Radio.Button>
              <Radio.Button value="false">No</Radio.Button>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item label={
            <span>
              DOB&nbsp;
              <Tooltip title="Please input DOB.">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }>
          {getFieldDecorator('dob', {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
            initialValue: editStatus ? editItem && moment(editItem.dob, 'YYYY-MM-DD') : null
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label={
            <span>
              Color&nbsp;
              <Tooltip title="Please input color of the horse.">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          } hasFeedback>
          {getFieldDecorator('color', {
            rules: [{ required: true, message: 'Please select color!' }],
            initialValue: editStatus ? editItem && editItem.color : ''
          })(
            <Select placeholder="Please select a color">
              <Select.Option value="green">Green</Select.Option>
              <Select.Option value="red">Red</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={
            <span>
              Ushja Registered&nbsp;
              <Tooltip title="Select if Ushja Registered or not">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }>
          {getFieldDecorator('ushja_registered', {

            initialValue: editStatus ? (editItem && editItem.ushja_registered === 1 ? "true" : "false") : ''
          })(
            <Radio.Group>
              <Radio.Button value="true">Yes</Radio.Button>
              <Radio.Button value="false">No</Radio.Button>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" loading={this.state.loading} htmlType="submit">
            { !editStatus ? 'Create' : 'Edit' }
          </Button>
        </Form.Item>
      </Form>
    )
  }

}

const HorseCompWrapper = Form.create({ name: 'horse' })(HorseComp);

export default HorseCompWrapper
