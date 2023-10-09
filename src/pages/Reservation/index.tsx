import { PageContainer } from '@ant-design/pro-components';
import { Button,  List,  Popconfirm,Card, Row, Col } from 'antd';
import styles from './index.less';
import { useMemo, useState } from 'react';

import AddReservationForm from './addReservationForm';

import { gql, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import GlobalLoading from '@/components/GlobalLoading';

import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { RESERVATION_STATUS } from '@/constants';



const ReservationQuery = gql`
  query($id: String!,$status: String!){
    hotels{
      id: _id
      address
      name
      reservations(filters: { user: { id: $id}, status:{ ne: $status} }){
        id: _id
        size
        expected_arrival_time
        username
        phone
        status
        user{
          id: _id
          username
          phone
        }
      }
    }
  }
`;

// soft delete, change status
const ReservationDeleteQuery = gql`
  mutation($id: String!, $data: UpdateReservationInput!){
    updateReservation(id: $id, updateReservationInput: $data){
      id: _id
      status
    }
  }
`;




let userStr = sessionStorage.getItem("user");
let user: {user: {id: string}};
let userId: string;
if(userStr){
  user = JSON.parse(userStr);
  let id = user?.user?.id;
  userId = id;
}


const ReservationPage: React.FC = () => {


  const { loading:reservationLoading, data: restaurantData,  refetch: toGetReservationList} = useQuery(ReservationQuery,{
    variables: {
      id: userId,
      status: RESERVATION_STATUS.CANCELED
    },
    notifyOnNetworkStatusChange: true
  });

  const [toDeleteReservation] = useMutation(ReservationDeleteQuery, {
    onCompleted: () => {

      toGetReservationList()
    }
  });



  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeReservationObj, setActiveReservationObj] =
    useState<null | ReservationDataType>(null);


  const [activeRestaurantObj, setActiveRestaurantObj] =
    useState<null | ReservationDataType>(null);


  
  const restaurants = restaurantData?.hotels || [];

  const sortedRestaurant= useMemo(() => {

    let newres = [...restaurants].sort((a,b) => {
      let firstLength = a.reservations?.length;
      let secondLength = b.reservations?.length;
      return secondLength - firstLength ;
    });

    return newres;

  },[restaurants])


  return (
    <PageContainer ghost>
      <div className={styles.container}>
        {/* <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add new
        </Button> */}
        <div className='text-center'>
          <GlobalLoading spinning={reservationLoading} />
        </div>
        
        <Row gutter={[16, 16]}>
          {sortedRestaurant.map(item => (
            <Col span={12} sm={12} xs={24} key={item.id}>
              <Card title={item.name}  bordered={false} style={{ width: "100%" }}>
                <Button type="primary" size="small" className='mb-2'
                  onClick={() => {
                      setIsModalVisible(true);
                      setActiveRestaurantObj(item)
                      // setActiveReservationObj(item)
                    }
                  }
                >To reserve</Button>
                {
                  item?.reservations.length > 0 ? (
                    <List
                      size="small"
                      bordered
                      dataSource={item?.reservations}
                      renderItem={reser_item => (
                        <List.Item 
                          className={ reser_item.status === RESERVATION_STATUS.COMPLETED ? "bg-neutral-300" : ""}
                          title={reser_item.status === RESERVATION_STATUS.COMPLETED ? RESERVATION_STATUS.COMPLETED : ""}
                        >
                            <span className='pr-2'>{moment(reser_item.expected_arrival_time).format('YYYY-MM-DD HH:mm')} </span>
                           {/* {moment(reser_item.attributes.expect_time, 'HH:mm:ss').format('HH:mm') } */}

                            <div className='float-right'>
                              <EditOutlined 
                                onClick={() => {
                                    setIsModalVisible(true)
                                    setActiveReservationObj(reser_item);
                                    setActiveRestaurantObj(item);
                                }}
                                style={{ fontSize: '20px', color: '#08c' }} 
                              />

                              <Popconfirm
                                title="Are you sure to cancel this reservertion?"
                                onConfirm={() => toDeleteReservation({
                                  variables:{
                                    id: reser_item.id,
                                    data: {
                                      status: RESERVATION_STATUS.CANCELED
                                    }
                                  }
                                })}
                                // onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined className='ml-2' style={{ fontSize: '20px', color: 'red' }} />
                              </Popconfirm>
                              
                            </div>
                          
                        </List.Item>
                      )}
                    />
                  ):''
                }
                
              </Card>
            </Col>
          ))}
        </Row>

        {/* <Pagination
          defaultCurrent={1}
          total={restaurant?.meta?.pagination?.total}
          showTotal={(total, range) =>
            `show page ${range[0]} to ${range[1]}，totally ${total} records`
          }
          onChange={onReservationTableChange}
          current={pagination.current}
          pageSize={pagination.pageSize}
        /> */}
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
