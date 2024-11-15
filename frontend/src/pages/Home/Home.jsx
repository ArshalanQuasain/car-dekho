import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Carcard from '../../components/cards/Carcard';
import { MdAdd } from 'react-icons/md';
import AddEditCar from './AddEditcar';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstances from '../../utils/axiosinstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/emptyCard/EmptyCard';
import noData from '../../assets/Images/noData.jpeg'

function Home() {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShow: false,
    type: 'add',
    data: null
  });

  const [showToastMessage, setToastMessage] = useState({
    isShow: false,
    message: "",
    type: "add"
  });

  const handleEdit = (carDetail) => {
    setOpenAddEditModel({
      isShow: true,
      data: carDetail,
      type: "edit",
    });
  };

  const showToastMsg = (message, type) => {
    setToastMessage({
      isShow: true,
      message,
      type
    });
  };

  const handleCloseToast = () => {
    setToastMessage({
      isShow: false,
      message: "",
      type: "add"
    });
  };

  const [userInfo, setUserInfo] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstances.get('/current-user');
      if (response.data && response.data.data && response.data.data._id) {
        setUserInfo(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getAllCars = async () => {
    try {
      const response = await axiosInstances.get('/getUserCars');
      if (response.data && response.data.data) {
        setAllCars(response.data.data);
      }
    } catch (error) {
      console.log("An unexpected error occurred while fetching data. Please try again.");
    }
  };

  const deleteCar = async (data) => {
    const carId = data._id;
    try {
      const response = await axiosInstances.delete(`/deleteCarListing/${carId}`);
      if (response.status === 200) {
        showToastMsg("Car Deleted Successfully", "delete");
        getAllCars();
      }
    } catch (error) {
      console.error('Error object:', error);
      if (error.response && error.response.message) {
        console.log(error.response.message);
      } else {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  const onSearchCar = async (query) => {
    try {
      const response = await axiosInstances.get('/getSearchCars', {
        params: {
          q: query
        }
      });
      if (response.data && response.data.data) {
        setIsSearch(true);
        setAllCars(response.data.data);
      }
    } catch (error) {
      console.log('Error object:', error);
      if (error.response && error.response.message) {
        console.log(error.response.message);
      } else {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllCars();
  };

  useEffect(() => {
    getAllCars();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchCar} handleClearSearch={handleClearSearch} showToastMsg={showToastMsg} />
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12'>
        {allCars.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8'>
            {allCars.map((car) => (
              <Carcard
                key={car._id}
                title={car.title}
                images={car.photos} 
                description={car.description}
                tags={car.tags}
                onEdit={() => handleEdit(car)}
                onDelete={() => deleteCar(car)}
              />
            ))}

          </div>
        ) : (
          <EmptyCard
            imgSrc={noData}
            message={isSearch ? `Oops no cars found with your query` : `Start adding your first car! Click the 'Add' button to add a new car listing.`}
          />
        )}
      </div>
      <button
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModel({
            isShow: true,
            type: 'add',
            data: null
          });
        }}
      >
        <MdAdd className='text-2xl text-white' />
      </button>

      <Modal
        isOpen={openAddEditModel.isShow}
        onRequestClose={() => setOpenAddEditModel({
          isShow: false,
          type: 'add',
          data: null
        })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,.2)'
          },
        }}
        contentLabel=""
        className="w-full max-w-4xl bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditCar
          type={openAddEditModel.type}
          carData={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({
              isShow: false,
              type: 'add',
              data: null
            });
          }}
          getAllCars={getAllCars}
          showToastMsg={showToastMsg}
        />
      </Modal>
      <Toast
        isShow={showToastMessage.isShow}
        message={showToastMessage.message}
        type={showToastMessage.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default Home;
