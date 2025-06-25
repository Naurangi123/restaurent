// // MenuPage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSearchParams } from 'react-router-dom';

// const MenuPage = () => {
//   const [searchParams] = useSearchParams();
//   const tableNumber = searchParams.get('table_number');
//   const [menus, setMenus] = useState([]);
//   const [restaurant, setRestaurant] = useState("");

//   useEffect(() => {
//     axios.get(`http://127.0.0.1:8000/api/menus/?table_number=${tableNumber}`)
//       .then(res => {
//         setMenus(res.data.menus);
//         setRestaurant(res.data.restaurant_name);
//       })
//       .catch(err => console.error(err));
//   }, [tableNumber]);

//   return (
//     <div>
//       <h2>Welcome to {restaurant}</h2>
//       {menus.map(menu => (
//         <div key={menu.id}>
//           <h3>{menu.name}</h3>
//           <p>{menu.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MenuPage;


// MenuPage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSearchParams } from 'react-router-dom';

// const MenuPage = () => {
//   const [searchParams] = useSearchParams();
//   const tableNumber = searchParams.get('table_number');
//   const [menus, setMenus] = useState([]);
//   const [restaurant, setRestaurant] = useState("");
//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     axios.get(`http://127.0.0.1:8000/api/menus/?table_number=${tableNumber}`)
//       .then(res => {
//         setMenus(res.data.menus);
//         setRestaurant(res.data.restaurant_name);
//       })
//       .catch(err => console.error(err));
//   }, [tableNumber]);

//   const addToCart = (food) => {
//     setCart(prevCart => {
//       const item = prevCart.find(i => i.id === food.id);
//       if (item) {
//         return prevCart.map(i => i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i);
//       } else {
//         return [...prevCart, { ...food, quantity: 1 }];
//       }
//     });
//   };

//   return (
//     <div>
//       <h2>Welcome to {restaurant}</h2>
//       {menus.map(menu => (
//         <div key={menu.id}>
//           <h3>{menu.name}</h3>
//           {menu.foods.map(food => (
//             <div key={food.id} style={{borderBottom: "1px solid #ccc", marginBottom: "10px"}}>
//               <h4>{food.name}</h4>
//               <p>{food.description}</p>
//               <p>₹{food.price}</p>
//               <button onClick={() => addToCart(food)}>Add to Cart</button>
//             </div>
//           ))}
//         </div>
//       ))}

//       <hr />

//       <h3>Cart</h3>
//       {cart.map(item => (
//         <div key={item.id}>
//           {item.name} x {item.quantity}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MenuPage;


// MenuPage.jsx (updated)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table_number');
  const [menus, setMenus] = useState([]);
  const [restaurant, setRestaurant] = useState("");
  const [cart, setCart] = useState([]);
  const [tableId, setTableId] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/menus/?table_number=${tableNumber}`)
      .then(res => {
        setMenus(res.data.menus);
        setRestaurant(res.data.restaurant_name);
        setTableId(res.data.table_id); 
      })
      .catch(err => console.error(err));
  }, [tableNumber]);

  const addToCart = (food) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === food.id);
      if (item) {
        return prevCart.map(i => i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prevCart, { ...food, quantity: 1 }];
      }
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const cartItems = cart.map(item => ({
      food_id: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      table_id: tableId,
      cart_items: cartItems,
      customer_name: "Walk-In Guest",  
      customer_contact: "123456789",  
    };

    axios.post('http://127.0.0.1:8003/api/create-order/', orderData)
      .then(res => {
        alert("Order Placed Successfully! 🎉",res);
        setCart([]); // Clear cart
      })
      .catch(err => {
        console.error(err);
        alert("Failed to place order!");
      });
  };

  return (
    <div>
      <h2>Welcome to {restaurant}</h2>
      {menus.map(menu => (
        <div key={menu.id}>
          <h3>{menu.name}</h3>
          {menu.foods.map(food => (
            <div key={food.id} style={{borderBottom: "1px solid #ccc", marginBottom: "10px"}}>
              <h4>{food.name}</h4>
              <p>{food.description}</p>
              <p>₹{food.price}</p>
              <button onClick={() => addToCart(food)}>Add to Cart</button>
            </div>
          ))}
        </div>
      ))}

      <hr />

      <h3>Cart</h3>
      {cart.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity}
        </div>
      ))}

      <button onClick={placeOrder} style={{marginTop: "20px", padding: "10px 20px", backgroundColor: "green", color: "white"}}>
        Place Order
      </button>
    </div>
  );
};

export default MenuPage;
