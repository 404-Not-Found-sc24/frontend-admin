import React, { ChangeEvent, useCallback, useState } from 'react';
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditNotice: React.FC = () => {
    const location = useLocation();
    const noticeData = { ...location.state };
    const [title, setTitle] = useState(noticeData.noticeData.title);
    const [content, setContent] = useState(noticeData.noticeData.content);
    const [file, setFile] = useState<File | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>(noticeData.noticeData.imageUrl);
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const handleTitleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setTitle(event.target.value);
        },
        [],
    );

    const handleContentChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            setContent(event.target.value);
        },
        [],
    );

    const handleFileChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files.length > 0) {
                const selectedFile = event.target.files[0];
                setFile(selectedFile);
                setImgUrl(URL.createObjectURL(selectedFile));
            }
        },
        [],
    );

    const notifySuccess = () =>
        toast.success('공지가 성공적으로 수정되었습니다.', {
            position: 'top-center',
        });

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (file) {
            formData.append('images', file);
        }

        axios.patch(`/manage/announce/` + noticeData.noticeData.eventId, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log('Success:', response.data);
            notifySuccess();
            navigate('/notice');
            // 서버 응답에 따른 처리
        }).catch(error => {
            console.error('Error:', error);
            // 오류 처리
        });
    };

    return (
        <div className="w-5/6 ml-[240px] h-[900px] flex-1 flex justify-center flex-col items-center">
            <div className="font-['Nanum Gothic'] text-3xl mb-10 font-bold text-main-green-color">
                공지 수정
            </div>
            <div className="w-4/5">
                <div className='flex flex-row items-center mb-5'>
                    <div className='bg-main-green-color w-[0.3rem] h-8 rounded'></div>
                    <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">제목</h1>
                    <input
                        type="text"
                        value={title}
                        className="w-1/2 p-2 mx-2 border-2 border-gray rounded-md font-['Nanum Gothic'] text-black"
                        onChange={handleTitleChange}
                    />
                </div>
                <div className='flex flex-col mb-5'>
                    <div className="flex flex-row items-center mb-1">
                        <div className='bg-main-green-color w-[0.3rem] h-8 rounded'></div>
                        <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">내용</h1>
                    </div>
                    <textarea
                        value={content}
                        onChange={handleContentChange}
                        className="w-full p-2 border-2 border-gray rounded-md font-['Nanum Gothic']"
                        rows={15}
                        cols={50}
                    />
                </div>
                <div className='flex flex-col mb-3'>
                    <div className="flex flex-row items-center">
                        <div className='bg-main-green-color w-[0.3rem] h-8 rounded'></div>
                        <h1 className="text-lg font-medium mx-3 font-semibold font-['Nanum Gothic']">첨부파일</h1>
                        <input
                            type="file"
                            className="w-1/2 p-2 mx-2 border-2 border-gray rounded-md font-['Nanum Gothic']"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center mt-20">
                    <button onClick={handleSubmit}
                            className="px-8 py-2 bg-main-green-color text-white rounded-md font-['Nanum Gothic'] font-bold text-xl">
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditNotice;
