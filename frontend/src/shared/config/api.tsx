import axiosInstance from './axiosinstance';

export const loginApi = (data: {username: string, password: string}) => {
   return axiosInstance.post('/auth/login', data);
};

export const registerApi = (data: {email: string, username: string, password: string}) => {
   return axiosInstance.post('/auth/register', data);
};

export const getUserListApi = (searchParams?: {search?: string, category?: string}) => {
   const params = new URLSearchParams();
   
   if (searchParams?.search && searchParams.search.trim()) {
      params.append('search', searchParams.search.trim());
   }
   
   if (searchParams?.category && searchParams.category !== 'All') {
      params.append('category', searchParams.category);
   }
   
   const queryString = params.toString();
   const url = `/user/list${queryString ? `?${queryString}` : ''}`;
   
   return axiosInstance.get(url);
};