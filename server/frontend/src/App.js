import { Route, Routes } from 'react-router-dom';
import Dealers from './components/Dealers/Dealers';
import Dealer from './components/Dealers/Dealer';
import PostReview from './components/Dealers/PostReview';
import SearchCars from './components/Dealers/SearchCars';
import LoginPanel from './components/Login/Login';
import Register from './components/Register/Register';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Dealers />} />
      <Route path='/login' element={<LoginPanel />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dealers' element={<Dealers />} />
      <Route path='/dealer/:id' element={<Dealer />} />
      <Route path='/postreview/:id' element={<PostReview />} />
      <Route path='/searchcars/:id' element={<SearchCars />} />
    </Routes>
  );
}

export default App;
