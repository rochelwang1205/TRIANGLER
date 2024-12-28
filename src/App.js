// import { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
// import axios from 'axios';
// import { Modal } from 'bootstrap';
import './assets/index.css';
import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';
import Input from './components/input';

function App() {
 
  return (
    <div className="App">
      <Navbar />
      <Input />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;


// function App() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await apiService.getExample();
//         setData(result);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       {/* 顯示資料 */}
//     </div>
//   );
// }

// export default App;