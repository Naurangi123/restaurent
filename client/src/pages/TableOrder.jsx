import React, { useEffect, useState } from 'react';
import { getTableOrder } from '../services/apiServices';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate,Outlet  } from 'react-router-dom';

const TableOrder = () => {
    const [tableOrders, setTableOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate()

    const fetchReservations = async () => {
        try {
            const data = await getTableOrder();
            setTableOrders(data);
        } catch (err) {
            console.error('Error fetching reservations', err);
            toast.error(err.message || 'Failed to fetch reservations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);


    const handleCart=()=>{
        navigate('/tablecart')
    }

    if (loading) {
        return <p className="text-center text-gray-600 mt-10">Loading your reservations...</p>;
    }

    return (
        <div className="max-w-4xl mx-4 p-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Menus
            </h2>
            <ToastContainer />
            {tableOrders.length === 0 ? (
                <p className="text-gray-600">No menu items for this table.</p>
            ) : (
                <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                    {tableOrders.map((res) => (
                        <div
                            key={res.id}
                            className="bg-white border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{res.name}</h3>
                            <img
                                src={`http://localhost:8000${res.image}`}
                                alt={res.name}
                                className="w-32 h-28 object-cover rounded-full"
                            />
                            <p className="text-sm text-gray-600 mb-1 truncate">
                                Category:{res.category}
                            </p>
                            <p className="text-sm text-gray-600 mb-1 truncate">
                                <strong>Description:</strong> {res.description}
                            </p>
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                                <strong>Active:</strong>
                                <span
                                    className={`w-3 h-3 rounded-full inline-block ${res.is_active ? 'bg-green-500' : 'bg-red-400'
                                        }`}
                                ></span>
                            </p>
                            <button onClick={handleCart}>add cart</button>
                        </div>
                    ))}
                </div>
            )}
            <Outlet />
        </div>
    );
};

export default TableOrder;
