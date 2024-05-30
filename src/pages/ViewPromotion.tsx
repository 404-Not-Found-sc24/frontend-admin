import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface PromotionDetail {
  title: string;
  content: string;
  createdDate: Date;
  updatedDate: Date;
  memberName: string;
  imageUrl: string;
  locationId: number;
  eventId: number;
}

const ViewPromotion: React.FC = () => {
  const [rowsPromotionData, setRowsPromotionData] =
    useState<PromotionDetail | null>(null);
  const location = useLocation();
  const promotionData = location.state as PromotionDetail;
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  useEffect(() => {
    getPromotionData();
  }, [accessToken]);

  const goList = () => {
    navigate('/promotion');
  };

  const goEdit = () => {
    navigate('/promotion/edit', {
      state: {
        promotionData: promotionData,
      },
    });
  };

  const getPromotionData = async () => {
    try {
      if (!accessToken) {
        console.error('Access token is missing.');
        return;
      }

      const response = await axios.get(
        `/event/announce/${promotionData.eventId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data);
      setRowsPromotionData(response.data);
    } catch (e) {
      console.error('Error:', e);
      toast.error('Failed to fetch notice data.');
    }
  };

  return (
    <div className="ml-[15%] h-full flex justify-center items-center w-[85%] overflow-y-scroll">
      <div className="w-4/5 h-4/5 flex-1 flex justify-center flex-col items-center mb-10">
        <div className="font-['Nanum Gothic'] text-3xl font-bold text-main-green-color h-[10%]">
          홍보자료 상세보기
        </div>
        <div className="w-4/5 h-[90%]">
          <div className="flex flex-row items-center h-[20%]">
            <div className="bg-main-green-color w-[0.3rem] h-8 rounded"></div>
            <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">
              제목
            </h1>
            <div className="w-1/2 p-2 mx-2 rounded-md font-['Nanum Gothic']">
              {promotionData.title}
            </div>
          </div>
          <div className="flex flex-col h-fit">
            <div className="flex flex-row items-center mb-1">
              <div className="bg-main-green-color w-[0.3rem] h-8 rounded"></div>
              <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">
                내용
              </h1>
            </div>
            <div className="w-full p-2 rounded-md font-['Nanum Gothic']">
              {promotionData.content}
            </div>
            {rowsPromotionData && rowsPromotionData.imageUrl && (
              <div className="w-full p-2 rounded-md font-['Nanum Gothic'] flex justify-center h-fit">
                <img
                  src={rowsPromotionData.imageUrl}
                  alt="Notice"
                  className="w-1/2 object-fit"
                />
              </div>
            )}
          </div>
          <div className="w-full flex justify-center pt-3">
            <div className="w-[20%] flex justify-between mt-10 mb-20">
              <button
                onClick={goList}
                className="w-20 h-12 bg-main-green-color text-white rounded-md font-['Nanum Gothic'] font-bold text-lg"
              >
                목록
              </button>
              <button
                onClick={goEdit}
                className="w-20 h-12 border-2 border-main-green-color text-main-green-color rounded-md font-['Nanum Gothic'] font-bold text-lg"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPromotion;
