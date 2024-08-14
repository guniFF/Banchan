import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "../Table";
import Nav from "../Nav";
import NavItem from "../NavItem";
import SmallButton from "../Buttons/SmallButton";
import { Meeting } from "../../Type";
import { useCookies } from "react-cookie";
import Spinner from "../Spinner";
import Swal from "sweetalert2";

const NavElements = () => {
  return (
    <Nav>
      <NavItem to="/meeting/reservedMeeting" label="예약된 회의" />
      <NavItem to="/meeting/finishedMeeting" label="종료된 회의" />
    </Nav>
  );
};

const baseUrl = import.meta.env.VITE_BASE_API_URL;

const FinishedMeeting: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/session/get/roomList`,
          {
            headers: {
              Authorization: `Bearer ${cookies.Token}`,
            },
          }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setMeetings(response.data.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [cookies.Token]);

  const meetingSummary = async (meetingId: number) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/speech/${meetingId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.Token}`,
          },
        }
      );
      console.log(response.data);
      Swal.fire({
        title: "AI 요약 완료",
        text: "요약본이 성공적으로 생성되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } catch (error) {
      console.error("fail to summary", error);
      Swal.fire({
        title: "AI 요약 실패",
        text: "요약본 생성 도중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    } finally {
      setLoading(false); // 작업 완료 후 로딩 상태를 false로 설정
    }
  };

  const showResult = async (meetingId: number) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/session/detail/${meetingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.Token}`,
          },
        }
      );
      const summary = response.data.summary;
      console.log(summary);
      Swal.fire({
        title: `회의 ID: ${meetingId}`,
        html: `<pre style="text-align: left; white-space: pre-wrap;">${summary}</pre>`,
        icon: "info",
        confirmButtonText: "확인",
      });
    } catch (error) {
      console.log("error occuer", error);
    }
  };

  const checkResult = (meetingId: number) => {
    return (
      <SmallButton
        title="내용 확인"
        bgColor="bg-white"
        txtColor=""
        borderColor="border-customGreen"
        onClick={() => {
          showResult(meetingId);
        }}
      />
    );
  };

  const summarize = (meetingId: number) => {
    return (
      <SmallButton
        title="요약 정리"
        bgColor="bg-white"
        txtColor=""
        borderColor="border-customBlue"
        onClick={() => {
          meetingSummary(meetingId);
        }}
      />
    );
  };

  const deleteMeeting = (meetingId: number) => {
    return (
      <SmallButton
        title="삭제"
        bgColor="bg-white"
        txtColor="text-customRed"
        borderColor="border-customRed"
        onClick={() => {
          handleDeleteMeeting(meetingId);
        }}
      />
    );
  };

  const handleDeleteMeeting = async (meetingId: number) => {
    try {
      await axios.delete(`${baseUrl}/api/session/delete/room/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${cookies.Token}`,
        },
      });
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.id !== meetingId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const headers = [
    "번호",
    "제목",
    "주최자",
    "참가 인원",
    "AI 요약",
    "내용",
    "삭제",
  ];

  const data = meetings
    .filter((meeting) => !meeting.active && meeting.session)
    .map((meeting, index) => [
      index + 1,
      meeting.roomName,
      "관리자",
      `${meeting.id}` + "명",
      summarize(meeting.id),
      checkResult(meeting.id),
      deleteMeeting(meeting.id),
    ]);

  return (
    <>
      <NavElements />
      <div className="container mx-auto p-4 mt-3">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
            <Spinner /> {/* 스피너를 화면 중앙에 표시 */}
          </div>
        )}
        <div className="flex justify-end items-center mb-6 mr-6"></div>
        <Table headers={headers} data={data} />
      </div>
    </>
  );
};

export default FinishedMeeting;