import FoodOrderForm from '../components/OrderForm';
import Reciept from '../components/Reciept'

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <FoodOrderForm />
      <Reciept/>
    </div>
  );
}

export default AdminDashboard;
