import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import { useLocation } from 'react-router-dom';

interface Place {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

const Place: React.FC = () => {
  const [rowsPlaceData, setRowsPlaceData] = useState<Place[]>([]);
  const lastIdxRef = useRef<number>(0);
  const isLoading = useRef<boolean>(false);
  const hasMoreData = useRef<boolean>(true); // 데이터가 더 있는지 추적
  const location = useLocation();
  const searchTermRef = useRef<string>('');
  const gridRef = useRef<any>(null); // gridRef 추가

  const getPlaceData = useCallback(async (term: string) => {
    if (isLoading.current || !hasMoreData.current) return; // 이미 로딩 중이거나 더 이상 데이터가 없으면 중복 호출 방지
    isLoading.current = true;
    try {
      console.log('keyword', term);
      const response = await axios.get(
        `tour/locations?city=&keyword=${term}&lastIdx=${lastIdxRef.current}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const newData = response.data;
      if (newData.length === 0) {
        hasMoreData.current = false; // 더 이상 데이터가 없음을 표시
      } else {
        setRowsPlaceData((prevData) => [...prevData, ...newData]);
        lastIdxRef.current += newData.length; // lastIdx 업데이트
        setTimeout(() => {
          gridRef.current?.api?.ensureIndexVisible(lastIdxRef.current - 20);
        }, 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.current = false; // 로딩 상태 해제
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('q') || '';
    searchTermRef.current = searchTerm;
    lastIdxRef.current = 0; // lastIdx 초기화
    hasMoreData.current = true; // 검색어 변경 시 더 많은 데이터가 있다고 가정
    setRowsPlaceData([]);
    getPlaceData(searchTermRef.current); // 초기 데이터 로드
  }, [location.search, getPlaceData]);

  const handleScroll = useCallback(
    async (event: any) => {
      const verticalScrollPosition = event.api.getVerticalPixelRange();
      const totalScrollHeight =
        event.api.getDisplayedRowCount() *
        event.api.getSizesForCurrentTheme().rowHeight;

      if (verticalScrollPosition.bottom >= totalScrollHeight - 50) {
        await getPlaceData(searchTermRef.current); // 스크롤 시 최신 searchTerm 사용
      }
    },
    [getPlaceData],
  );

  const gridOptions: AgGridReactProps<Place> = {
    columnDefs: [
      {
        headerName: '번호',
        valueGetter: (params) =>
          params.node && params.node.rowIndex != null
            ? params.node.rowIndex + 1
            : '',
        width: 70,
        cellStyle: { textAlign: 'center' },
      },
      { headerName: '이름', field: 'name', width: 250 },
      { headerName: '주소', field: 'address', width: 300 },
      {
        headerName: '위도',
        field: 'latitude',
        width: 150,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '경도',
        field: 'longitude',
        width: 150,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '이미지주소',
        field: 'imageUrl',
        width: 200,
        cellStyle: { textAlign: 'center' },
      },
    ],
    defaultColDef: {
      sortable: true,
      headerClass: 'centered',
    },
    onBodyScroll: handleScroll,
  };

  const rowPlaceData =
    rowsPlaceData &&
    rowsPlaceData.map((v) => {
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
        <SearchBar curr={'place'} />
      </div>
      <div className="ag-theme-alpine" style={{ height: '75%', width: '80%' }}>
        <AgGridReact
          ref={gridRef} // gridRef를 추가하여 그리드 인스턴스 참조
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
