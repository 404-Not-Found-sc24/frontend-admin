import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const ViewNotice: React.FC = () => {
    const location = useLocation();
    const noticeData = {...location.state};
    const navigate = useNavigate();

    console.log(noticeData);
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

    return (
        <div className="w-[90%] h-full flex float-right justify-center">
            <div className="w-5/6 h-full flex flex-col items-center py-24">
                <div className="h-[10%] font-['Nanum Gothic'] text-3xl mb-10 font-bold text-main-green-color ">
                    상세보기
                </div>
                <div className="w-4/5 h-[80%]">
                    <div className='flex flex-row items-center mb-5'>
                        <div className='bg-main-green-color w-[0.3rem] h-8 rounded'></div>
                        <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">제목</h1>
                        <div className="w-1/2 p-2 mx-2 rounded-md font-['Nanum Gothic']">
                            {noticeData.title}
                        </div>
                    </div>
                    <div className='flex flex-col mb-5 h-1/2'>
                        <div className="flex flex-row items-center mb-1">
                            <div className='bg-main-green-color w-[0.3rem] h-8 rounded'></div>
                            <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">내용</h1>
                        </div>
                        <div className="w-full p-2 rounded-md font-['Nanum Gothic']">
                            {noticeData.content}
                        </div>
                    </div>
                    <div className='flex flex-row items-center mb-3'>
                        <div className='bg-main-green-color w-[0.3rem] h-8 rounded'></div>
                        <h1 className="text-lg font-medium mx-3 font-semibold font-['Nanum Gothic']">첨부파일</h1>
                    </div>
                </div>
                <div className="w-full h-[10%] flex justify-center">
                    <div className="w-[20%] flex justify-between">
                        <button onClick={goList}
                                className="px-8 my-2 bg-main-green-color text-white rounded-md font-['Nanum Gothic'] font-bold text-xl">
                            목록
                        </button>
                        <button onClick={goEdit}
                                className="px-8 my-2 border-2 border-main-green-color text-main-green-color rounded-md font-['Nanum Gothic'] font-bold text-xl">
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewNotice;
