/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from 'umi';
import qs from 'qs';

/** 此处后端没有提供注释 GET /api/v1/queryTeacherList */
export async function queryTeacherList(
  params: {
    // query
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const query = qs.stringify(
    {
      pagination: {
        page: params.current,
        pageSize: params.pageSize,
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );

  return request<API.Result_PageInfo_UserInfo__>(
    `${API_ROOT}${API_PREFIX}/teachers?${query}`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
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
