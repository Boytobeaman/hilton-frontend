import { Modal, Form, Input, InputNumber, DatePicker, DatePickerProps, Select, message, Alert } from 'antd';
import React, { useEffect, PropsWithChildren } from 'react';

import { gql, useMutation } from '@apollo/client';
import moment from 'moment';
import { RESERVATION_STATUS } from '@/constants';
import type { RangePickerProps } from 'antd/es/date-picker';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

interface ReservationDataType {
  username: any;
  id: string;
}

interface RestaurantDataType {
  id: string;
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
}

const ReservationAddQuery = gql`
  mutation($data: ReservationInput!){
    createReservation(data: $data){
      data{
        id
      }
    }
  }
`;

const ReservationUpdateQuery = gql`
  mutation($id: String!, $data: UpdateReservationInput!){
    updateReservation(id: $id, updateReservationInput: $data){
      id: _id
      username
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
    },
    onError: (err) => {
      message.warn(err.message)
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

        let expected_arrival_time = values.expected_arrival_time.format();
        values.expected_arrival_time = expected_arrival_time;

        toUpdateReservation({
          variables:{
            id: activeReservationObj.id,
            data: values
          }
        })
        
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
    if (isModalVisible) {

      // update reservation
      let values = Object.assign({}, activeReservationObj);

      let expected_arrival_time = moment(values.expected_arrival_time);
      values.expected_arrival_time = expected_arrival_time;

      form.setFieldsValue(values);
      
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
        <Form.Item name="username" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
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
        {/* <Form.Item name="expect_date" label="Expect Date" style={{width: "100%"}} rules={[{ required: true }]}>
          <DatePicker onChange={onDateChange} />
        </Form.Item>
        <Form.Item name="expect_time" label="Expect Time" style={{width: "100%"}} rules={[{ required: true }]}>
          <DatePicker picker={"time"} onChange={onTimeChange} />
        </Form.Item> */}
        <Form.Item name="size" label="Table Size" rules={[{ required: true }]}>
          <InputNumber/>
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select
            defaultValue={RESERVATION_STATUS.START}
            style={{ width: "100%" }}
            options={[
              {
                value: RESERVATION_STATUS.START,
                label: RESERVATION_STATUS.START,
              },
              {
                value: RESERVATION_STATUS.CANCELED,
                label: RESERVATION_STATUS.CANCELED,
              },
              {
                value: RESERVATION_STATUS.COMPLETED,
                label: RESERVATION_STATUS.COMPLETED,
              },
            ]}
          />
        </Form.Item>
        {/* <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
        {activeReservationObj ?(
          <Alert message={`Booked by User ${activeReservationObj.username}; User ID: ${activeReservationObj.id}`} type="info" />
        ):""}
      </Form>
    </Modal>
  );
};

export default ReservationForm;
