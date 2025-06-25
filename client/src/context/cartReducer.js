// src/context/cartReducer.js

export const initialState = {
  cartData: [],
};

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = action.payload;
      const existingItem = state.cartData.find(i => i.id === item.id);

      if (existingItem) {
        const updatedCart = state.cartData.map(i =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } : i
        );
        return { ...state, cartData: updatedCart };
      } else {
        return {
          ...state,
          cartData: [...state.cartData, { ...item, quantity: item.quantity || 1 }],
        };
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        cartData: state.cartData.filter(item => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartData: [],
      };

    default:
      return state;
  }
}
