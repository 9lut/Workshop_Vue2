import api from '@/api/axios';

export const createOrder = (productId, quantity) => {
  return api.post(`/products/${productId}/orders`, { quantity });
};

export const getMyOrders = () => {
  return api.get('/orders/me');
};
