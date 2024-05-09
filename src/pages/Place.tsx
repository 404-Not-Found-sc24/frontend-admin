import React, {useEffect, useState} from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {AgGridReact, AgGridReactProps} from 'ag-grid-react';
import axios from "axios";
import {useAuth} from "../context/AuthContext";

interface Approval {
    address: string;
    content: string;
    date: string;
    detail: string;
    division: string;
    latitude: number;
    longitude: number;
    name: string;
    state: string;
    userName: string;
}

const Place: React.FC = () => {
    const [rowsPlaceData, setRowsPlaceData] = useState([]);
    const { accessToken } = useAuth();

    console.log(accessToken);

    useEffect(() => {
        getPlaceData();
    }, [accessToken]);

    const getPlaceData = async () => {
        try {
            if (!accessToken) {
                console.error("Access token is missing.");
                return;
            }

            await axios
                .get(`/manage/approval`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then(response => {
                    console.log(response.data);
                    setRowsPlaceData(response.data);
                });
        } catch(e) {
            console.error('Error:', e);
        };
    };

    const gridOptions: AgGridReactProps<Approval> = {
        columnDefs: [
            { headerName: '번호', valueGetter: (params) => params.node && params.node.rowIndex != null ? params.node.rowIndex + 1 : '' , width: 70, cellStyle: {textAlign: 'center'}},
            {headerName: '이름', field: 'name', width: 250},
            {headerName: '내용', field: 'content', width: 300},
            {headerName: '주소', field: 'address', width: 300},
            {headerName: '작성자', field: 'userName', width: 150, cellStyle: {textAlign: 'center'}},
            {headerName: '날짜', field: 'date', width: 150, cellStyle: {textAlign: 'center'}},
            {headerName: '승인', field: 'state', width: 100, cellStyle: {textAlign: 'center'}},
        ],
        defaultColDef: {
            sortable: true,
            headerClass: "centered",
        }
    };

    const rowPlaceData = rowsPlaceData && rowsPlaceData.map((v: any) => {
        return {
            name: v.name,
            content: v.content,
            address: v.address,
            userName: v.userName,
            date: v.date,
            state: v.state,
            detail: v.detail,
            division: v.division,
            latitude: v.latitude,
            longitude: v.longitude,
        };
    });

    return (
        <div className="w-5/6 ml-[240px] h-[900px] flex-1 flex justify-center flex-col items-center">
            <div className="font-['Nanum Gothic'] text-3xl mb-5 font-bold text-main-green-color">
                장소 관리
            </div>
            <div className="ag-theme-alpine" style={{height: "650px", width: '80%'}}>
                <AgGridReact
                    rowData={rowPlaceData}
                    gridOptions={gridOptions}
                    animateRows={true} // 행 애니메이션
                    suppressRowClickSelection={true} // true -> 클릭 시 행이 선택안됌
                    rowSelection={'multiple'} // 여러행 선택
                    enableCellTextSelection={true} // 그리드가 일반 테이블인 것처럼 드래그시 일반 텍스트 선택
                >
                </AgGridReact>
            </div>
        </div>
    );
};

export default Place;
