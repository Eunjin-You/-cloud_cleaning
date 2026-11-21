// 김서윤의 가상 클라우드. 분류와 중복 정보는 예시 데이터에 직접 지정했습니다.
export const categories = [
  { id: 'assignments', label: '학교 과제', icon: '📄', description: '수업 과제와 팀 프로젝트', color: '#cb7958' },
  { id: 'leisure', label: '유희', icon: '☕', description: '취미와 쉬는 시간의 기록', color: '#bb8062' },
  { id: 'study', label: '공부', icon: '📚', description: '강의 자료와 공부 노트', color: '#778b75' },
  { id: 'media', label: '사진 · 동영상', icon: '📷', description: '일상과 추억을 담은 파일', color: '#aa9475' },
];

const entry = (id, category, name, type, lastAccessMonths, sizeMB, duplicateKey, preview, detail) =>
  ({ id, category, name, type, lastAccessMonths, sizeMB, duplicateKey, preview, detail });

export const files = [
  entry('a1','assignments','회로이론_최종보고서.pdf','PDF',18,4.8,'circuit-report','회로이론 설계 프로젝트\n최종 보고서\n\nRC 회로의 주파수 응답 측정과 결과 분석','2024년 2학기 회로이론 프로젝트 제출본. 실험 방법과 측정 결과가 포함되어 있어요.'),
  entry('a2','assignments','회로이론_최종보고서 (1).pdf','PDF',17,4.8,'circuit-report','회로이론 설계 프로젝트\n최종 보고서\n\nRC 회로의 주파수 응답 측정과 결과 분석','회로이론_최종보고서.pdf와 내용이 같은 사본이에요.'),
  entry('a3','assignments','자료구조_팀발표_최종.pptx','PPTX',14,8.5,'ds-slides','자료구조 팀 프로젝트\n경로 탐색 알고리즘 비교\n\n팀원: 김서윤 외 3명','발표 자료와 알고리즘 비교 표가 담겨 있어요.'),
  entry('a4','assignments','자료구조_팀발표_최종_복사본.pptx','PPTX',13,8.5,'ds-slides','자료구조 팀 프로젝트\n경로 탐색 알고리즘 비교\n\n팀원: 김서윤 외 3명','자료구조_팀발표_최종.pptx와 동일한 사본이에요.'),
  entry('a5','assignments','캡스톤_아이디어_초안.docx','DOCX',11,0.6,null,'캡스톤 디자인 아이디어\n\n1. 스마트 실내 환경 센서\n2. 에너지 사용량 시각화','초기 아이디어와 수정 전 메모가 담겨 있어요.'),
  entry('a6','assignments','캡스톤_최종발표.pdf','PDF',5,12.4,null,'캡스톤 디자인 최종 발표\n스마트 실내 환경 모니터링\n\n프로토타입 및 실험 결과','최종 발표용 자료예요. 실험 사진과 결과 그래프를 포함합니다.'),
  entry('a7','assignments','팀회의_2024_10_14.docx','DOCX',24,0.2,null,'팀 프로젝트 3차 회의\n\n할 일: 회로 테스트, 발표 자료 수정','과거 팀 회의의 일정과 할 일을 정리한 기록이에요.'),
  entry('a8','assignments','수치해석_과제3.zip','ZIP',30,25.6,null,'수치해석 과제 3\n\n코드와 실행 결과가 포함된 압축 파일','과제 제출용 코드와 결과 이미지가 담겨 있어요.'),
  entry('a9','assignments','프로그래밍_실습_결과.txt','TXT',21,0.1,null,'프로그래밍 실습 결과\n\n테스트 1: 통과\n테스트 2: 통과','수업 실습에서 생성한 실행 결과 기록이에요.'),

  entry('l1','leisure','주말_영화목록.pdf','PDF',20,1.4,'movies','보고 싶은 영화 목록\n\n인터스텔라\n리틀 포레스트\n월터의 상상은 현실이 된다','친구와 공유했던 주말 영화 목록이에요.'),
  entry('l2','leisure','주말_영화목록 (1).pdf','PDF',19,1.4,'movies','보고 싶은 영화 목록\n\n인터스텔라\n리틀 포레스트\n월터의 상상은 현실이 된다','주말_영화목록.pdf와 내용이 같은 사본이에요.'),
  entry('l3','leisure','여행_맛집_리스트.txt','TXT',15,0.1,null,'부산 여행 맛집 리스트\n\n해운대 근처 카페\n광안리 저녁 식당','여행 전에 정리했던 식당 후보 목록이에요.'),
  entry('l4','leisure','게임_공략_저장.pdf','PDF',28,6.8,'game','게임 공략 노트\n\n초반 퀘스트와 아이템 위치','게임을 하며 저장한 공략 자료예요.'),
  entry('l5','leisure','게임_공략_저장_복사.pdf','PDF',25,6.8,'game','게임 공략 노트\n\n초반 퀘스트와 아이템 위치','게임_공략_저장.pdf와 같은 내용이에요.'),
  entry('l6','leisure','취미_도예_클래스.jpg','JPG',9,3.2,null,'도예 클래스 안내 이미지\n\n흙을 빚어 작은 컵을 만드는 원데이 클래스','관심 있던 도예 클래스의 안내 이미지예요.'),
  entry('l7','leisure','콘서트_예매안내.pdf','PDF',32,0.9,null,'공연 예매 안내\n\n공연 장소 및 입장 유의사항','지난 공연의 예매 안내문이에요.'),
  entry('l8','leisure','플레이리스트_메모.txt','TXT',6,0.1,null,'밤에 듣기 좋은 노래\n\n잔잔한 기타와 피아노 곡 모음','좋아하는 음악을 적어둔 메모예요.'),
  entry('l9','leisure','카페_쿠폰_스크린샷.png','PNG',23,2.1,null,'카페 쿠폰 캡처\n\n아메리카노 무료 쿠폰','이전에 저장한 카페 쿠폰 이미지예요.'),

  entry('s1','study','전자기학_1주차.pdf','PDF',26,5.2,'em-week1','전자기학 1주차\n전하와 전기장\n\n강의 개요 및 기본 개념','전자기학 강의 자료의 첫 번째 주차예요.'),
  entry('s2','study','전자기학_1주차 (1).pdf','PDF',24,5.2,'em-week1','전자기학 1주차\n전하와 전기장\n\n강의 개요 및 기본 개념','전자기학_1주차.pdf와 같은 자료예요.'),
  entry('s3','study','선형대수_중간고사_정리.pdf','PDF',16,3.5,null,'선형대수 중간고사 정리\n\n행렬, 벡터 공간, 고유값','직접 정리한 개념과 예제 풀이가 담겨 있어요.'),
  entry('s4','study','파이썬_기초_강의노트.pdf','PDF',31,2.3,'python-notes','Python 기초 강의 노트\n\n변수와 자료형\n조건문과 반복문','파이썬 기초 수업의 강의 노트예요.'),
  entry('s5','study','파이썬_기초_강의노트_복사.pdf','PDF',29,2.3,'python-notes','Python 기초 강의 노트\n\n변수와 자료형\n조건문과 반복문','파이썬_기초_강의노트.pdf와 같은 내용이에요.'),
  entry('s6','study','운영체제_기말_요약.docx','DOCX',12,1.1,null,'운영체제 기말고사 요약\n\n프로세스와 스레드\n메모리 관리','시험을 준비하며 작성한 개인 요약이에요.'),
  entry('s7','study','알고리즘_문제풀이.ipynb','IPYNB',8,2.8,null,'알고리즘 문제 풀이\n\n이진 탐색과 정렬 알고리즘 예제','직접 작성한 풀이와 코드가 담겨 있어요.'),
  entry('s8','study','영어_전공단어.xlsx','XLSX',22,0.5,null,'전공 영어 단어 정리\n\ncircuit · algorithm · resistor','수업에서 접한 전공 단어를 정리한 표예요.'),
  entry('s9','study','데이터베이스_참고자료.pdf','PDF',18,7.6,null,'데이터베이스 참고 자료\n\n관계형 데이터베이스와 SQL','수업 보충을 위해 내려받은 참고 자료예요.'),

  entry('m1','media','제주여행_단체사진.jpg','JPG',19,5.3,'jeju-group','제주 여행 단체사진\n\n바다 앞에서 친구들과 찍은 사진','같은 사진의 사본이 함께 저장되어 있어요.'),
  entry('m2','media','제주여행_단체사진 (1).jpg','JPG',18,5.3,'jeju-group','제주 여행 단체사진\n\n바다 앞에서 친구들과 찍은 사진','제주여행_단체사진.jpg와 같은 사진이에요.'),
  entry('m3','media','축제_공연영상.mp4','MP4',21,240,'festival-video','학교 축제 공연 영상\n\n00:48 · 야외 무대','학교 축제에서 찍은 짧은 공연 영상이에요.'),
  entry('m4','media','축제_공연영상_복사.mp4','MP4',20,240,'festival-video','학교 축제 공연 영상\n\n00:48 · 야외 무대','축제_공연영상.mp4와 같은 영상이에요.'),
  entry('m5','media','동아리_단체사진.jpg','JPG',10,4.7,null,'동아리 단체사진\n\n학기 말에 동아리 친구들과 찍은 사진','친구들과 함께 찍은 단체사진이에요.'),
  entry('m6','media','제주_바다_노을.jpg','JPG',19,6.1,null,'제주 바다의 노을\n\n여행 중 촬영한 풍경','제주 여행에서 찍은 노을 사진이에요.'),
  entry('m7','media','시간표_스크린샷.png','PNG',27,1.8,null,'2024년 1학기 시간표\n\n월요일부터 금요일까지의 수업 일정','지난 학기 시간표 캡처예요.'),
  entry('m8','media','실험실_촬영영상.mp4','MP4',7,180,null,'실험실 촬영 영상\n\n01:22 · 센서 동작 시연','팀 프로젝트의 센서 동작을 촬영한 영상이에요.'),
  entry('m9','media','졸업전시_포스터.png','PNG',13,3.8,null,'졸업전시 포스터\n\n일정과 장소가 적힌 안내 이미지','방문하려고 저장해 둔 전시 안내 이미지예요.'),
];

