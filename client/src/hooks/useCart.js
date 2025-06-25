import { useEffect, useState } from 'react';
import { getCart} from '../services/apiServices';

const useCartCount = () => {
  const [itemCount, setItemCount] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const data = await getCart();
        setItemCount(data.length);
      } catch (error) {
        console.error('Failed to fetch cart Items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItem();
  }, []);
  return { itemCount, loading };
};

export default useCartCount;
