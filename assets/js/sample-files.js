// 세 버전이 함께 사용하는 가상 폴더와 파일 데이터입니다.
(function () {
  'use strict';
  const categories = [
  {
    "id": "assignments",
    "label": "학교 과제",
    "icon": "📄",
    "description": "수업 과제와 팀 프로젝트",
    "color": "#cb7958"
  },
  {
    "id": "leisure",
    "label": "유희",
    "icon": "☕",
    "description": "취미와 쉬는 시간의 기록",
    "color": "#bb8062"
  },
  {
    "id": "study",
    "label": "공부",
    "icon": "📚",
    "description": "강의 자료와 공부 노트",
    "color": "#778b75"
  },
  {
    "id": "media",
    "label": "사진 · 동영상",
    "icon": "📷",
    "description": "일상과 추억을 담은 파일",
    "color": "#aa9475"
  }
];
  const files = [
  {
    "id": "a1",
    "category": "assignments",
    "name": "회로이론_최종보고서.pdf",
    "type": "PDF",
    "lastAccessMonths": 18,
    "sizeMB": 4.8,
    "duplicateKey": "circuit-report",
    "preview": "회로이론 설계 프로젝트 최종 보고서\n1. 실험 목적\n저항과 축전기로 구성한 RC 회로에 서로 다른 주파수의 신호를 입력하고, 출력 전압의 크기와 위상 변화를 측정한다. 실험값을 이론값과 비교하여 오차의 원인을 분석한다.",
    "detail": "2024년 2학기 회로이론 프로젝트 제출본. 실험 방법과 측정 결과가 포함되어 있어요."
  },
  {
    "id": "a2",
    "category": "assignments",
    "name": "회로이론_최종보고서 (1).pdf",
    "type": "PDF",
    "lastAccessMonths": 17,
    "sizeMB": 4.8,
    "duplicateKey": "circuit-report",
    "preview": "회로이론 설계 프로젝트 최종 보고서\n1. 실험 목적\n저항과 축전기로 구성한 RC 회로에 서로 다른 주파수의 신호를 입력하고, 출력 전압의 크기와 위상 변화를 측정한다. 실험값을 이론값과 비교하여 오차의 원인을 분석한다.",
    "detail": "회로이론_최종보고서.pdf와 내용이 같은 사본이에요."
  },
  {
    "id": "a3",
    "category": "assignments",
    "name": "자료구조_팀발표_최종.pptx",
    "type": "PPTX",
    "lastAccessMonths": 14,
    "sizeMB": 8.5,
    "duplicateKey": "ds-slides",
    "preview": "자료구조 팀 프로젝트 발표\n경로 탐색 알고리즘 비교\n오늘 발표에서는 너비 우선 탐색과 다익스트라 알고리즘의 동작 과정을 설명하고, 그래프 크기에 따른 실행 시간과 메모리 사용량을 비교하겠습니다.",
    "detail": "발표 자료와 알고리즘 비교 표가 담겨 있어요."
  },
  {
    "id": "a4",
    "category": "assignments",
    "name": "자료구조_팀발표_최종_복사본.pptx",
    "type": "PPTX",
    "lastAccessMonths": 13,
    "sizeMB": 8.5,
    "duplicateKey": "ds-slides",
    "preview": "자료구조 팀 프로젝트 발표\n경로 탐색 알고리즘 비교\n오늘 발표에서는 너비 우선 탐색과 다익스트라 알고리즘의 동작 과정을 설명하고, 그래프 크기에 따른 실행 시간과 메모리 사용량을 비교하겠습니다.",
    "detail": "자료구조_팀발표_최종.pptx와 동일한 사본이에요."
  },
  {
    "id": "a5",
    "category": "assignments",
    "name": "캡스톤_아이디어_초안.docx",
    "type": "DOCX",
    "lastAccessMonths": 11,
    "sizeMB": 0.6,
    "duplicateKey": null,
    "preview": "캡스톤 디자인 아이디어 초안\n1. 스마트 실내 환경 센서\n온도와 이산화탄소 농도를 측정해 환기 시점을 알려준다. 센서 값은 휴대전화 화면에 기록하고, 배터리 사용 시간을 고려해 측정 주기를 조절한다.",
    "detail": "초기 아이디어와 수정 전 메모가 담겨 있어요."
  },
  {
    "id": "a6",
    "category": "assignments",
    "name": "캡스톤_최종발표.pdf",
    "type": "PDF",
    "lastAccessMonths": 5,
    "sizeMB": 12.4,
    "duplicateKey": null,
    "preview": "캡스톤 디자인 최종 발표\n스마트 실내 환경 모니터링\n실내 환경을 지속적으로 측정하고 사용자가 현재 상태를 직관적으로 확인할 수 있도록 센서와 대시보드를 제작했습니다. 다음은 프로토타입과 실험 결과입니다.",
    "detail": "최종 발표용 자료예요. 실험 사진과 결과 그래프를 포함합니다."
  },
  {
    "id": "a7",
    "category": "assignments",
    "name": "팀회의_2024_10_14.docx",
    "type": "DOCX",
    "lastAccessMonths": 24,
    "sizeMB": 0.2,
    "duplicateKey": null,
    "preview": "팀 프로젝트 3차 회의록\n일시: 2024년 10월 14일\n이번 주에는 회로 측정 결과를 다시 확인하고 발표 자료의 그래프를 수정한다. 각자 담당한 실험 과정과 남은 질문은 금요일까지 공유 문서에 정리한다.",
    "detail": "과거 팀 회의의 일정과 할 일을 정리한 기록이에요."
  },
  {
    "id": "a8",
    "category": "assignments",
    "name": "수치해석_과제3.zip",
    "type": "ZIP",
    "lastAccessMonths": 30,
    "sizeMB": 25.6,
    "duplicateKey": null,
    "preview": "수치해석 과제 3\n\n코드와 실행 결과가 포함된 압축 파일",
    "detail": "과제 제출용 코드와 결과 이미지가 담겨 있어요."
  },
  {
    "id": "a9",
    "category": "assignments",
    "name": "프로그래밍_실습_결과.txt",
    "type": "TXT",
    "lastAccessMonths": 21,
    "sizeMB": 0.1,
    "duplicateKey": null,
    "preview": "프로그래밍 실습 실행 결과\n테스트 1: 통과\n테스트 2: 통과\n입력된 정수 배열을 정렬한 뒤 최솟값과 최댓값을 출력했습니다. 빈 배열을 입력한 경우에는 오류 메시지를 표시하고 프로그램을 종료합니다.",
    "detail": "수업 실습에서 생성한 실행 결과 기록이에요."
  },
  {
    "id": "l1",
    "category": "leisure",
    "name": "주말_영화목록.pdf",
    "type": "PDF",
    "lastAccessMonths": 20,
    "sizeMB": 1.4,
    "duplicateKey": "movies",
    "preview": "보고 싶은 영화 목록\n인터스텔라: 주말에 다시 보기\n리틀 포레스트: 조용한 저녁에 보기\n월터의 상상은 현실이 된다: 친구들과 함께 보기\n다음에 만날 때 보고 싶은 영화를 각자 하나씩 추가하기.",
    "detail": "친구와 공유했던 주말 영화 목록이에요."
  },
  {
    "id": "l2",
    "category": "leisure",
    "name": "주말_영화목록 (1).pdf",
    "type": "PDF",
    "lastAccessMonths": 19,
    "sizeMB": 1.4,
    "duplicateKey": "movies",
    "preview": "보고 싶은 영화 목록\n인터스텔라: 주말에 다시 보기\n리틀 포레스트: 조용한 저녁에 보기\n월터의 상상은 현실이 된다: 친구들과 함께 보기\n다음에 만날 때 보고 싶은 영화를 각자 하나씩 추가하기.",
    "detail": "주말_영화목록.pdf와 내용이 같은 사본이에요."
  },
  {
    "id": "l3",
    "category": "leisure",
    "name": "여행_맛집_리스트.txt",
    "type": "TXT",
    "lastAccessMonths": 15,
    "sizeMB": 0.1,
    "duplicateKey": null,
    "preview": "부산 여행 맛집 리스트\n해운대 근처: 바다가 보이는 작은 카페, 브런치 가게\n광안리: 저녁에 갈 식당과 산책 코스\n토요일은 사람이 많을 수 있으니 영업시간과 예약 여부를 출발 전에 다시 확인하기.",
    "detail": "여행 전에 정리했던 식당 후보 목록이에요."
  },
  {
    "id": "l4",
    "category": "leisure",
    "name": "게임_공략_저장.pdf",
    "type": "PDF",
    "lastAccessMonths": 28,
    "sizeMB": 6.8,
    "duplicateKey": "game",
    "preview": "게임 공략 노트\n초반 퀘스트와 아이템 위치\n첫 번째 마을에서 지도를 받은 뒤 북쪽 숲으로 이동한다. 회복 아이템은 상점에서 미리 준비하고, 갈림길에서는 동쪽 길로 가면 보물 상자를 찾을 수 있다.",
    "detail": "게임을 하며 저장한 공략 자료예요."
  },
  {
    "id": "l5",
    "category": "leisure",
    "name": "게임_공략_저장_복사.pdf",
    "type": "PDF",
    "lastAccessMonths": 25,
    "sizeMB": 6.8,
    "duplicateKey": "game",
    "preview": "게임 공략 노트\n초반 퀘스트와 아이템 위치\n첫 번째 마을에서 지도를 받은 뒤 북쪽 숲으로 이동한다. 회복 아이템은 상점에서 미리 준비하고, 갈림길에서는 동쪽 길로 가면 보물 상자를 찾을 수 있다.",
    "detail": "게임_공략_저장.pdf와 같은 내용이에요."
  },
  {
    "id": "l6",
    "category": "leisure",
    "name": "취미_도예_클래스.jpg",
    "type": "JPG",
    "lastAccessMonths": 9,
    "sizeMB": 3.2,
    "duplicateKey": null,
    "preview": "도예 클래스 안내 이미지\n\n흙을 빚어 작은 컵을 만드는 원데이 클래스",
    "detail": "관심 있던 도예 클래스의 안내 이미지예요."
  },
  {
    "id": "l7",
    "category": "leisure",
    "name": "콘서트_예매안내.pdf",
    "type": "PDF",
    "lastAccessMonths": 32,
    "sizeMB": 0.9,
    "duplicateKey": null,
    "preview": "공연 예매 및 입장 안내\n공연 당일에는 예매 내역과 신분증을 지참해 주세요. 입장은 시작 한 시간 전부터 진행되며, 현장 상황에 따라 대기 시간이 길어질 수 있습니다. 자세한 사항은 예매처 공지를 확인해 주세요.",
    "detail": "지난 공연의 예매 안내문이에요."
  },
  {
    "id": "l8",
    "category": "leisure",
    "name": "플레이리스트_메모.txt",
    "type": "TXT",
    "lastAccessMonths": 6,
    "sizeMB": 0.1,
    "duplicateKey": null,
    "preview": "밤에 듣기 좋은 플레이리스트\n잔잔한 기타와 피아노 곡 모음\n공부를 마치고 돌아가는 길에 듣기 좋은 곡들을 모았다. 새로 발견한 노래는 제목과 가수를 적고, 나중에 친구에게도 추천할 것.",
    "detail": "좋아하는 음악을 적어둔 메모예요."
  },
  {
    "id": "l9",
    "category": "leisure",
    "name": "카페_쿠폰_스크린샷.png",
    "type": "PNG",
    "lastAccessMonths": 23,
    "sizeMB": 2.1,
    "duplicateKey": null,
    "preview": "카페 쿠폰 캡처\n\n아메리카노 무료 쿠폰",
    "detail": "이전에 저장한 카페 쿠폰 이미지예요."
  },
  {
    "id": "s1",
    "category": "study",
    "name": "전자기학_1주차.pdf",
    "type": "PDF",
    "lastAccessMonths": 26,
    "sizeMB": 5.2,
    "duplicateKey": "em-week1",
    "preview": "전자기학 1주차: 전하와 전기장\n전하는 물질이 전기적 상호작용을 일으키는 물리량이다. 점전하 주변의 전기장은 거리에 따라 달라지며, 여러 전하가 만드는 전기장은 중첩 원리에 따라 더할 수 있다.",
    "detail": "전자기학 강의 자료의 첫 번째 주차예요."
  },
  {
    "id": "s2",
    "category": "study",
    "name": "전자기학_1주차 (1).pdf",
    "type": "PDF",
    "lastAccessMonths": 24,
    "sizeMB": 5.2,
    "duplicateKey": "em-week1",
    "preview": "전자기학 1주차: 전하와 전기장\n전하는 물질이 전기적 상호작용을 일으키는 물리량이다. 점전하 주변의 전기장은 거리에 따라 달라지며, 여러 전하가 만드는 전기장은 중첩 원리에 따라 더할 수 있다.",
    "detail": "전자기학_1주차.pdf와 같은 자료예요."
  },
  {
    "id": "s3",
    "category": "study",
    "name": "선형대수_중간고사_정리.pdf",
    "type": "PDF",
    "lastAccessMonths": 16,
    "sizeMB": 3.5,
    "duplicateKey": null,
    "preview": "선형대수 중간고사 정리\n벡터공간 V의 공집합이 아닌 부분집합 W가 벡터 덧셈과 스칼라 곱셈에 대해 닫혀 있을 때 W를 부분공간이라 한다. 부분공간은 영벡터를 포함하고, 벡터의 선형결합을 포함한다.",
    "detail": "직접 정리한 개념과 예제 풀이가 담겨 있어요."
  },
  {
    "id": "s4",
    "category": "study",
    "name": "파이썬_기초_강의노트.pdf",
    "type": "PDF",
    "lastAccessMonths": 31,
    "sizeMB": 2.3,
    "duplicateKey": "python-notes",
    "preview": "Python 기초 강의 노트\n1. 변수와 자료형\n변수는 값을 참조하는 이름이다. 정수와 문자열의 차이를 확인하고, 조건문과 반복문을 이용해 입력한 값에 따라 다른 결과가 출력되는 프로그램을 작성한다.",
    "detail": "파이썬 기초 수업의 강의 노트예요."
  },
  {
    "id": "s5",
    "category": "study",
    "name": "파이썬_기초_강의노트_복사.pdf",
    "type": "PDF",
    "lastAccessMonths": 29,
    "sizeMB": 2.3,
    "duplicateKey": "python-notes",
    "preview": "Python 기초 강의 노트\n1. 변수와 자료형\n변수는 값을 참조하는 이름이다. 정수와 문자열의 차이를 확인하고, 조건문과 반복문을 이용해 입력한 값에 따라 다른 결과가 출력되는 프로그램을 작성한다.",
    "detail": "파이썬_기초_강의노트.pdf와 같은 내용이에요."
  },
  {
    "id": "s6",
    "category": "study",
    "name": "운영체제_기말_요약.docx",
    "type": "DOCX",
    "lastAccessMonths": 12,
    "sizeMB": 1.1,
    "duplicateKey": null,
    "preview": "운영체제 기말고사 요약\n프로세스는 실행 중인 프로그램이며 각각 독립된 주소 공간을 가진다. 스레드는 같은 프로세스의 자원을 공유한다. 문맥 전환과 동기화가 필요한 이유를 예제와 함께 설명할 수 있어야 한다.",
    "detail": "시험을 준비하며 작성한 개인 요약이에요."
  },
  {
    "id": "s7",
    "category": "study",
    "name": "알고리즘_문제풀이.ipynb",
    "type": "IPYNB",
    "lastAccessMonths": 8,
    "sizeMB": 2.8,
    "duplicateKey": null,
    "preview": "# 알고리즘 문제 풀이\n# 이진 탐색\n정렬된 배열에서 찾는 값과 가운데 값을 비교한다. 찾는 값이 작으면 왼쪽 구간을, 크면 오른쪽 구간을 탐색한다. 반복할 때마다 탐색 범위가 절반으로 줄어든다.",
    "detail": "직접 작성한 풀이와 코드가 담겨 있어요."
  },
  {
    "id": "s8",
    "category": "study",
    "name": "영어_전공단어.xlsx",
    "type": "XLSX",
    "lastAccessMonths": 22,
    "sizeMB": 0.5,
    "duplicateKey": null,
    "preview": "전공 영어 단어 정리\ncircuit: 회로\nalgorithm: 알고리즘\nresistor: 저항기\n전공 수업과 논문에서 자주 접한 단어를 정리한다. 예문을 하나씩 추가하고 뜻이 헷갈리는 단어는 다음 주에 다시 확인하기.",
    "detail": "수업에서 접한 전공 단어를 정리한 표예요."
  },
  {
    "id": "s9",
    "category": "study",
    "name": "데이터베이스_참고자료.pdf",
    "type": "PDF",
    "lastAccessMonths": 18,
    "sizeMB": 7.6,
    "duplicateKey": null,
    "preview": "데이터베이스 참고 자료\n관계형 데이터베이스는 데이터를 행과 열로 구성된 테이블에 저장한다. 기본키는 각 행을 식별하고 외래키는 테이블 사이의 관계를 나타낸다. 이어서 SQL 조회문의 기본 구조를 살펴본다.",
    "detail": "수업 보충을 위해 내려받은 참고 자료예요."
  },
  {
    "id": "m1",
    "category": "media",
    "name": "제주여행_단체사진.jpg",
    "type": "JPG",
    "lastAccessMonths": 19,
    "sizeMB": 5.3,
    "duplicateKey": "jeju-group",
    "preview": "제주 여행 단체사진\n\n바다 앞에서 친구들과 찍은 사진",
    "detail": "같은 사진의 사본이 함께 저장되어 있어요."
  },
  {
    "id": "m2",
    "category": "media",
    "name": "제주여행_단체사진 (1).jpg",
    "type": "JPG",
    "lastAccessMonths": 18,
    "sizeMB": 5.3,
    "duplicateKey": "jeju-group",
    "preview": "제주 여행 단체사진\n\n바다 앞에서 친구들과 찍은 사진",
    "detail": "제주여행_단체사진.jpg와 같은 사진이에요."
  },
  {
    "id": "m3",
    "category": "media",
    "name": "축제_공연영상.mp4",
    "type": "MP4",
    "lastAccessMonths": 21,
    "sizeMB": 240,
    "duplicateKey": "festival-video",
    "preview": "학교 축제 공연 영상\n\n00:48 · 야외 무대",
    "detail": "학교 축제에서 찍은 짧은 공연 영상이에요."
  },
  {
    "id": "m4",
    "category": "media",
    "name": "축제_공연영상_복사.mp4",
    "type": "MP4",
    "lastAccessMonths": 20,
    "sizeMB": 240,
    "duplicateKey": "festival-video",
    "preview": "학교 축제 공연 영상\n\n00:48 · 야외 무대",
    "detail": "축제_공연영상.mp4와 같은 영상이에요."
  },
  {
    "id": "m5",
    "category": "media",
    "name": "동아리_단체사진.jpg",
    "type": "JPG",
    "lastAccessMonths": 10,
    "sizeMB": 4.7,
    "duplicateKey": null,
    "preview": "동아리 단체사진\n\n학기 말에 동아리 친구들과 찍은 사진",
    "detail": "친구들과 함께 찍은 단체사진이에요."
  },
  {
    "id": "m6",
    "category": "media",
    "name": "제주_바다_노을.jpg",
    "type": "JPG",
    "lastAccessMonths": 19,
    "sizeMB": 6.1,
    "duplicateKey": null,
    "preview": "제주 바다의 노을\n\n여행 중 촬영한 풍경",
    "detail": "제주 여행에서 찍은 노을 사진이에요."
  },
  {
    "id": "m7",
    "category": "media",
    "name": "시간표_스크린샷.png",
    "type": "PNG",
    "lastAccessMonths": 27,
    "sizeMB": 1.8,
    "duplicateKey": null,
    "preview": "2024년 1학기 시간표\n\n월요일부터 금요일까지의 수업 일정",
    "detail": "지난 학기 시간표 캡처예요."
  },
  {
    "id": "m8",
    "category": "media",
    "name": "실험실_촬영영상.mp4",
    "type": "MP4",
    "lastAccessMonths": 7,
    "sizeMB": 180,
    "duplicateKey": null,
    "preview": "실험실 촬영 영상\n\n01:22 · 센서 동작 시연",
    "detail": "팀 프로젝트의 센서 동작을 촬영한 영상이에요."
  },
  {
    "id": "m9",
    "category": "media",
    "name": "졸업전시_포스터.png",
    "type": "PNG",
    "lastAccessMonths": 13,
    "sizeMB": 3.8,
    "duplicateKey": null,
    "preview": "졸업전시 포스터\n\n일정과 장소가 적힌 안내 이미지",
    "detail": "방문하려고 저장해 둔 전시 안내 이미지예요."
  }
];
  function formatSize(mb) {
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb < 1 ? mb.toFixed(1) : mb.toFixed(mb % 1 ? 1 : 0)} MB`;
}
  window.CloudData = { categories, files, formatSize };
})();