export function duplicateCount(file, activeFiles = files) {
  if (!file.duplicateKey) return 0;
  return Math.max(0, activeFiles.filter(item => item.duplicateKey === file.duplicateKey).length - 1);
}

// 열어보지 않은 기간 60점 + 현재 남아있는 중복 사본 40점(최대 3개).
export function fileScore(file, activeFiles = files) {
  return Math.round(Math.min(file.lastAccessMonths / 36, 1) * 60 + Math.min(duplicateCount(file, activeFiles) / 3, 1) * 40);
}

export function urgency(score) {
  if (score >= 55) return { label: '정리가 시급해요!', level: 'high', color: '#a94437' };
  if (score >= 28) return { label: '정리가 필요해요', level: 'medium', color: '#d28b4d' };
  return { label: '가볍게 살펴봐요', level: 'low', color: '#90a088' };
}

export function formatAge(months) {
  if (months < 1) return '최근';
  const years = Math.floor(months / 12), remainder = months % 12;
  return `${years ? `${years}년 ` : ''}${remainder ? `${remainder}개월 ` : ''}전`;
}

export function formatSize(mb) {
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb < 1 ? mb.toFixed(1) : mb.toFixed(mb % 1 ? 1 : 0)} MB`;
}

export function categoryStats(categoryId, activeFiles = files) {
  const original = files.filter(file => file.category === categoryId);
  const current = activeFiles.filter(file => file.category === categoryId);
  const duplicateGroups = new Map();
  for (const file of current) if (file.duplicateKey) duplicateGroups.set(file.duplicateKey, (duplicateGroups.get(file.duplicateKey) || 0) + 1);
  const duplicates = [...duplicateGroups.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const deleted = original.length - current.length;
  const score = current.length ? Math.round(current.reduce((sum, file) => sum + fileScore(file, activeFiles), 0) / current.length) : 0;
  const age = current.length ? Math.round(current.reduce((sum, file) => sum + file.lastAccessMonths, 0) / current.length) : 0;
  return { total: original.length, count: current.length, deleted, progress: original.length ? deleted / original.length : 0, duplicates, score, age, sizeMB: current.reduce((sum, file) => sum + file.sizeMB, 0) };
}

// 목업용 문서의 첫 부분입니다. 외부 분석이나 AI 분류를 수행하지 않습니다.
const mockFirstText = {
  "a1": "회로이론 설계 프로젝트 최종 보고서\n1. 실험 목적\n저항과 축전기로 구성한 RC 회로에 서로 다른 주파수의 신호를 입력하고, 출력 전압의 크기와 위상 변화를 측정한다. 실험값을 이론값과 비교하여 오차의 원인을 분석한다.",
  "a3": "자료구조 팀 프로젝트 발표\n경로 탐색 알고리즘 비교\n오늘 발표에서는 너비 우선 탐색과 다익스트라 알고리즘의 동작 과정을 설명하고, 그래프 크기에 따른 실행 시간과 메모리 사용량을 비교하겠습니다.",
  "a5": "캡스톤 디자인 아이디어 초안\n1. 스마트 실내 환경 센서\n온도와 이산화탄소 농도를 측정해 환기 시점을 알려준다. 센서 값은 휴대전화 화면에 기록하고, 배터리 사용 시간을 고려해 측정 주기를 조절한다.",
  "a6": "캡스톤 디자인 최종 발표\n스마트 실내 환경 모니터링\n실내 환경을 지속적으로 측정하고 사용자가 현재 상태를 직관적으로 확인할 수 있도록 센서와 대시보드를 제작했습니다. 다음은 프로토타입과 실험 결과입니다.",
  "a7": "팀 프로젝트 3차 회의록\n일시: 2024년 10월 14일\n이번 주에는 회로 측정 결과를 다시 확인하고 발표 자료의 그래프를 수정한다. 각자 담당한 실험 과정과 남은 질문은 금요일까지 공유 문서에 정리한다.",
  "a9": "프로그래밍 실습 실행 결과\n테스트 1: 통과\n테스트 2: 통과\n입력된 정수 배열을 정렬한 뒤 최솟값과 최댓값을 출력했습니다. 빈 배열을 입력한 경우에는 오류 메시지를 표시하고 프로그램을 종료합니다.",
  "l1": "보고 싶은 영화 목록\n인터스텔라: 주말에 다시 보기\n리틀 포레스트: 조용한 저녁에 보기\n월터의 상상은 현실이 된다: 친구들과 함께 보기\n다음에 만날 때 보고 싶은 영화를 각자 하나씩 추가하기.",
  "l3": "부산 여행 맛집 리스트\n해운대 근처: 바다가 보이는 작은 카페, 브런치 가게\n광안리: 저녁에 갈 식당과 산책 코스\n토요일은 사람이 많을 수 있으니 영업시간과 예약 여부를 출발 전에 다시 확인하기.",
  "l4": "게임 공략 노트\n초반 퀘스트와 아이템 위치\n첫 번째 마을에서 지도를 받은 뒤 북쪽 숲으로 이동한다. 회복 아이템은 상점에서 미리 준비하고, 갈림길에서는 동쪽 길로 가면 보물 상자를 찾을 수 있다.",
  "l7": "공연 예매 및 입장 안내\n공연 당일에는 예매 내역과 신분증을 지참해 주세요. 입장은 시작 한 시간 전부터 진행되며, 현장 상황에 따라 대기 시간이 길어질 수 있습니다. 자세한 사항은 예매처 공지를 확인해 주세요.",
  "l8": "밤에 듣기 좋은 플레이리스트\n잔잔한 기타와 피아노 곡 모음\n공부를 마치고 돌아가는 길에 듣기 좋은 곡들을 모았다. 새로 발견한 노래는 제목과 가수를 적고, 나중에 친구에게도 추천할 것.",
  "s1": "전자기학 1주차: 전하와 전기장\n전하는 물질이 전기적 상호작용을 일으키는 물리량이다. 점전하 주변의 전기장은 거리에 따라 달라지며, 여러 전하가 만드는 전기장은 중첩 원리에 따라 더할 수 있다.",
  "s3": "선형대수 중간고사 정리\n벡터공간 V의 공집합이 아닌 부분집합 W가 벡터 덧셈과 스칼라 곱셈에 대해 닫혀 있을 때 W를 부분공간이라 한다. 부분공간은 영벡터를 포함하고, 벡터의 선형결합을 포함한다.",
  "s4": "Python 기초 강의 노트\n1. 변수와 자료형\n변수는 값을 참조하는 이름이다. 정수와 문자열의 차이를 확인하고, 조건문과 반복문을 이용해 입력한 값에 따라 다른 결과가 출력되는 프로그램을 작성한다.",
  "s6": "운영체제 기말고사 요약\n프로세스는 실행 중인 프로그램이며 각각 독립된 주소 공간을 가진다. 스레드는 같은 프로세스의 자원을 공유한다. 문맥 전환과 동기화가 필요한 이유를 예제와 함께 설명할 수 있어야 한다.",
  "s7": "# 알고리즘 문제 풀이\n# 이진 탐색\n정렬된 배열에서 찾는 값과 가운데 값을 비교한다. 찾는 값이 작으면 왼쪽 구간을, 크면 오른쪽 구간을 탐색한다. 반복할 때마다 탐색 범위가 절반으로 줄어든다.",
  "s8": "전공 영어 단어 정리\ncircuit: 회로\nalgorithm: 알고리즘\nresistor: 저항기\n전공 수업과 논문에서 자주 접한 단어를 정리한다. 예문을 하나씩 추가하고 뜻이 헷갈리는 단어는 다음 주에 다시 확인하기.",
  "s9": "데이터베이스 참고 자료\n관계형 데이터베이스는 데이터를 행과 열로 구성된 테이블에 저장한다. 기본키는 각 행을 식별하고 외래키는 테이블 사이의 관계를 나타낸다. 이어서 SQL 조회문의 기본 구조를 살펴본다.",
  "a2": "회로이론 설계 프로젝트 최종 보고서\n1. 실험 목적\n저항과 축전기로 구성한 RC 회로에 서로 다른 주파수의 신호를 입력하고, 출력 전압의 크기와 위상 변화를 측정한다. 실험값을 이론값과 비교하여 오차의 원인을 분석한다.",
  "a4": "자료구조 팀 프로젝트 발표\n경로 탐색 알고리즘 비교\n오늘 발표에서는 너비 우선 탐색과 다익스트라 알고리즘의 동작 과정을 설명하고, 그래프 크기에 따른 실행 시간과 메모리 사용량을 비교하겠습니다.",
  "l2": "보고 싶은 영화 목록\n인터스텔라: 주말에 다시 보기\n리틀 포레스트: 조용한 저녁에 보기\n월터의 상상은 현실이 된다: 친구들과 함께 보기\n다음에 만날 때 보고 싶은 영화를 각자 하나씩 추가하기.",
  "l5": "게임 공략 노트\n초반 퀘스트와 아이템 위치\n첫 번째 마을에서 지도를 받은 뒤 북쪽 숲으로 이동한다. 회복 아이템은 상점에서 미리 준비하고, 갈림길에서는 동쪽 길로 가면 보물 상자를 찾을 수 있다.",
  "s2": "전자기학 1주차: 전하와 전기장\n전하는 물질이 전기적 상호작용을 일으키는 물리량이다. 점전하 주변의 전기장은 거리에 따라 달라지며, 여러 전하가 만드는 전기장은 중첩 원리에 따라 더할 수 있다.",
  "s5": "Python 기초 강의 노트\n1. 변수와 자료형\n변수는 값을 참조하는 이름이다. 정수와 문자열의 차이를 확인하고, 조건문과 반복문을 이용해 입력한 값에 따라 다른 결과가 출력되는 프로그램을 작성한다."
};
for (const file of files) { if (mockFirstText[file.id]) file.preview = mockFirstText[file.id]; }
