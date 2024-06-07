import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
    curr: string;
}

const SearchBar: React.FC<Props> = ({ curr }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchTermFromUrl = queryParams.get('q') || '';
        setSearchTerm(searchTermFromUrl);
    }, [location.search]);

    const handlePlaceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/place?q=${searchTerm}`);
    };

    const handleApprovalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/place/approval?q=${searchTerm}`);
    };

    const handleNoticeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/notice?q=${searchTerm}`);
    };


    const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/event?q=${searchTerm}`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            {curr === 'place' &&
                <form onSubmit={handlePlaceSubmit}>
                    <div className="w-full h-12 flex justify-center mb-5">
                        <div className="w-11/12 h-full rounded-md shadow-xl flex items-center">
                            <input
                                type="text"
                                className="text-gray-900 text-md rounded-lg block w-full ps-5 p-2.5 font-BMJUA focus:outline-0"
                                placeholder="원하는 장소 정보를 검색하세요"
                                onChange={handleChange}
                                value={searchTerm}
                            />
                            <button type="submit" className="search relative right-3"></button>
                        </div>
                    </div>
                </form>
            }
            {curr === 'approval' &&
                <form onSubmit={handleApprovalSubmit}>
                    <div className="w-full h-12 flex justify-center mb-5">
                        <div className="w-11/12 h-full rounded-md shadow-xl flex items-center">
                            <input
                                type="text"
                                className="text-gray-900 text-md rounded-lg block w-full ps-5 p-2.5 font-BMJUA focus:outline-0"
                                placeholder="원하는 장소 승인 정보를 검색하세요"
                                onChange={handleChange}
                                value={searchTerm}
                            />
                            <button type="submit" className="search relative right-3"></button>
                        </div>
                    </div>
                </form>
            }
            {curr === 'notice' &&
                <form onSubmit={handleNoticeSubmit}>
                    <div className="w-full h-12 flex justify-center mb-5">
                        <div className="w-11/12 h-full rounded-md shadow-xl flex items-center">
                            <input
                                type="text"
                                className="text-gray-900 text-md rounded-lg block w-full ps-5 p-2.5 font-BMJUA focus:outline-0"
                                placeholder="원하는 공지를 검색하세요"
                                onChange={handleChange}
                                value={searchTerm}
                            />
                            <button type="submit" className="search relative right-3"></button>
                        </div>
                    </div>
                </form>
            }
            {curr === 'event' &&
                <form onSubmit={handleEventSubmit}>
                    <div className="w-full h-12 flex justify-center mb-5">
                        <div className="w-11/12 h-full rounded-md shadow-xl flex items-center">
                            <input
                                type="text"
                                className="text-gray-900 text-md rounded-lg block w-full ps-5 p-2.5 font-BMJUA focus:outline-0"
                                placeholder="원하는 이벤트를 검색하세요"
                                onChange={handleChange}
                                value={searchTerm}
                            />
                            <button type="submit" className="search relative right-3"></button>
                        </div>
                    </div>
                </form>
            }
        </div>
    );
};

export default SearchBar;
