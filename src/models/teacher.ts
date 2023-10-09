import TeacherServices from '@/services/teacher';

const { queryTeacherList } = TeacherServices.TeacherController;

export default {
  // namespace: 'teacher', //不写的话，默认是文件名
  state: {
    teacher: {},
  },

  effects: {
    *queryTeacherList({ payload }, { call, put }) {
      const res = yield call(queryTeacherList, payload);
      yield put({ type: 'queryTeacherSuccess', payload: res });
    },
  },

  reducers: {
    queryTeacherSuccess(state, { payload }) {
      return {
        ...state,
        teacher: payload,
      };
    },
  },
};
