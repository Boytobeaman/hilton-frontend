import { PageContainer } from '@ant-design/pro-components';
import { Button, Popconfirm,Table } from 'antd';
import styles from './index.less';
import { useState, useEffect } from 'react';

import AddReservationForm from './addReservationForm';

import { gql, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';



const ReservationQuery = gql`
  query{
    reservations{
      id:_id
      size
      expected_arrival_time
      username
      phone
      status
      user{
        username
        phone
      }
    }
  }
`;

const ReservationDeleteQuery = gql`
  mutation($id: String!){
    deleteReservation(id: $id){
      id:_id
    }
  }
`;



interface ReservationDataType {
  id: string;
  username: string
  phone: string
}



const ReservationPage: React.FC = () => {


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeReservationObj, setActiveReservationObj] =
    useState<null | ReservationDataType>(null);


  const [activeRestaurantObj, setActiveRestaurantObj] =
    useState<null | ReservationDataType>(null);


  const { loading:reservationLoading, data: reservationData,  refetch: toGetReservationList} = useQuery(ReservationQuery,{
    // variables: {
    //   id: userId,
    //   status: RESERVATION_STATUS.CANCELED
    // },
    // notifyOnNetworkStatusChange: true
  });

  const [toDeleteReservation] = useMutation(ReservationDeleteQuery, {
    onCompleted: () => {

      toGetReservationList()
    }
  });

  const columns = [
    {
      title: 'Guest name',
      dataIndex: ['username'],
      key: 'username',
    },
    {
      title: 'Contact info',
      dataIndex: ['phone'],
      key: 'phone',
    },
    {
      title: 'Expected arrival time',
      dataIndex: ['expected_arrival_time'],
      key: 'expected_arrival_time',
      sorter: (a, b) => moment(b.expected_arrival_time).toDate() - moment(a.expected_arrival_time).toDate(),
      render: (text:any, record: any) => (
        <div>
          <span>{moment(record.expected_arrival_time).format('YYYY-MM-DD HH:mm') }</span>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: ['status'],
      key: 'status',
      sorter: (a, b) => {
        if(b.status > a.status){
          return 1
        }else if(b.status < a.status){
          return -1
        }else {
          return 0
        }
       
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: ReservationDataType) => {
        return (
          <>
            <Button
              size="small"
              style={{ marginRight: '10px' }}
              onClick={() => {
                setIsModalVisible(true);
                setActiveReservationObj(record)
              }}
            >
              edit
            </Button>
            <Popconfirm
              title="are you sure to delete？"
              onConfirm={() => toDeleteReservation({ 
                variables: {id: record.id}
              })}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Button
                size="small"
                style={{ marginRight: '10px' }}
                className="text-rose-700"
              >
                delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];



  

  
  const reservations = reservationData?.reservations || [];

  useEffect(() => {
    toGetReservationList();
  }, [])


  return (
    <PageContainer ghost>
      <div className={styles.container}>
        
        <Table
          dataSource={ reservations }
          columns={columns}
          pagination={false}
          loading={reservationLoading}
          rowKey="id"
        />


        <AddReservationForm
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          activeReservationObj={activeReservationObj}
          setActiveReservationObj={setActiveReservationObj}
          toGetReservationList={toGetReservationList}
          activeRestaurantObj={activeRestaurantObj}
          setActiveRestaurantObj={setActiveRestaurantObj}
        />
      </div>
    </PageContainer>
  );
};

export default ReservationPage;
