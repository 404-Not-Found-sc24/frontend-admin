import React, {useCallback, useEffect, useState} from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import axios, { AxiosError } from 'axios';
import {useAuth} from "../context/AuthContext";

interface User {
  email: string;
  memberId: string;
  name: string;
  nickname: string;
  phone: string;
  role: string;
}

const User: React.FC = () => {
  const [rowsUserData, setRowsUserData] = useState([]);
  const { refreshAccessToken } = useAuth();
  const accessToken = localStorage.getItem('accessToken');

  console.log(accessToken);

  useEffect(() => {
    getUserData();
  }, [accessToken]);

  const deleteButtonRenderer = useCallback((params: any) => {
    const handleDelete = () => {
      const clickedRowData = params.data;
      console.log(accessToken); // accessToken 접근
      axios.delete(`/manage/member/` + clickedRowData.memberId, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(response => {
        console.log('Success:', response.data);
      }).catch(error => {
        console.error('Error:', error);
      });
    };

    return (
        <div className="flex items-center justify-center" onClick={handleDelete}>
          <div className="delete"></div>
        </div>
    );
  }, [accessToken]);

  const onCellValueChanged = (event: any) => {
    if (event.colDef.field === 'role' && event.data) {
      handleRoleChange(event.data);
    }
  };

  const handleRoleChange = async (rowData: User) => {
    try {
      if (rowData.role) {
        await changeRole(rowData);
      }
    } catch (error) {
      if (
          (error as AxiosError).response &&
          (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('Role 변경 실패:', error);
      }
    }
  };

  const changeRole = async (rowData: User) => {
    try {
      const { memberId, role } = rowData;
      console.log(memberId, role);
      const requestData = {
        memberId : memberId,
        targetRole : role,
      };
      const response = await axios.post(
          `/manage/member`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
      );
      console.log(response.data);
    } catch (e) {
      if (
          (e as AxiosError).response &&
          (e as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('사용자 role 변경 실패 :', e);
      }
    }
  };

  const getUserData = async () => {
    try {
      if (!accessToken) {
        console.error('Access token is missing.');
        return;
      }

      await axios
        .get(`/manage/member`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setRowsUserData(response.data);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const gridOptions: AgGridReactProps<User> = {
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
      { headerName: '이름', field: 'name', width: 150, cellStyle: { textAlign: 'center' }, },
      { headerName: '닉네임', field: 'nickname', width: 150, cellStyle: { textAlign: 'center' }, },
      {
        headerName: '전화번호',
        field: 'phone',
        width: 200,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '이메일',
        field: 'email',
        width: 300,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '구분',
        field: 'role',
        width: 100,
        cellStyle: { textAlign: 'center' },
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['USER', 'ADMIN', 'COMPANY'],
        },
        onCellValueChanged,
      },
      {
        headerName: '삭제',
        width: 70,
        cellRenderer: deleteButtonRenderer,
        cellStyle: {display: 'flex', justifyContent: 'center'},
      },
    ],
    defaultColDef: {
      sortable: true,
      headerClass: 'centered',
    },
  };

  const rowUserData =
    rowsUserData &&
    rowsUserData.map((v: any) => {
      return {
        email: v.email,
        name: v.name,
        nickname: v.nickname,
        phone: v.phone,
        role: v.role,
        memberId: v.memberId,
      };
    });

  return (
    <div className="w-5/6 ml-[15%] h-full flex-1 flex justify-center flex-col items-center">
      <div className="font-['Nanum Gothic'] text-3xl mb-5 font-bold text-main-green-color">
        사용자 관리
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: '75%', width: '80%' }}
      >
        <AgGridReact
          rowData={rowUserData}
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

export default User;
