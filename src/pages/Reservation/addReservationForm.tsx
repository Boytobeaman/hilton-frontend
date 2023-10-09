import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import React, { useEffect, PropsWithChildren } from 'react';

import { gql, useMutation } from '@apollo/client';
import moment from 'moment';
import { RESERVATION_STATUS } from '@/constants';
import type { RangePickerProps } from 'antd/es/date-picker';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};


interface RestaurantDataType {
  id: string;
  attributes: RestaurantAttribute;
}

interface RestaurantAttribute{
  name: string;
}

interface CreateFormProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  activeReservationObj: null | ReservationDataType;
  setActiveReservationObj: React.Dispatch<
    React.SetStateAction<ReservationDataType | null>>;
  activeRestaurantObj: null | RestaurantDataType;
  toGetReservationList: () => void;
  setActiveRestaurantObj: () => void;
}

const ReservationAddQuery = gql`
  mutation($data: CreateReservationInput!){
    createReservation(createReservationInput: $data){
      id: _id
      username
      phone
    }
  }
`;

const ReservationUpdateQuery = gql`
  mutation($id: String!, $data: UpdateReservationInput!){
    updateReservation(id: $id, updateReservationInput: $data){
      id: _id
      username
      phone
    }
  }
`;



const ReservationForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const {
    isModalVisible,
    setIsModalVisible,
    activeReservationObj,
    setActiveReservationObj,
    toGetReservationList,
    activeRestaurantObj,
    setActiveRestaurantObj,
  } = props;

  const [form] = Form.useForm();

  const [toCreateReservation, { loading: createLoading }] = useMutation(ReservationAddQuery, {
    onCompleted: () => {
      toGetReservationList()
      setIsModalVisible(false);
    }
  });

  const [toUpdateReservation, { loading: updateLoading }] = useMutation(ReservationUpdateQuery, {
    onCompleted: () => {
      toGetReservationList()
      setIsModalVisible(false);
    }
  });


  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    // Can not select days before today
    return current && current < moment().startOf('day');
  };

  


  const handleOk = () => {
    
    form
      .validateFields()
      .then(async (values: ReservationDataType) => {
        console.log(values);

        // edit 
        if (activeReservationObj) {


          let expected_arrival_time = values.expected_arrival_time.format();
          values.expected_arrival_time = expected_arrival_time;

          toUpdateReservation({
            variables:{
              id: activeReservationObj.id,
              data: values
            }
          })
        } else {
        // add new

        let userStr = sessionStorage.getItem("user");
        let user: {user: {id: string}};
        if(userStr){
          user = JSON.parse(userStr);
          let id = user?.user?.id;
          values.user = id;
          values.hotel= activeRestaurantObj.id;
        }

        let expected_arrival_time = values.expected_arrival_time.format();
        values.expected_arrival_time = expected_arrival_time;
        values.status = RESERVATION_STATUS.START

          toCreateReservation({
            variables: {
              data: values
            }
          })
        }

      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setActiveRestaurantObj(null)
  };

  const onFinish = async (values: any) => {
    console.log(values);
  };

  const afterClose = () => {
    form.resetFields();
    setActiveReservationObj(null);
  };

  useEffect(() => {
    if (isModalVisible && activeRestaurantObj) {

      // update reservation
      if(activeReservationObj){

        let values = Object.assign({}, activeReservationObj);

        // let expect_date = moment(values.expect_date);
        // values.expect_date = expect_date;
        // let expect_time = moment(values.expect_time, 'HH:mm:ss');
        // values.expect_time = expect_time;

        let expected_arrival_time = moment(values.expected_arrival_time);
        values.expected_arrival_time = expected_arrival_time;

        form.setFieldsValue(values);
      }else{
        // add new reservation
        let userStr = sessionStorage.getItem("user");
        let user: {user: {username: string, phone?: string}};
        if(userStr){
          user = JSON.parse(userStr);
          let userName = user?.user?.username;
          form.setFieldValue('username', userName)
          let phone = user?.user?.phone;
          if(phone){
            form.setFieldValue('phone', phone)
          }
        }
      }
      
    }
  }, [isModalVisible, activeReservationObj]);

  return (
    <Modal
      title={activeReservationObj ? `Edit Reservation` : `Create Reservation`}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={afterClose}
      okText="Confirm"
      cancelText="Cancel"
      okButtonProps={{loading: createLoading || updateLoading}}
      
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="username" label="Your Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Your Phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="expected_arrival_time" label="Expected Time" style={{width: "100%"}} rules={[{ required: true }]}>
          {/* <DatePicker onChange={onDateChange} /> */}

          <DatePicker
            // onOk={onDateTimeOk}
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={disabledDate}
            // disabledTime={disabledDateTime}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
        </Form.Item>

        <Form.Item name="size" label="Table Size" rules={[{ required: true }]}>
          <InputNumber/>
        </Form.Item>
        {/* <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default ReservationForm;
