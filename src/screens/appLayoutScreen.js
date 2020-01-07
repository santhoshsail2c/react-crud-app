import React from 'react';
import CONSTS from "../constants";
import HorseComp from './manipulateHorseFields'
import { Modal, Button, Spin, List, Avatar, Popconfirm, message } from 'antd';

class Layout extends React.Component {

  state = {
    loading:true,
    horsesList: null,
    visible: false,
    editStatus: false,
    editItem: null,
  }

  componentDidMount(){
    this.getHorsesAPICall()
  }

  createHorse = () => {
    this.setState({
      editStatus: false,
    });
    this.showModal();
  }

  editHorse = (item) => {
    this.setState({
      editStatus: true,
      editItem: item,
    });
    this.showModal();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = e => {
    this.setState({
      visible: false,
    });
    this.getHorsesAPICall()
  };

  cancel = (e) => {
    message.error('Operation cancelled!');
  }

  logOut = () => {
    localStorage.clear()
    this.props.history.push(CONSTS.LOGIN);
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    });
    this.getHorsesAPICall()
  };

  getHorsesAPICall = async (val) => {
    try{
      const response = await fetch(CONSTS.BASE_URL + 'v1/horses', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
      });
      const respObject = await response.json()
      this.setState({
        loading: false,
        horsesList: respObject
      })
    }catch(e){
      console.log(e);
    }
  }

  deleteHorse = async (item) => {
    try{
      await fetch(CONSTS.BASE_URL + 'v1/horses/'+ item.id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('token'),
          'Accept': 'application/json'
        },
        body: JSON.stringify(item)
      });
      this.getHorsesAPICall()
      message.success('Horse deleted Successfully')
    }catch(e){
      console.log(e);
      message.error('Oops try again')
    }

  }

  render() {
    const { loading, horsesList, editStatus, editItem } = this.state;
    if(loading){
      return (
        <Spin style={{ marginTop: '140px' }} />
      )
    }else{
      return (
        <div>
          <Button style={{ marginTop: '50px' }} onClick={this.createHorse}>Create</Button>
          <Popconfirm
            title="Are you sure log out?"
            onConfirm={this.logOut}
            onCancel={this.cancel}
            okText="Yes, I want to log out!"
            cancelText="No"
          >
            <Button type="dashed" style={{ marginLeft: '10px' }}>Logout</Button>
          </Popconfirm>
          <List
            style={{ padding: '50px 250px 50px 250px' }}
            itemLayout="horizontal"
            dataSource={horsesList ? horsesList.data : []}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="http://pngimg.com/uploads/horse/horse_PNG2552.png" />}
                  title={`Horse Name is ${item.horse_name}`}
                  description={`Horse Number is ${item.horse_number}`}
                />
                <Button onClick={() => this.editHorse(item)} type="primary">Edit</Button>
                <Popconfirm
                  title="Are you sure delete this horse?"
                  onConfirm={() => this.deleteHorse(item)}
                  onCancel={this.cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="danger" style={{ marginLeft: '10px' }}>Delete</Button>
                </Popconfirm>
              </List.Item>
            )}
          />
          <Modal
            title={`${editStatus === true ? 'Edit' : 'Create'} Horse`}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <HorseComp modalClose={this.handleCancel} getHorsesAPICall={this.getHorsesAPICall} editStatus={editStatus} editItem={editItem} />
          </Modal>
        </div>
      )
    }

  }
}

export default Layout;
