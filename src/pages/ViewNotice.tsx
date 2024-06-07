import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface NoticeDetail {
    title: string;
    content: string;
    createdDate: Date;
    updatedDate: Date;
    memberName: string;
    imageUrl: string;
    eventId: number;
}

const ViewNotice: React.FC = () => {
    const [rowsNoticeData, setRowsNoticeData] = useState<NoticeDetail | null>(null);
    const location = useLocation();
    const noticeData = location.state as NoticeDetail;
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    useEffect(() => {
        getNoticeData();
    }, [accessToken]);

    const goList = () => {
        navigate('/notice');
    };

    const goEdit = () => {
        navigate('/notice/edit', {
            state: {
                noticeData: noticeData,
            },
        });
    };

    const getNoticeData = async () => {
        try {
            if (!accessToken) {
                console.error('Access token is missing.');
                return;
            }

            const response = await axios.get(`/event/announce/${noticeData.eventId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            
            setRowsNoticeData(response.data);
        } catch (e) {
            console.error('Error:', e);
            toast.error('Failed to fetch notice data.');
        }
    };

    return (
        <div className="ml-[15%] h-full flex justify-center items-center w-[85%] overflow-y-scroll">
            <div className="w-4/5 h-4/5 flex-1 flex justify-center flex-col items-center mb-10">
                <div className="font-['Nanum Gothic'] text-3xl font-bold text-main-green-color h-[10%]">
                    공지 상세보기
                </div>
                <div className="w-4/5 h-[90%]">
                    <div className="flex flex-row items-center h-[20%]">
                        <div className="bg-main-green-color w-[0.3rem] h-8 rounded"></div>
                        <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">
                            제목
                        </h1>
                        <div className="w-1/2 p-2 mx-2 rounded-md font-['Nanum Gothic']">
                            {noticeData.title}
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
                            {noticeData.content}
                        </div>
                        {rowsNoticeData && rowsNoticeData.imageUrl && (
                            <div className="w-full p-2 rounded-md font-['Nanum Gothic'] flex justify-center h-fit">
                                <img src={rowsNoticeData.imageUrl} alt="Notice" className="w-1/2 object-fit"/>
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

export default ViewNotice;
