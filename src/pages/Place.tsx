import React, {useEffect, useState} from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {AgGridReact, AgGridReactProps} from 'ag-grid-react';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import SearchBar from "../components/SearchBar";

interface Place {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
}

const Place: React.FC = () => {
    const [rowsPlaceData, setRowsPlaceData] = useState([]);
    const [ keyword, setKeyword ] = useState('');
    const [lastIndex, setLastIndex] = useState(0);

    useEffect(() => {
        getPlaceData();
    }, []);

    const getPlaceData = async () => {
        try {
            await axios
                .get('tour/locations?city=&keyword=' + keyword + '&lastIdx=' + lastIndex, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    setRowsPlaceData(response.data);
                });
        } catch (e: any) {
            console.error(e);
        }
    };

    const gridOptions: AgGridReactProps<Place> = {
        columnDefs: [
            { headerName: '번호', valueGetter: (params) => params.node && params.node.rowIndex != null ? params.node.rowIndex + 1 : '' , width: 70, cellStyle: {textAlign: 'center'}},
            {headerName: '이름', field: 'name', width: 250},
            {headerName: '주소', field: 'address', width: 300},
            {headerName: '위도', field: 'latitude', width: 150, cellStyle: {textAlign: 'center'}},
            {headerName: '경도', field: 'longitude', width: 150, cellStyle: {textAlign: 'center'}},
            {headerName: '이미지주소', field: 'imageUrl', width: 200, cellStyle: {textAlign: 'center'}},
        ],
        defaultColDef: {
            sortable: true,
            headerClass: "centered",
        }
    };

    const rowPlaceData = rowsPlaceData && rowsPlaceData.map((v: any) => {
        return {
            name: v.name,
            address: v.address,
            latitude: v.latitude,
            longitude: v.longitude,
            imageUrl: v.imageUrl,
        };
    });

    return (
        <div className="w-5/6 ml-[15%] h-full flex-1 flex justify-center flex-col items-center">
            <div className="font-['Nanum Gothic'] text-3xl mb-5 font-bold text-main-green-color">
                장소 관리
            </div>
            <div className="w-1/2">
                <SearchBar/>
            </div>
            <div
                className="ag-theme-alpine"
                style={{height: '75%', width: '80%'}}
            >
                <AgGridReact
                    rowData={rowPlaceData}
                    gridOptions={gridOptions}
                    animateRows={true} // 행 애니메이션
                    suppressRowClickSelection={true} // true -> 클릭 시 행이 선택안됌
                    rowSelection={'multiple'} // 여러행 선택
                    enableCellTextSelection={true} // 그리드가 일반 테이블인 것처럼 드래그시 일반 텍스트 선택
                ></AgGridReact>
            </div>
        </div>
    );
};

export default Place;
