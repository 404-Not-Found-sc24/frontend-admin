import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import "../index.css"

const Navbar: React.FC = () => {
    const {isAuthenticated, logout} = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="left">
            <div className="left-in">
                <Link
                    to="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse mt-5 text-center mb-5"
                >
          <span className="self-center text-5xl font-Dongle-Regular whitespace-nowrap text-white">
            나들이
          </span>
                </Link>
<div>
    {isAuthenticated ? (
        <ul className="lnb">
            <li className="lnb-one subin">
                <a href="/" className="lnb-onea"><span>메인페이지</span></a>
            </li>
            <li className="lnb-one subin">
                <a href="/place" className="lnb-onea"><span>장소 관리</span></a>
            </li>
            <li className="lnb-one subin">
                <a href="/place/approval" className="lnb-onea"><span>장소 승인 관리</span></a>
            </li>
            <li className="lnb-one subin">
                <a href="/notice" className="lnb-onea"><span>공지 관리</span></a>
            </li>
            <li className="lnb-one subin">
                <a href="/event" className="lnb-onea"><span>이벤트 관리</span></a>
            </li>
            <li className="lnb-one subin">
                <a href="/promotion" className="lnb-onea"><span>홍보 관리</span></a>
            </li>
            <li className="lnb-one subin">
                <a href="/user" className="lnb-onea"><span>사용자 관리</span></a>
            </li>
            <li className="lnb-one subin">
                <a href="/" className="lnb-onea" onClick={handleLogout}><span>로그아웃</span></a>
            </li>

        </ul>
    ) : (
        <ul className="lnb">
            <li className="lnb-one subin">
                <a href="/signin" className="lnb-onea"><span>로그인</span></a>
            </li>
        </ul>
    )}
</div>

            </div>
        </div>

    );
};

export default Navbar;
