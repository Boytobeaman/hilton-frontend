/* eslint-disable */
import { request } from 'umi';
import qs from 'qs';
import { graphqlRequest } from '@/utils/graphqlRequest';

export async function queryRestaurantList(con?: {name: string}){

  return graphqlRequest(
    `query($name: String!){
      restaurants(filters: { name: { containsi: $name }}){
        data{
          id
          attributes{
            name
            room_number
          }
        }
      }
    }`,
    { variables: { name: con?.name || 're'  } },
  )
}


export async function deleteRestaurant(id: string){

  return graphqlRequest(
    `mutation($id: ID!){
      deleteRestaurant(id: $id){
        data{
          id
        }
      }
    }`,
    { variables: { id  } },
  )
}



/** 此处后端没有提供注释 POST /api/v1/user */
export async function addTeacher(
  body?: {
    data: API.TeacherInfoVO;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_UserInfo_>(`${API_ROOT}${API_PREFIX}/teachers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/user/${param0} */
export async function getUserDetail(
  params: {
    // path
    /** userId */
    userId?: string;
  },
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return request<API.Result_UserInfo_>(`/api/v1/user/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/v1/user/${param0} */
export async function modifyTeacher(
  params: {
    // path
    /** userId */
    userId?: string;
  },
  body?: {
    data: API.TeacherInfoVO;
  },
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;

  return request<API.Result_UserInfo_>(
    `${API_ROOT}${API_PREFIX}/teachers/${param0}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 DELETE /api/v1/user/${param0} */
export async function deleteTeacher(
  params: {
    // path
    /** userId */
    userId?: string;
  },
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return request<API.Result_string_>(
    `${API_ROOT}${API_PREFIX}/teachers/${param0}`,
    {
      method: 'DELETE',
      ...(options || {}),
    },
  );
}
